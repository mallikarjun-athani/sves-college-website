const express = require('express');
const router = express.Router();
const { supabasePublic, supabaseAdmin } = require('../config/supabase');
const auth = require('../middleware/auth');

// @route   GET /api/timetable
// @desc    Get timetable based on filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { course_id, semester, day } = req.query;
        console.log('GET /timetable filters:', { course_id, semester, day });

        let query = supabasePublic
            .from('timetable')
            .select('*');

        if (course_id) {
            const cid = parseInt(course_id);
            if (!isNaN(cid)) query = query.eq('course_id', cid);
        }

        if (semester) {
            const sem = parseInt(semester);
            if (!isNaN(sem)) query = query.eq('semester', sem);
        }

        if (day) query = query.eq('day_of_week', day);

        const { data, error } = await query.order('start_time');

        if (error) {
            console.error('Supabase query error:', error);
            throw error;
        }

        console.log(`GET /timetable result: ${data.length} entries`);
        res.json(data);
    } catch (error) {
        console.error('Get timetable error:', error);
        res.status(500).json({ error: 'Failed to fetch timetable' });
    }
});

// @route   POST /api/timetable
// @desc    Add new timetable entry
// @access  Admin
router.post('/', auth, async (req, res) => {
    try {
        const { course_id, semester, day_of_week, subject, start_time, end_time, room_no } = req.body;
        console.log('POST /timetable payload:', req.body);

        // Ensure course_id and semester are numbers if they are being passed as strings
        const courseIdInt = parseInt(course_id);
        const semesterInt = parseInt(semester);

        const { data, error } = await supabaseAdmin
            .from('timetable')
            .insert([{
                course_id: courseIdInt,
                semester: semesterInt,
                day_of_week,
                subject,
                start_time,
                end_time,
                room_no
            }])
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            throw error;
        }

        console.log('POST /timetable success:', data[0]);
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Post timetable error:', error);
        res.status(500).json({
            error: error.message || 'Failed to add timetable entry',
            details: error
        });
    }
});

// @route   PUT /api/timetable/:id
// @desc    Update timetable entry
// @access  Admin
router.put('/:id', auth, async (req, res) => {
    try {
        const { course_id, semester, day_of_week, subject, start_time, end_time, room_no } = req.body;

        const { data, error } = await supabaseAdmin
            .from('timetable')
            .update({
                course_id: parseInt(course_id),
                semester: parseInt(semester),
                day_of_week,
                subject,
                start_time,
                end_time,
                room_no
            })
            .eq('id', req.params.id)
            .select();

        if (error) {
            console.error('Supabase update error:', error);
            throw error;
        }

        res.json(data[0]);
    } catch (error) {
        console.error('Update timetable error:', error);
        res.status(500).json({
            error: error.message || 'Failed to update entry',
            details: error
        });
    }
});

// @route   DELETE /api/timetable/:id
// @desc    Delete timetable entry
// @access  Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('timetable')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Delete timetable error:', error);
        res.status(500).json({
            error: error.message || 'Failed to delete entry',
            details: error
        });
    }
});

module.exports = router;
