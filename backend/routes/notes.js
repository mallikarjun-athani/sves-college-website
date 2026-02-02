const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/notes');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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

        let query = supabasePublic
            .from('notes')
            .select('*')
            .order('upload_date', { ascending: false });

        if (course) {
            query = query.eq('course_id', parseInt(course));
        }
        if (semester) {
            query = query.eq('semester', parseInt(semester));
        }
        if (subject) {
            query = query.ilike('subject', `%${subject}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

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
        const { data, error } = await supabasePublic
            .from('notes')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// @route   POST /api/notes
// @desc    Upload new note with PDF
// @access  Private (Admin)
router.post('/', authMiddleware, upload.single('pdf_file'), async (req, res) => {
    try {
        const { title, course, semester, subject, unit } = req.body;

        // Validate required fields
        if (!title || !course || !semester || !subject || !unit) {
            // Delete uploaded file if validation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'PDF file is required' });
        }

        const filePath = 'uploads/notes/' + req.file.filename;

        const { data, error } = await supabaseAdmin
            .from('notes')
            .insert([{
                title,
                course_id: parseInt(course),
                semester: parseInt(semester),
                subject,
                unit,
                file_path: filePath
            }])
            .select()
            .single();

        if (error) {
            // Delete uploaded file if database insert fails
            fs.unlinkSync(req.file.path);
            throw error;
        }

        res.status(201).json({
            message: 'Note uploaded successfully',
            note: data
        });
    } catch (error) {
        console.error('Upload note error:', error);
        res.status(500).json({ error: 'Failed to upload note' });
    }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note and its PDF file
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // First get the note to find the file path
        const { data: note, error: fetchError } = await supabaseAdmin
            .from('notes')
            .select('file_path')
            .eq('id', req.params.id)
            .single();

        if (fetchError) throw fetchError;

        if (note && note.file_path) {
            // Delete the physical file
            const filePath = path.join(__dirname, '../../', note.file_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete from database
        const { error: deleteError } = await supabaseAdmin
            .from('notes')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) throw deleteError;

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;
