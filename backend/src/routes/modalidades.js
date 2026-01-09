const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET all modalidades
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
        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting modalidad:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
