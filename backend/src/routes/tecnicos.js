const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET all tecnicos
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
        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting tecnico:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
