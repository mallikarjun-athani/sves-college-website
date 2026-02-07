const express = require('express');
const router = express.Router();
const { supabasePublic } = require('../config/supabase');

// @route   GET /api/showcase
// @desc    Get all student showcase items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('showcase')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get showcase error:', error);
        res.status(500).json({ error: 'Failed to fetch showcase items' });
    }
});

// @route   GET /api/showcase/:id
// @desc    Get single showcase item
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('showcase')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Item not found' });

        res.json(data);
    } catch (error) {
        console.error('Get showcase item error:', error);
        res.status(500).json({ error: 'Failed to fetch showcase item' });
    }
});

module.exports = router;
