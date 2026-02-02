const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/gallery');
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
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// @route   GET /api/gallery
// @desc    Get all gallery images with optional category filter
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        let query = supabasePublic
            .from('gallery')
            .select('*')
            .order('id', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// @route   GET /api/gallery/banners
// @desc    Get banner images for homepage
// @access  Public
router.get('/banners', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('gallery')
            .select('*')
            .eq('category', 'Banner')
            .order('id', { ascending: false })
            .limit(5);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Get banners error:', error);
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

// @route   GET /api/gallery/:id
// @desc    Get single gallery image
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('gallery')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Get gallery image error:', error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

// @route   POST /api/gallery
// @desc    Upload new gallery image
// @access  Private (Admin)
router.post('/', authMiddleware, upload.single('image_file'), async (req, res) => {
    try {
        const { caption, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        if (!caption) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Caption is required' });
        }

        const validCategories = ['Campus', 'Events', 'Cultural', 'Sports', 'Banner'];
        if (category && !validCategories.includes(category)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Invalid category' });
        }

        const imagePath = 'uploads/gallery/' + req.file.filename;

        const { data, error } = await supabaseAdmin
            .from('gallery')
            .insert([{
                image_path: imagePath,
                caption,
                category: category || 'Campus'
            }])
            .select()
            .single();

        if (error) {
            fs.unlinkSync(req.file.path);
            throw error;
        }

        res.status(201).json({
            message: 'Image uploaded successfully',
            image: data
        });
    } catch (error) {
        console.error('Upload gallery error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // First get the image to find the file path
        const { data: image, error: fetchError } = await supabaseAdmin
            .from('gallery')
            .select('image_path')
            .eq('id', req.params.id)
            .single();

        if (fetchError) throw fetchError;

        if (image && image.image_path) {
            // Delete the physical file
            const filePath = path.join(__dirname, '../../', image.image_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete from database
        const { error: deleteError } = await supabaseAdmin
            .from('gallery')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) throw deleteError;

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete gallery error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;
