const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { logActivity, generateTitle, getClientIP } = require('../utils/activityLogger');

// GET all tecnicos (for dropdowns - returns all)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('tecnico').select('*');

        if (error) throw error;

        // Convert activo to boolean
        const dataTyped = data?.map(t => ({ ...t, activo: t.activo === true || t.activo === 1 }));
        res.json({ data: dataTyped, error: null });
    } catch (error) {
        console.error('Error getting tecnicos:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET paginated tecnicos (for catalog view)
router.get('/paginated', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let query = supabase
            .from('tecnico')
            .select('*', { count: 'exact' });

        if (search.trim()) {
            query = query.or(`nombre.ilike.%${search}%,especialidad.ilike.%${search}%,base_ciudad.ilike.%${search}%`);
        }

        query = query
            .range(offset, offset + limit - 1)
            .order('tecnico_id', { ascending: false });

        const { data, error, count } = await query;

        if (error) throw error;

        // Convert activo to boolean
        const dataTyped = data?.map(t => ({ ...t, activo: t.activo === true || t.activo === 1 }));

        res.json({
            data: dataTyped,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            },
            error: null
        });
    } catch (error) {
        console.error('Error getting paginated tecnicos:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST create tecnico
router.post('/', async (req, res) => {
    try {
        const { data: maxIdResult } = await supabase
            .from('tecnico')
            .select('tecnico_id')
            .order('tecnico_id', { ascending: false })
            .limit(1)
            .single();

        const nextId = maxIdResult ? maxIdResult.tecnico_id + 1 : 1;
        const dataWithId = { ...req.body, tecnico_id: nextId };

        const { data, error } = await supabase
            .from('tecnico')
            .insert([dataWithId])
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'CREATE',
            entidad: 'tecnico',
            entidad_id: data?.tecnico_id,
            titulo: generateTitle('CREATE', 'tecnico', data?.nombre),
            descripcion: `Se registró el técnico ${data?.nombre} - Especialidad: ${data?.especialidad}`,
            datos_nuevo: data,
            ip_address: getClientIP(req)
        });

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error creating tecnico:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// PUT update tecnico
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('tecnico')
            .update(req.body)
            .eq('tecnico_id', id)
            .select()
            .single();

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'UPDATE',
            entidad: 'tecnico',
            entidad_id: parseInt(id),
            titulo: generateTitle('UPDATE', 'tecnico', data?.nombre),
            descripcion: `Se actualizó la información del técnico ${data?.nombre}`,
            datos_nuevo: data,
            ip_address: getClientIP(req)
        });

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error updating tecnico:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// DELETE tecnico
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('tecnico').delete().eq('tecnico_id', id);

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'DELETE',
            entidad: 'tecnico',
            entidad_id: parseInt(id),
            titulo: generateTitle('DELETE', 'tecnico', `#${id}`),
            descripcion: `Se eliminó el técnico con ID ${id}`,
            ip_address: getClientIP(req)
        });

        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting tecnico:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
