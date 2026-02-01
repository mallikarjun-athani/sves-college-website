const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        // Get counts from all tables
        const [notesResult, galleryResult, announcementsResult, facultyResult] = await Promise.all([
            supabaseAdmin.from('notes').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('gallery').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('announcements').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('faculty').select('id', { count: 'exact', head: true })
        ]);

        res.json({
            notes: notesResult.count || 0,
            gallery: galleryResult.count || 0,
            announcements: announcementsResult.count || 0,
            faculty: facultyResult.count || 0
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// @route   GET /api/dashboard/recent
// @desc    Get recent items for dashboard
// @access  Private (Admin)
router.get('/recent', authMiddleware, async (req, res) => {
    try {
        const [recentNotes, recentAnnouncements] = await Promise.all([
            supabaseAdmin
                .from('notes')
                .select('id, title, subject, upload_date')
                .order('upload_date', { ascending: false })
                .limit(5),
            supabaseAdmin
                .from('announcements')
                .select('id, title, created_at')
                .order('created_at', { ascending: false })
                .limit(5)
        ]);

        res.json({
            recentNotes: recentNotes.data || [],
            recentAnnouncements: recentAnnouncements.data || []
        });
    } catch (error) {
        console.error('Get recent items error:', error);
        res.status(500).json({ error: 'Failed to fetch recent items' });
    }
});

module.exports = router;
