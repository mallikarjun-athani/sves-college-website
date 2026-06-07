const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../frontend/uploads/notes');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// @route   GET /api/notes
// @desc    Get all notes with optional filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { course, semester, subject } = req.query;

        let sql = 'SELECT * FROM notes';
        const conditions = [];
        const values = [];

        if (course) {
            conditions.push('course_id = ?');
            values.push(parseInt(course));
        }
        if (semester) {
            conditions.push('semester = ?');
            values.push(parseInt(semester));
        }
        if (subject) {
            conditions.push('subject LIKE ?');
            values.push(`%${subject}%`);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY upload_date DESC';

        const [data] = await db.query(sql, values);

        res.json(data);
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM notes WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// @route   POST /api/notes
// @desc    Upload new note with PDF to local storage
// @access  Private (Admin)
router.post('/', authMiddleware, upload.single('pdf_file'), async (req, res) => {
    try {
        const { title, course, semester, subject, unit } = req.body;

        // Validate required fields
        if (!title || !course || !semester || !subject || !unit) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'PDF file is required' });
        }

        // Store relative path for serving via express static
        const filePath = `uploads/notes/${req.file.filename}`;

        // Save metadata to Database
        const [result] = await db.query(
            'INSERT INTO notes (title, course_id, semester, subject, unit, file_path) VALUES (?, ?, ?, ?, ?, ?)',
            [title, parseInt(course), parseInt(semester), subject, unit, filePath]
        );

        const [rows] = await db.query(
            'SELECT * FROM notes WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Note uploaded successfully',
            note: rows[0]
        });
    } catch (error) {
        console.error('Upload note error:', error);
        // Cleanup: Delete uploaded file if DB insert fails
        if (req.file) {
            const fullPath = path.join(uploadsDir, req.file.filename);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        res.status(500).json({ error: 'Failed to upload note' });
    }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note and its PDF file from storage
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // First get the note to find the file path
        const [rows] = await db.query(
            'SELECT file_path FROM notes WHERE id = ?',
            [req.params.id]
        );

        const note = rows[0];

        if (note && note.file_path) {
            // Delete local file
            const fullPath = path.join(__dirname, '../../frontend', note.file_path);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        // Delete from database
        await db.query(
            'DELETE FROM notes WHERE id = ?',
            [req.params.id]
        );

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;
