const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { logActivity, generateTitle, getClientIP } = require('../utils/activityLogger');

// GET all fabricantes (for dropdowns - returns all)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('fabricante').select('*');

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error getting fabricantes:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET paginated fabricantes (for catalog view)
router.get('/paginated', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let query = supabase
            .from('fabricante')
            .select('*', { count: 'exact' });

        if (search.trim()) {
            query = query.ilike('nombre', `%${search}%`);
        }

        query = query
            .range(offset, offset + limit - 1)
            .order('fabricante_id', { ascending: false });

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
        console.error('Error getting paginated fabricantes:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST create fabricante
router.post('/', async (req, res) => {
    try {
        const { data: maxIdResult } = await supabase
            .from('fabricante')
            .select('fabricante_id')
            .order('fabricante_id', { ascending: false })
            .limit(1)
            .single();

        const nextId = maxIdResult ? maxIdResult.fabricante_id + 1 : 1;

        const { data, error } = await supabase
            .from('fabricante')
            .insert([{ ...req.body, fabricante_id: nextId }])
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'CREATE',
            entidad: 'fabricante',
            entidad_id: data?.fabricante_id,
            titulo: generateTitle('CREATE', 'fabricante', data?.nombre),
            descripcion: `Se registró el fabricante ${data?.nombre}`,
            datos_nuevo: data,
            ip_address: getClientIP(req)
        });

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error creating fabricante:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// PUT update fabricante
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('fabricante')
            .update(req.body)
            .eq('fabricante_id', id)
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'UPDATE',
            entidad: 'fabricante',
            entidad_id: parseInt(id),
            titulo: generateTitle('UPDATE', 'fabricante', data?.nombre),
            descripcion: `Se actualizó la información del fabricante ${data?.nombre}`,
            datos_nuevo: data,
            ip_address: getClientIP(req)
        });

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error updating fabricante:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// DELETE fabricante
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('fabricante').delete().eq('fabricante_id', id);

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'DELETE',
            entidad: 'fabricante',
            entidad_id: parseInt(id),
            titulo: generateTitle('DELETE', 'fabricante', `#${id}`),
            descripcion: `Se eliminó el fabricante con ID ${id}`,
            ip_address: getClientIP(req)
        });

        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting fabricante:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
