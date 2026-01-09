const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET all equipos
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('equipo')
            .select(`
        *,
        fabricante:fabricante_id(fabricante_id, nombre),
        modalidad:modalidad_id(modalidad_id, codigo, descripcion),
        cliente:cliente_id(cliente_id, nombre)
      `);

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error getting equipos:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST create equipo
router.post('/', async (req, res) => {
    try {
        // Get next ID
        const { data: maxIdResult } = await supabase
            .from('equipo')
            .select('equipo_id')
            .order('equipo_id', { ascending: false })
            .limit(1)
            .single();

        const nextId = maxIdResult ? maxIdResult.equipo_id + 1 : 1;
        const dataWithId = { ...req.body, equipo_id: nextId };

        const { data, error } = await supabase
            .from('equipo')
            .insert([dataWithId])
            .select(`
        *,
        fabricante:fabricante_id(fabricante_id, nombre),
        modalidad:modalidad_id(modalidad_id, codigo, descripcion),
        cliente:cliente_id(cliente_id, nombre)
      `)
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error creating equipo:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// PUT update equipo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('equipo')
            .update(req.body)
            .eq('equipo_id', id)
            .select(`
        *,
        fabricante:fabricante_id(fabricante_id, nombre),
        modalidad:modalidad_id(modalidad_id, codigo, descripcion),
        cliente:cliente_id(cliente_id, nombre)
      `)
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error updating equipo:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// DELETE equipo (with cascade)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get related ordenes
        const { data: ordenes } = await supabase
            .from('orden_trabajo')
            .select('orden_id')
            .eq('equipo_id', id);

        if (ordenes && ordenes.length > 0) {
            const ordenIds = ordenes.map(o => o.orden_id);

            // Get intervenciones
            const { data: intervenciones } = await supabase
                .from('intervencion')
                .select('intervencion_id')
                .in('orden_id', ordenIds);

            if (intervenciones && intervenciones.length > 0) {
                const intervencionIds = intervenciones.map(i => i.intervencion_id);
                await supabase.from('partes_usadas').delete().in('intervencion_id', intervencionIds);
            }

            await supabase.from('intervencion').delete().in('orden_id', ordenIds);
            await supabase.from('evento_orden').delete().in('orden_id', ordenIds);
            await supabase.from('orden_trabajo').delete().in('orden_id', ordenIds);
        }

        await supabase.from('calibracion').delete().eq('equipo_id', id);
        await supabase.from('mantenimiento').delete().eq('equipo_id', id);

        const { error } = await supabase.from('equipo').delete().eq('equipo_id', id);

        if (error) throw error;
        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting equipo:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
