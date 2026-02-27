const express = require('express');
const router = express.Router();
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// GET all effective manager entries
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('effective_manager')
            .select('*')
            .order('id', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch effective manager entries' });
    }
});

// POST new entry
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, link, category } = req.body;
        const { data, error } = await supabaseAdmin
            .from('effective_manager')
            .insert([{ title, description, link, category: category || 'General' }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add entry' });
    }
});

// PUT update entry
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, link, category } = req.body;
        const { data, error } = await supabaseAdmin
            .from('effective_manager')
            .update({ title, description, link, category })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update entry' });
    }
});

// DELETE entry
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabaseAdmin.from('effective_manager').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete entry' });
    }
});

module.exports = router;
