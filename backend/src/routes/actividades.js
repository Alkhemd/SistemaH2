const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET all activities with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const entidad = req.query.entidad || '';
        const tipo = req.query.tipo || '';
        const offset = (page - 1) * limit;

        let query = supabase
            .from('actividad')
            .select('*', { count: 'exact' });

        // Filtrar por entidad si se especifica
        if (entidad) {
            query = query.eq('entidad', entidad);
        }

        // Filtrar por tipo de operación si se especifica
        if (tipo) {
            query = query.eq('tipo_operacion', tipo);
        }

        // Ordenar por fecha descendente y aplicar paginación
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            },
            error: null
        });
    } catch (error) {
        console.error('Error getting activities:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET recent activities (for dashboard)
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const { data, error } = await supabase
            .from('actividad')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error getting recent activities:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST create activity (log an action)
router.post('/', async (req, res) => {
    try {
        const {
            tipo_operacion,
            entidad,
            entidad_id,
            titulo,
            descripcion,
            datos_anterior,
            datos_nuevo,
            usuario
        } = req.body;

        // Validar campos requeridos
        if (!tipo_operacion || !entidad || !titulo) {
            return res.status(400).json({
                data: null,
                error: 'tipo_operacion, entidad y titulo son requeridos'
            });
        }

        // Obtener IP del cliente
        const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;

        const { data, error } = await supabase
            .from('actividad')
            .insert([{
                tipo_operacion,
                entidad,
                entidad_id: entidad_id || null,
                titulo,
                descripcion: descripcion || null,
                datos_anterior: datos_anterior || null,
                datos_nuevo: datos_nuevo || null,
                usuario: usuario || 'Sistema',
                ip_address
            }])
            .select()
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// DELETE activity by ID (for cleanup if needed)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('actividad')
            .delete()
            .eq('actividad_id', id);

        if (error) throw error;
        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE all activities older than X days
router.delete('/cleanup/:days', async (req, res) => {
    try {
        const days = parseInt(req.params.days) || 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const { error, count } = await supabase
            .from('actividad')
            .delete()
            .lt('created_at', cutoffDate.toISOString());

        if (error) throw error;
        res.json({ deleted: count || 0, error: null });
    } catch (error) {
        console.error('Error cleaning up activities:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
