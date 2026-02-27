const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Configure multer for RAM storage (to upload to Supabase)
const storage = multer.memoryStorage();

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
// @desc    Upload new note with PDF to Supabase Storage
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

        // Upload to Supabase Storage
        const filename = Date.now() + '_' + req.file.originalname.replace(/\s+/g, '_');
        const filePath = `notes/${filename}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('uploads')
            .upload(filePath, req.file.buffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('uploads')
            .getPublicUrl(filePath);

        // Save metadata to Database
        const { data, error } = await supabaseAdmin
            .from('notes')
            .insert([{
                title,
                course_id: parseInt(course),
                semester: parseInt(semester),
                subject,
                unit,
                file_path: publicUrl // Store the full public URL
            }])
            .select()
            .single();

        if (error) {
            // Cleanup: Delete uploaded file if DB insert fails
            await supabaseAdmin.storage.from('uploads').remove([filePath]);
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

// @route   PUT /api/notes/:id
// @desc    Update note metadata
// @access  Private (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, course, semester, subject, unit } = req.body;
        const updateData = {};

        if (title) updateData.title = title;
        if (course) updateData.course_id = parseInt(course);
        if (semester) updateData.semester = parseInt(semester);
        if (subject) updateData.subject = subject;
        if (unit) updateData.unit = unit;

        const { data, error } = await supabaseAdmin
            .from('notes')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Note not found' });

        res.json({
            message: 'Note updated successfully',
            note: data
        });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note and its PDF file from Storage
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
            // Extract the relative path from the public URL
            // URL format: https://.../storage/v1/object/public/uploads/notes/filename.pdf
            // We need: notes/filename.pdf
            const parts = note.file_path.split('/uploads/');
            if (parts.length > 1) {
                const storagePath = parts[1]; // content after .../uploads/

                // Delete from Storage
                const { error: storageError } = await supabaseAdmin
                    .storage
                    .from('uploads')
                    .remove([storagePath]);

                if (storageError) console.error('Error deleting file from storage:', storageError);
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
