const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET all ordenes with pagination, search and filters
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const prioridad = req.query.prioridad || '';
        const estado = req.query.estado || '';
        const offset = (page - 1) * limit;

        let query = supabase
            .from('orden_trabajo')
            .select(`
                *,
                equipo:equipo_id(
                    equipo_id,
                    modelo,
                    numero_serie,
                    fabricante:fabricante_id(fabricante_id, nombre)
                ),
                cliente:cliente_id(cliente_id, nombre)
            `, { count: 'exact' });

        // Apply prioridad filter (case-insensitive exact match)
        if (prioridad.trim()) {
            query = query.ilike('prioridad', prioridad.trim());
        }

        // Apply estado filter (case-insensitive exact match)
        if (estado.trim()) {
            query = query.ilike('estado', estado.trim());
        }

        // If search term exists, search without pagination (return all matches)
        if (search.trim()) {
            query = query.or(`falla_reportada.ilike.%${search}%`);

            const { data, error, count } = await query.order('orden_id', { ascending: false });

            if (error) throw error;

            return res.json({
                data,
                pagination: {
                    page: 1,
                    limit: count || 0,
                    total: count || 0,
                    totalPages: 1,
                    isSearch: true
                },
                error: null
            });
        }

        // No search - apply pagination
        query = query
            .range(offset, offset + limit - 1)
            .order('orden_id', { ascending: false });

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
                isSearch: false
            },
            error: null
        });
    } catch (error) {
        console.error('Error getting ordenes:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET orden by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orden_trabajo')
            .select('*')
            .eq('orden_id', id)
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error getting orden:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST create orden
router.post('/', async (req, res) => {
    try {
        const { data: maxIdResult } = await supabase
            .from('orden_trabajo')
            .select('orden_id')
            .order('orden_id', { ascending: false })
            .limit(1)
            .single();

        const nextId = maxIdResult ? maxIdResult.orden_id + 1 : 1;

        const dataWithDefaults = {
            ...req.body,
            orden_id: nextId,
            fecha_apertura: req.body.fecha_apertura || new Date().toISOString(),
            estado: req.body.estado || 'Abierta',
            prioridad: req.body.prioridad || 'Normal',
            origen: req.body.origen || 'Portal'
        };

        const { data, error } = await supabase
            .from('orden_trabajo')
            .insert([dataWithDefaults])
            .select(`
        *,
        equipo:equipo_id(
          equipo_id,
          modelo,
          numero_serie,
          fabricante:fabricante_id(fabricante_id, nombre)
        ),
        cliente:cliente_id(cliente_id, nombre)
      `)
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error creating orden:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// PUT update orden
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orden_trabajo')
            .update(req.body)
            .eq('orden_id', id)
            .select(`
        *,
        equipo:equipo_id(
          equipo_id,
          modelo,
          numero_serie,
          fabricante:fabricante_id(fabricante_id, nombre)
        ),
        cliente:cliente_id(cliente_id, nombre)
      `)
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error updating orden:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// DELETE orden (with cascade)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get intervenciones
        const { data: intervenciones } = await supabase
            .from('intervencion')
            .select('intervencion_id')
            .eq('orden_id', id);

        if (intervenciones && intervenciones.length > 0) {
            const intervencionIds = intervenciones.map(i => i.intervencion_id);
            await supabase.from('partes_usadas').delete().in('intervencion_id', intervencionIds);
        }

        await supabase.from('intervencion').delete().eq('orden_id', id);
        await supabase.from('evento_orden').delete().eq('orden_id', id);

        const { error } = await supabase.from('orden_trabajo').delete().eq('orden_id', id);

        if (error) throw error;
        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting orden:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
