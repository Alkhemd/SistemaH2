const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET all fabricantes
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
        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting fabricante:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
