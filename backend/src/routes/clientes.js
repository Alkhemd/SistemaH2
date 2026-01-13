const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET all clientes without pagination (for dropdowns)
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('cliente')
            .select('cliente_id, nombre, ciudad, estado')
            .order('nombre', { ascending: true });

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error getting all clientes:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET all clientes with equipment count, pagination and search
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let query = supabase
            .from('cliente')
            .select('*', { count: 'exact' });

        // Global search if search term exists
        if (search.trim()) {
            query = query.or(`nombre.ilike.%${search}%,ciudad.ilike.%${search}%,estado.ilike.%${search}%,contacto.ilike.%${search}%`);
        } else {
            // Pagination only when no search
            query = query.range(offset, offset + limit - 1);
        }

        query = query.order('cliente_id', { ascending: false });

        const { data: clientes, error, count } = await query;

        if (error) throw error;

        // Get equipment count for each client
        const clientesConEquipos = await Promise.all(
            clientes.map(async (cliente) => {
                const { count: equiposCount } = await supabase
                    .from('equipo')
                    .select('*', { count: 'exact', head: true })
                    .eq('cliente_id', cliente.cliente_id);

                return { ...cliente, equipos_count: equiposCount || 0 };
            })
        );

        res.json({
            data: clientesConEquipos,
            pagination: {
                page: search.trim() ? 1 : page,
                limit: search.trim() ? count : limit,
                total: count || 0,
                totalPages: search.trim() ? 1 : Math.ceil((count || 0) / limit),
                isSearch: !!search.trim()
            },
            error: null
        });
    } catch (error) {
        console.error('Error getting clientes:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST create cliente
router.post('/', async (req, res) => {
    try {
        const { data: maxIdResult } = await supabase
            .from('cliente')
            .select('cliente_id')
            .order('cliente_id', { ascending: false })
            .limit(1)
            .single();

        const nextId = maxIdResult ? maxIdResult.cliente_id + 1 : 1;
        const dataWithId = { ...req.body, cliente_id: nextId };

        const { data, error } = await supabase
            .from('cliente')
            .insert([dataWithId])
            .select()
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error creating cliente:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// PUT update cliente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('cliente')
            .update(req.body)
            .eq('cliente_id', id)
            .select()
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error updating cliente:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// DELETE cliente
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('cliente')
            .delete()
            .eq('cliente_id', id);

        if (error) throw error;
        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting cliente:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
