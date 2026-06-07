const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const { course_id, semester, day } = req.query;
        console.log('GET /timetable filters:', { course_id, semester, day });

        let sql = 'SELECT * FROM timetable';
        const conditions = [];
        const values = [];

        if (course_id) {
            const cid = parseInt(course_id);
            if (!isNaN(cid)) { conditions.push('course_id = ?'); values.push(cid); }
        }
        if (semester) {
            const sem = parseInt(semester);
            if (!isNaN(sem)) { conditions.push('semester = ?'); values.push(sem); }
        }
        if (day) { conditions.push('day_of_week = ?'); values.push(day); }

        if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
        sql += ' ORDER BY start_time';

        const [data] = await db.query(sql, values);
        console.log(`GET /timetable result: ${data.length} entries`);
        res.json(data);
    } catch (error) {
        console.error('Get timetable error:', error);
        res.status(500).json({ error: 'Failed to fetch timetable' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { course_id, semester, day_of_week, subject, start_time, end_time, room_no } = req.body;
        console.log('POST /timetable payload:', req.body);

        const [result] = await db.query(
            'INSERT INTO timetable (course_id, semester, day_of_week, subject, start_time, end_time, room_no) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [parseInt(course_id), parseInt(semester), day_of_week, subject, start_time, end_time, room_no || null]
        );

        const [rows] = await db.query('SELECT * FROM timetable WHERE id = ?', [result.insertId]);
        console.log('POST /timetable success:', rows[0]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Post timetable error:', error);
        res.status(500).json({ error: error.message || 'Failed to add timetable entry', details: error });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { course_id, semester, day_of_week, subject, start_time, end_time, room_no } = req.body;

        await db.query(
            'UPDATE timetable SET course_id = ?, semester = ?, day_of_week = ?, subject = ?, start_time = ?, end_time = ?, room_no = ? WHERE id = ?',
            [parseInt(course_id), parseInt(semester), day_of_week, subject, start_time, end_time, room_no || null, req.params.id]
        );

        const [rows] = await db.query('SELECT * FROM timetable WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Update timetable error:', error);
        res.status(500).json({ error: error.message || 'Failed to update entry', details: error });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM timetable WHERE id = ?', [req.params.id]);
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Delete timetable error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete entry', details: error });
    }
});

module.exports = router;
