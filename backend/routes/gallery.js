const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../frontend/uploads/gallery');
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
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
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

        let sql = 'SELECT * FROM gallery';
        const values = [];

        if (category) {
            sql += ' WHERE category = ?';
            values.push(category);
        }

        sql += ' ORDER BY id DESC';

        const [data] = await db.query(sql, values);

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
        const [data] = await db.query(
            "SELECT * FROM gallery WHERE category = 'Banner' ORDER BY id DESC LIMIT 5"
        );

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
        const [rows] = await db.query(
            'SELECT * FROM gallery WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get gallery image error:', error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

// @route   POST /api/gallery
// @desc    Upload new gallery image to local storage
// @access  Private (Admin)
router.post('/', authMiddleware, upload.single('image_file'), async (req, res) => {
    try {
        const { caption, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        if (!caption) {
            return res.status(400).json({ error: 'Caption is required' });
        }

        const validCategories = ['Campus', 'Events', 'Cultural', 'Sports', 'Banner'];
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        const filePath = `uploads/gallery/${req.file.filename}`;

        const [result] = await db.query(
            'INSERT INTO gallery (image_path, caption, category) VALUES (?, ?, ?)',
            [filePath, caption, category || 'Campus']
        );

        const [rows] = await db.query(
            'SELECT * FROM gallery WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Image uploaded successfully',
            image: rows[0]
        });
    } catch (error) {
        console.error('Upload gallery error:', error);
        // Cleanup uploaded file on error
        if (req.file) {
            const fullPath = path.join(uploadsDir, req.file.filename);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image from storage and DB
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // First get the image to find the file path
        const [rows] = await db.query(
            'SELECT image_path FROM gallery WHERE id = ?',
            [req.params.id]
        );

        const image = rows[0];

        if (image && image.image_path) {
            // Delete local file
            const fullPath = path.join(__dirname, '../../frontend', image.image_path);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        // Delete from database
        await db.query(
            'DELETE FROM gallery WHERE id = ?',
            [req.params.id]
        );

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete gallery error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;
