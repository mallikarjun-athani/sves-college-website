const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        // Get counts from all tables with individual handling to avoid complete failure if one table is missing
        const getCount = async (table) => {
            try {
                const { count, error } = await supabaseAdmin.from(table).select('id', { count: 'exact', head: true });
                if (error) throw error;
                return count || 0;
            } catch (err) {
                console.warn(`Stat error for table ${table}:`, err.message);
                return 0; // Fallback to 0 if table is missing or query fails
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

        res.json({
            notes,
            gallery,
            announcements,
            faculty,
            admissions,
            timetable,
            achievements,
            portfolios
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
