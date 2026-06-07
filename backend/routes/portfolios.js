const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '../../frontend/uploads/portfolios');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `portfolio_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`)
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
        const { category } = req.query;
        let sql = 'SELECT * FROM portfolios';
        const values = [];
        if (category && category !== 'All') {
            sql += ' WHERE category = ?';
            values.push(category);
        }
        sql += ' ORDER BY created_at DESC';
        const [data] = await db.query(sql, values);
        res.json(data);
    } catch (error) {
        console.error('Get portfolios error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolios' });
    }
});

router.post('/', authMiddleware, upload.single('image_file'), async (req, res) => {
    try {
        const { student_name, student_course, title, description, category, project_link } = req.body;
        if (!student_name || !title || !description) {
            return res.status(400).json({ error: 'Student name, title and description are required' });
        }

        const filePath = req.file ? `uploads/portfolios/${req.file.filename}` : null;

        const validCategories = ['Web Development', 'Research Papers', 'Fine Arts', 'Commerce Projects', 'Social Work', 'Science', 'Other'];
        const safeCategory = validCategories.includes(category) ? category : 'Other';

        const [result] = await db.query(
            'INSERT INTO portfolios (student_name, student_course, title, description, category, project_link, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [student_name, student_course || '', title, description, safeCategory, project_link || null, filePath]
        );

        const [rows] = await db.query('SELECT * FROM portfolios WHERE id = ?', [result.insertId]);
        res.status(201).json({ message: 'Portfolio added successfully', portfolio: rows[0] });
    } catch (error) {
        console.error('Post portfolio error:', error);
        if (req.file) {
            const fp = path.join(uploadsDir, req.file.filename);
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        res.status(500).json({ error: 'Failed to add portfolio' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM portfolios WHERE id = ?', [req.params.id]);
        if (rows[0] && rows[0].image_path) {
            const fp = path.join(__dirname, '../../frontend', rows[0].image_path);
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        await db.query('DELETE FROM portfolios WHERE id = ?', [req.params.id]);
        res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        console.error('Delete portfolio error:', error);
        res.status(500).json({ error: 'Failed to delete portfolio' });
    }
});

module.exports = router;
