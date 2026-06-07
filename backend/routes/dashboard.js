const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const getCount = async (table) => {
            try {
                const [rows] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
                return rows[0].count || 0;
            } catch (err) {
                console.warn(`Stat error for table ${table}:`, err.message);
                return 0;
            }
        };

        const [notes, gallery, announcements, faculty, admissions, timetable, achievements, portfolios] = await Promise.all([
            getCount('notes'),
            getCount('gallery'),
            getCount('announcements'),
            getCount('faculty'),
            getCount('admissions'),
            getCount('timetable'),
            getCount('achievements'),
            getCount('portfolios')
        ]);

        res.json({ notes, gallery, announcements, faculty, admissions, timetable, achievements, portfolios });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

router.get('/recent', authMiddleware, async (req, res) => {
    try {
        const [recentNotes] = await db.query(
            'SELECT id, title, subject, upload_date FROM notes ORDER BY upload_date DESC LIMIT 5'
        );
        const [recentAnnouncements] = await db.query(
            'SELECT id, title, created_at FROM announcements ORDER BY created_at DESC LIMIT 5'
        );

        res.json({ recentNotes, recentAnnouncements });
    } catch (error) {
        console.error('Get recent items error:', error);
        res.status(500).json({ error: 'Failed to fetch recent items' });
    }
});

module.exports = router;
