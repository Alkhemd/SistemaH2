const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET all ordenes
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
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
      `);

        if (error) throw error;
        res.json({ data, error: null });
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
