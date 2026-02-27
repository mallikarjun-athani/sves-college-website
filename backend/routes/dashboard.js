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
        const [
            notesResult, galleryResult, announcementsResult, facultyResult,
            alumniResult, admissionsResult, downloadsResult, storiesResult,
            emResult, faqResult
        ] = await Promise.all([
            supabaseAdmin.from('notes').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('gallery').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('announcements').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('faculty').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('alumni').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('admission_applications').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('downloads').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('stories').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('effective_manager').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('faqs').select('id', { count: 'exact', head: true })
        ]);

        res.json({
            notes: notesResult.count || 0,
            gallery: galleryResult.count || 0,
            announcements: announcementsResult.count || 0,
            faculty: facultyResult.count || 0,
            alumni: alumniResult.count || 0,
            admissions: admissionsResult.count || 0,
            downloads: downloadsResult.count || 0,
            stories: storiesResult.count || 0,
            effectiveManager: emResult.count || 0,
            faqs: faqResult.count || 0
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
        const [recentNotes, recentAnnouncements, recentStories, recentAdmissions] = await Promise.all([
            supabaseAdmin
                .from('notes')
                .select('id, title, upload_date')
                .order('upload_date', { ascending: false })
                .limit(4),
            supabaseAdmin
                .from('announcements')
                .select('id, title, created_at')
                .order('created_at', { ascending: false })
                .limit(4),
            supabaseAdmin
                .from('stories')
                .select('id, title, created_at')
                .order('created_at', { ascending: false })
                .limit(4),
            supabaseAdmin
                .from('admission_applications')
                .select('id, name, submitted_at')
                .order('submitted_at', { ascending: false })
                .limit(4)
        ]);

        res.json({
            recentNotes: recentNotes.data || [],
            recentAnnouncements: recentAnnouncements.data || [],
            recentStories: recentStories.data || [],
            recentAdmissions: recentAdmissions.data || []
        });
    } catch (error) {
        console.error('Get recent items error:', error);
        res.status(500).json({ error: 'Failed to fetch recent items' });
    }
});

module.exports = router;
