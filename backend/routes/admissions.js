const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { full_name, email, phone, course_interest, previous_qualification, address, message } = req.body;

        if (!full_name || !email || !phone || !course_interest) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const id = require('crypto').randomUUID();

        const [result] = await db.query(
            'INSERT INTO admissions (id, full_name, email, phone, course_interest, previous_qualification, address, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, full_name, email, phone, course_interest, previous_qualification || null, address || null, message || null, 'pending']
        );

        res.status(201).json({ message: 'Application submitted successfully!', data: { id } });
    } catch (error) {
        console.error('Admission submission error:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM admissions ORDER BY created_at DESC');
        res.json(data || []);
    } catch (error) {
        console.error('Fetch admissions error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        await db.query('UPDATE admissions SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

module.exports = router;
