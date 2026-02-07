const express = require('express');
const router = express.Router();
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/faqs
// @desc    Get all FAQs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('faqs')
            .select('*')
            .order('priority', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Get FAQs error:', error);
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
});

// @route   POST /api/faqs
// @desc    Add new FAQ
// @access  Private (Admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { question, answer, category, priority } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }

        const { data, error } = await supabaseAdmin
            .from('faqs')
            .insert([{ question, answer, category, priority: parseInt(priority) || 0 }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Add FAQ error:', error);
        res.status(500).json({ error: 'Failed to add FAQ' });
    }
});

// @route   PUT /api/faqs/:id
// @desc    Update FAQ
// @access  Private (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { question, answer, category, priority } = req.body;
        const updateData = {};

        if (question) updateData.question = question;
        if (answer) updateData.answer = answer;
        if (category) updateData.category = category;
        if (priority !== undefined) updateData.priority = parseInt(priority);

        const { data, error } = await supabaseAdmin
            .from('faqs')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Update FAQ error:', error);
        res.status(500).json({ error: 'Failed to update FAQ' });
    }
});

// @route   DELETE /api/faqs/:id
// @desc    Delete FAQ
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('faqs')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        console.error('Delete FAQ error:', error);
        res.status(500).json({ error: 'Failed to delete FAQ' });
    }
});

module.exports = router;
