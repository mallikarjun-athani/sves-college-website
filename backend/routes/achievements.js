const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '../../frontend/uploads/achievements');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `achievement_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`)
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
    }
});

router.get('/', async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM achievements ORDER BY created_at DESC');
        res.json(data);
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

router.post('/', authMiddleware, upload.single('image_file'), async (req, res) => {
    try {
        const { title, description, achievement_date } = req.body;
        if (!title || !description || !achievement_date) {
            return res.status(400).json({ error: 'Title, description, and date are required' });
        }

        const filePath = req.file ? `uploads/achievements/${req.file.filename}` : null;

        const [result] = await db.query(
            'INSERT INTO achievements (title, description, achievement_date, image_path) VALUES (?, ?, ?, ?)',
            [title, description, achievement_date, filePath]
        );

        const [rows] = await db.query('SELECT * FROM achievements WHERE id = ?', [result.insertId]);

        res.status(201).json({ message: 'Achievement added successfully', achievement: rows[0] });
    } catch (error) {
        console.error('Post achievement error:', error);
        if (req.file) {
            const fp = path.join(uploadsDir, req.file.filename);
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        res.status(500).json({ error: 'Failed to add achievement' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM achievements WHERE id = ?', [req.params.id]);
        if (rows[0] && rows[0].image_path) {
            const fp = path.join(__dirname, '../../frontend', rows[0].image_path);
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        await db.query('DELETE FROM achievements WHERE id = ?', [req.params.id]);
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        console.error('Delete achievement error:', error);
        res.status(500).json({ error: 'Failed to delete achievement' });
    }
});

module.exports = router;
