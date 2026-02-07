const express = require('express');
const router = express.Router();
const { supabasePublic } = require('../config/supabase');

// @route   GET /api/timetable
// @desc    Get timetable based on filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { course_id, semester, day } = req.query;

        let query = supabasePublic
            .from('timetable')
            .select('*');

        if (course_id) query = query.eq('course_id', course_id);
        if (semester) query = query.eq('semester', semester);
        if (day) query = query.eq('day_of_week', day);

        const { data, error } = await query.order('start_time');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get timetable error:', error);
        res.status(500).json({ error: 'Failed to fetch timetable' });
    }
});

module.exports = router;
