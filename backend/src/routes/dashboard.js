const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { dashboardCache } = require('../utils/cache');

const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// GET stats
router.get('/stats', async (req, res) => {
    try {
        // Check cache first
        const now = Date.now();
        if (dashboardCache.stats && dashboardCache.timestamp && (now - dashboardCache.timestamp < CACHE_TTL)) {
            console.log('📦 Returning cached stats');
            return res.json({ data: dashboardCache.stats, error: null });
        }

        // Fetch all equipment data in ONE query instead of 3 separate queries
        const { data: equipmentData, error: equipmentError } = await supabase
            .from('equipo')
            .select('estado_equipo');

        if (equipmentError) throw equipmentError;

        // Calculate counts from single result
        const totalEquipments = equipmentData?.length || 0;
        const maintenanceEquipments = equipmentData?.filter(
            eq => eq.estado_equipo === 'En_Mantenimiento'
        ).length || 0;
        const operativeEquipments = equipmentData?.filter(
            eq => eq.estado_equipo === 'Operativo'
        ).length || 0;

        // Fetch order count (separate table, keep as single query)
        const { count: openOrders } = await supabase
            .from('orden_trabajo')
            .select('*', { count: 'exact', head: true })
            .in('estado', ['Abierta', 'Asignada', 'En Proceso']);

        const stats = {
            totalEquipments,
            openOrders: openOrders || 0,
            maintenanceEquipments,
            operativeEquipments,
        };

        // Update cache
        dashboardCache.stats = stats;
        dashboardCache.timestamp = now;

        res.json({ data: stats, error: null });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// Helper function to calculate relative time
function getRelativeTime(dateString) {
    if (!dateString) return 'Fecha desconocida';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return diffMins <= 1 ? 'Hace 1 minuto' : `Hace ${diffMins} minutos`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
    } else if (diffDays < 30) {
        return diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`;
    } else {
        // For older dates, show the actual date
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// GET recent activity - Now uses the actividad table
router.get('/activity', async (req, res) => {
    try {
        // First, try to get activities from the new actividad table
        const { data: actividadData, error: actividadError } = await supabase
            .from('actividad')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        // If we have activities in the table, use them
        if (!actividadError && actividadData && actividadData.length > 0) {
            const activities = actividadData.map(act => ({
                id: act.actividad_id,
                type: act.tipo_operacion,
                description: act.descripcion || act.titulo,
                timestamp: act.created_at,
                status: act.tipo_operacion,
                equipment: act.titulo,
                client: act.entidad,
                time: getRelativeTime(act.created_at),
                // Additional fields from actividad table
                entidad: act.entidad,
                entidad_id: act.entidad_id,
                usuario: act.usuario
            }));

            return res.json({ data: activities, error: null });
        }

        // Fallback: Get recent orders if no activities in the new table
        const { data, error } = await supabase
            .from('orden_trabajo')
            .select(`
                *,
                equipo:equipo_id(numero_serie, modelo),
                cliente:cliente_id(nombre)
            `)
            .order('fecha_apertura', { ascending: false })
            .limit(10);

        if (error) throw error;

        const activities = (data || []).map(orden => {
            const equipoInfo = orden.equipo
                ? `${orden.equipo.modelo || 'Modelo'} (${orden.equipo.numero_serie || 'S/N'})`
                : `Orden #${orden.orden_id}`;

            return {
                id: orden.orden_id,
                type: orden.prioridad || 'Media',
                description: orden.falla_reportada || equipoInfo,
                timestamp: orden.fecha_apertura,
                status: orden.estado || 'Abierta',
                equipment: equipoInfo,
                client: orden.cliente?.nombre || 'Cliente no especificado',
                time: getRelativeTime(orden.fecha_apertura)
            };
        });

        res.json({ data: activities, error: null });
    } catch (error) {
        console.error('Error getting activity:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET chart data
router.get('/charts', async (req, res) => {
    try {
        // Get equipment distribution by status
        const { data: equipmentData, error: equipmentError } = await supabase
            .from('equipo')
            .select('estado_equipo');

        if (equipmentError) throw equipmentError;

        // Count equipment by status
        const equipmentByStatus = {};
        (equipmentData || []).forEach(eq => {
            const status = eq.estado_equipo || 'Desconocido';
            equipmentByStatus[status] = (equipmentByStatus[status] || 0) + 1;
        });

        // Get orders distribution by priority
        const { data: ordersData, error: ordersError } = await supabase
            .from('orden_trabajo')
            .select('prioridad');

        if (ordersError) throw ordersError;

        // Count orders by priority
        const ordersByPriority = {};
        (ordersData || []).forEach(order => {
            const priority = order.prioridad || 'Normal';
            ordersByPriority[priority] = (ordersByPriority[priority] || 0) + 1;
        });

        // Format for charts
        const chartData = {
            equipmentByStatus: Object.entries(equipmentByStatus).map(([name, value]) => ({
                name: name.replace('_', ' '),
                value,
                percentage: ((value / (equipmentData?.length || 1)) * 100).toFixed(1)
            })),
            ordersByPriority: Object.entries(ordersByPriority).map(([name, value]) => ({
                name,
                value,
                percentage: ((value / (ordersData?.length || 1)) * 100).toFixed(1)
            }))
        };

        res.json({ data: chartData, error: null });
    } catch (error) {
        console.error('Error getting chart data:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET trends (Trading chart)
router.get('/trends', async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const daysInt = parseInt(days, 10);

        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - daysInt);
        const startDateString = pastDate.toISOString();

        // Extraer órdenes activas o cerradas desde la fecha
        const { data: ordenes, error } = await supabase
            .from('orden_trabajo')
            .select('fecha_apertura, fecha_cierre')
            .or(`fecha_apertura.gte.${startDateString},fecha_cierre.gte.${startDateString}`);

        if (error) throw error;

        // Generar diccionario de fechas
        const trendsParams = {};
        for (let i = daysInt - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            trendsParams[key] = { date: key, abiertas: 0, cerradas: 0 };
        }

        (ordenes || []).forEach(orden => {
            if (orden.fecha_apertura) {
                const dateKey = orden.fecha_apertura.split('T')[0];
                if (trendsParams[dateKey]) {
                    trendsParams[dateKey].abiertas += 1;
                }
            }
            if (orden.fecha_cierre) {
                const dateKey = orden.fecha_cierre.split('T')[0];
                if (trendsParams[dateKey]) {
                    trendsParams[dateKey].cerradas += 1;
                }
            }
        });

        const trendsArray = Object.values(trendsParams);

        res.json({ data: trendsArray, error: null });
    } catch (error) {
        console.error('Error getting trends:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET summary-stats (Sparklines y % de cambio)
router.get('/summary-stats', async (req, res) => {
    try {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const twoWeeksAgo = new Date(weekAgo);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

        const weekAgoStr = weekAgo.toISOString();
        const twoWeeksAgoStr = twoWeeksAgo.toISOString();

        // Obtener datos globales para contadores y gráficas
        const { data: equiposData, error: eqError } = await supabase
            .from('equipo')
            .select('created_at, estado_equipo');

        const { data: ordenesData, error: ordError } = await supabase
            .from('orden_trabajo')
            .select('fecha_apertura, estado');

        if (eqError) throw eqError;
        if (ordError) throw ordError;

        // Función auxiliar para mini gráficas (últimos 7 días)
        const getSparklineData = (dataArray, dateField) => {
            const result = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dayMatch = d.toISOString().split('T')[0];
                const count = (dataArray || []).filter(item => (item[dateField] || '').startsWith(dayMatch)).length;
                result.push(count);
            }
            return result;
        };

        const totalEquipments = equiposData?.length || 0;
        const maintenanceEquipments = equiposData?.filter(eq => eq.estado_equipo === 'En_Mantenimiento').length || 0;
        const operativeEquipments = equiposData?.filter(eq => eq.estado_equipo === 'Operativo').length || 0;

        const openOrders = ordenesData?.filter(o => ['Abierta', 'Asignada', 'En Proceso'].includes(o.estado)).length || 0;

        // Calcular Deltas % (Nuevos registros en semana actual vs semana previa)
        const newOrdersTw = ordenesData?.filter(o => o.fecha_apertura >= weekAgoStr).length || 0;
        const newOrdersLw = ordenesData?.filter(o => o.fecha_apertura >= twoWeeksAgoStr && o.fecha_apertura < weekAgoStr).length || 0;
        const orderDelta = newOrdersLw > 0 ? ((newOrdersTw - newOrdersLw) / newOrdersLw) * 100 : 0;

        const newEqTw = equiposData?.filter(o => o.created_at >= weekAgoStr).length || 0;
        const newEqLw = equiposData?.filter(o => o.created_at >= twoWeeksAgoStr && o.created_at < weekAgoStr).length || 0;
        const eqDelta = newEqLw > 0 ? ((newEqTw - newEqLw) / newEqLw) * 100 : 0;

        const stats = {
            totalEquipments: {
                value: totalEquipments,
                trend: getSparklineData(equiposData, 'created_at'),
                delta: parseFloat(eqDelta.toFixed(1))
            },
            openOrders: {
                value: openOrders,
                trend: getSparklineData(ordenesData, 'fecha_apertura'),
                delta: parseFloat(orderDelta.toFixed(1))
            },
            maintenanceEquipments: {
                value: maintenanceEquipments,
                trend: getSparklineData(equiposData?.filter(e => e.estado_equipo === 'En_Mantenimiento'), 'created_at'),
                delta: 0
            },
            operativeEquipments: {
                value: operativeEquipments,
                trend: getSparklineData(equiposData?.filter(e => e.estado_equipo === 'Operativo'), 'created_at'),
                delta: 0
            }
        };

        res.json({ data: stats, error: null });
    } catch (error) {
        console.error('Error getting summary stats:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET technician-workload (Carga de Técnicos)
router.get('/technician-workload', async (req, res) => {
    try {
        const { data: ordenes, error } = await supabase
            .from('orden_trabajo')
            .select(`
                orden_id,
                estado,
                prioridad,
                usuario_asignado,
                tecnico:usuario_asignado (nombre, avatar_url)
            `)
            .in('estado', ['Abierta', 'Asignada', 'En Proceso']);

        if (error) throw error;

        // Agrupar por técnico
        const techParams = {};

        (ordenes || []).forEach(orden => {
            const tecId = orden.usuario_asignado || 'Sin Asignar';
            let name = orden.tecnico?.nombre || (tecId === 'Sin Asignar' ? 'Sin Asignar' : 'Técnico ID: ' + tecId);

            // Optional: You could fetch tech names from another table/auth later
            // if needed, keeping it structured and fail-safe for now.

            if (!techParams[tecId]) {
                techParams[tecId] = {
                    id: tecId,
                    name,
                    avatar_url: orden.tecnico?.avatar_url || null,
                    orders: 0,
                    urgentes: 0
                };
            }

            techParams[tecId].orders += 1;
            if (orden.prioridad === 'Alta' || orden.prioridad === 'Crítica' || orden.prioridad === 'Urgente') {
                techParams[tecId].urgentes += 1;
            }
        }); const workloadArray = Object.values(techParams)
            .filter(tech => tech.id !== 'Sin Asignar')
            .sort((a, b) => b.orders - a.orders);

        res.json({ data: workloadArray, error: null });
    } catch (error) {
        console.error('Error getting technician workload:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

module.exports = router;
