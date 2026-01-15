const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// Simple in-memory cache with TTL
let statsCache = null;
let statsCacheTime = null;
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// GET stats
router.get('/stats', async (req, res) => {
    try {
        // Check cache first
        const now = Date.now();
        if (statsCache && statsCacheTime && (now - statsCacheTime < CACHE_TTL)) {
            console.log('📦 Returning cached stats');
            return res.json({ data: statsCache, error: null });
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
        statsCache = stats;
        statsCacheTime = now;

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

module.exports = router;
