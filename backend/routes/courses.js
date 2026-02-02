const express = require('express');
const router = express.Router();
const { supabasePublic } = require('../config/supabase');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('courses')
            .select('*')
            .order('id');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('courses')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

module.exports = router;
