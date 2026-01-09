const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET stats
router.get('/stats', async (req, res) => {
    try {
        // Total equipos
        const { count: totalEquipments } = await supabase
            .from('equipo')
            .select('*', { count: 'exact', head: true });

        // Open orders
        const { count: openOrders } = await supabase
            .from('orden_trabajo')
            .select('*', { count: 'exact', head: true });

        // Equipment in maintenance
        const { count: maintenanceEquipments } = await supabase
            .from('equipo')
            .select('*', { count: 'exact', head: true })
            .eq('estado_equipo', 'En_Mantenimiento');

        // Operative equipment
        const { count: operativeEquipments } = await supabase
            .from('equipo')
            .select('*', { count: 'exact', head: true })
            .eq('estado_equipo', 'Operativo');

        res.json({
            data: {
                totalEquipments: totalEquipments || 0,
                openOrders: openOrders || 0,
                maintenanceEquipments: maintenanceEquipments || 0,
                operativeEquipments: operativeEquipments || 0,
            },
            error: null
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET recent activity
router.get('/activity', async (req, res) => {
    try {
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

            const fecha = orden.fecha_apertura
                ? new Date(orden.fecha_apertura).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
                : 'Fecha desconocida';

            return {
                id: orden.orden_id,
                type: orden.prioridad || 'normal',
                description: orden.falla_reportada || equipoInfo,
                timestamp: fecha,
                status: orden.estado || 'pendiente',
                equipment: equipoInfo,
                client: orden.cliente?.nombre || 'Cliente no especificado',
                time: fecha
            };
        });

        res.json({ data: activities, error: null });
    } catch (error) {
        console.error('Error getting activity:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

module.exports = router;
