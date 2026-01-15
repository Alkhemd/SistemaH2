const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { logActivity, generateTitle, getClientIP } = require('../utils/activityLogger');

// GET all modalidades (for dropdowns - returns all)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('modalidad').select('*');

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error getting modalidades:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET paginated modalidades (for catalog view)
router.get('/paginated', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let query = supabase
            .from('modalidad')
            .select('*', { count: 'exact' });

        if (search.trim()) {
            query = query.or(`codigo.ilike.%${search}%,descripcion.ilike.%${search}%`);
        }

        query = query
            .range(offset, offset + limit - 1)
            .order('modalidad_id', { ascending: false });

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
        console.error('Error getting paginated modalidades:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST create modalidad
router.post('/', async (req, res) => {
    try {
        const { data: maxIdResult } = await supabase
            .from('modalidad')
            .select('modalidad_id')
            .order('modalidad_id', { ascending: false })
            .limit(1)
            .single();

        const nextId = maxIdResult ? maxIdResult.modalidad_id + 1 : 1;

        const { data, error } = await supabase
            .from('modalidad')
            .insert([{ ...req.body, modalidad_id: nextId }])
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'CREATE',
            entidad: 'modalidad',
            entidad_id: data?.modalidad_id,
            titulo: generateTitle('CREATE', 'modalidad', data?.codigo),
            descripcion: `Se registró la modalidad ${data?.codigo}: ${data?.descripcion}`,
            datos_nuevo: data,
            ip_address: getClientIP(req)
        });

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error creating modalidad:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// PUT update modalidad
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('modalidad')
            .update(req.body)
            .eq('modalidad_id', id)
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'UPDATE',
            entidad: 'modalidad',
            entidad_id: parseInt(id),
            titulo: generateTitle('UPDATE', 'modalidad', data?.codigo),
            descripcion: `Se actualizó la modalidad ${data?.codigo}`,
            datos_nuevo: data,
            ip_address: getClientIP(req)
        });

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error updating modalidad:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// DELETE modalidad
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('modalidad').delete().eq('modalidad_id', id);

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'DELETE',
            entidad: 'modalidad',
            entidad_id: parseInt(id),
            titulo: generateTitle('DELETE', 'modalidad', `#${id}`),
            descripcion: `Se eliminó la modalidad con ID ${id}`,
            ip_address: getClientIP(req)
        });

        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting modalidad:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
