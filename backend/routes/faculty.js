const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Configure multer for faculty image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/faculty');
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// @route   GET /api/faculty
// @desc    Get all faculty members with optional department filter
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { department } = req.query;

        let query = supabasePublic
            .from('faculty')
            .select('*')
            .order('created_at', { ascending: false });

        if (department) {
            query = query.eq('department', department);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({ error: 'Failed to fetch faculty' });
    }
});

// @route   GET /api/faculty/:id
// @desc    Get single faculty member
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('faculty')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Faculty member not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Get faculty member error:', error);
        res.status(500).json({ error: 'Failed to fetch faculty member' });
    }
});

// @route   POST /api/faculty
// @desc    Add new faculty member
// @access  Private (Admin)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, designation, department } = req.body;

        // Validate required fields
        if (!name || !designation || !department) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ error: 'Name, designation, and department are required' });
        }

        let imagePath = null;
        if (req.file) {
            imagePath = 'uploads/faculty/' + req.file.filename;
        }

        const { data, error } = await supabaseAdmin
            .from('faculty')
            .insert([{
                name,
                designation,
                department,
                image_path: imagePath
            }])
            .select()
            .single();

        if (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            throw error;
        }

        res.status(201).json({
            message: 'Faculty member added successfully',
            faculty: data
        });
    } catch (error) {
        console.error('Add faculty error:', error);
        res.status(500).json({ error: 'Failed to add faculty member' });
    }
});

// @route   PUT /api/faculty/:id
// @desc    Update faculty member
// @access  Private (Admin)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, designation, department } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (designation) updateData.designation = designation;
        if (department) updateData.department = department;

        // Handle new image upload
        if (req.file) {
            // Get old image path to delete later
            const { data: oldFaculty } = await supabaseAdmin
                .from('faculty')
                .select('image_path')
                .eq('id', req.params.id)
                .single();

            updateData.image_path = 'uploads/faculty/' + req.file.filename;

            // Delete old image if it exists
            if (oldFaculty && oldFaculty.image_path) {
                const oldPath = path.join(__dirname, '../../', oldFaculty.image_path);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        const { data, error } = await supabaseAdmin
            .from('faculty')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Faculty member not found' });
        }

        res.json({
            message: 'Faculty member updated successfully',
            faculty: data
        });
    } catch (error) {
        console.error('Update faculty error:', error);
        res.status(500).json({ error: 'Failed to update faculty member' });
    }
});

// @route   DELETE /api/faculty/:id
// @desc    Delete faculty member
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // First get the faculty to find the image path
        const { data: faculty, error: fetchError } = await supabaseAdmin
            .from('faculty')
            .select('image_path')
            .eq('id', req.params.id)
            .single();

        if (fetchError) throw fetchError;

        if (faculty && faculty.image_path) {
            // Delete the physical file
            const filePath = path.join(__dirname, '../../', faculty.image_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete from database
        const { error: deleteError } = await supabaseAdmin
            .from('faculty')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) throw deleteError;

        res.json({ message: 'Faculty member deleted successfully' });
    } catch (error) {
        console.error('Delete faculty error:', error);
        res.status(500).json({ error: 'Failed to delete faculty member' });
    }
});

module.exports = router;
