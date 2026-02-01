const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// @route   GET /api/announcements/:id
// @desc    Get single announcement
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('announcements')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Get announcement error:', error);
        res.status(500).json({ error: 'Failed to fetch announcement' });
    }
});

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Private (Admin)
router.post('/', authMiddleware, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('link').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, link } = req.body;

        const { data, error } = await supabaseAdmin
            .from('announcements')
            .insert([{ title, link: link || null }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: 'Announcement added successfully',
            announcement: data
        });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'Failed to create announcement' });
    }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private (Admin)
router.put('/:id', authMiddleware, [
    body('title').optional().trim().notEmpty(),
    body('link').optional().trim()
], async (req, res) => {
    try {
        const { title, link } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (link !== undefined) updateData.link = link;

        const { data, error } = await supabaseAdmin
            .from('announcements')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json({
            message: 'Announcement updated successfully',
            announcement: data
        });
    } catch (error) {
        console.error('Update announcement error:', error);
        res.status(500).json({ error: 'Failed to update announcement' });
    }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('announcements')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
});

module.exports = router;
