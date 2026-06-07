const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Public
router.get('/', async (req, res) => {
    try {
        const [data] = await db.query(
            'SELECT * FROM announcements ORDER BY created_at DESC'
        );

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
        const [rows] = await db.query(
            'SELECT * FROM announcements WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json(rows[0]);
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

        const [result] = await db.query(
            'INSERT INTO announcements (title, link) VALUES (?, ?)',
            [title, link || null]
        );

        // Fetch the inserted row to return it
        const [rows] = await db.query(
            'SELECT * FROM announcements WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Announcement added successfully',
            announcement: rows[0]
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
        const updates = [];
        const values = [];

        if (title !== undefined) {
            updates.push('title = ?');
            values.push(title);
        }
        if (link !== undefined) {
            updates.push('link = ?');
            values.push(link);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(req.params.id);

        await db.query(
            `UPDATE announcements SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const [rows] = await db.query(
            'SELECT * FROM announcements WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json({
            message: 'Announcement updated successfully',
            announcement: rows[0]
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
        await db.query(
            'DELETE FROM announcements WHERE id = ?',
            [req.params.id]
        );

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
});

module.exports = router;
