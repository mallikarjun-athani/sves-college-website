const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '../../frontend/uploads/faculty');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname.replace(/\s+/g, '_'))
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
    }
});

router.get('/', async (req, res) => {
    try {
        const { department } = req.query;
        let sql = 'SELECT * FROM faculty';
        const values = [];
        if (department) {
            sql += ' WHERE department = ?';
            values.push(department);
        }
        sql += ' ORDER BY created_at DESC';
        const [data] = await db.query(sql, values);
        res.json(data);
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({ error: 'Failed to fetch faculty' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM faculty WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Faculty member not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Get faculty member error:', error);
        res.status(500).json({ error: 'Failed to fetch faculty member' });
    }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, designation, department } = req.body;
        if (!name || !designation || !department) {
            return res.status(400).json({ error: 'Name, designation, and department are required' });
        }

        const filePath = req.file ? `uploads/faculty/${req.file.filename}` : null;

        const [result] = await db.query(
            'INSERT INTO faculty (name, designation, department, image_path) VALUES (?, ?, ?, ?)',
            [name, designation, department, filePath]
        );

        const [rows] = await db.query('SELECT * FROM faculty WHERE id = ?', [result.insertId]);

        res.status(201).json({ message: 'Faculty member added successfully', faculty: rows[0] });
    } catch (error) {
        console.error('Add faculty error:', error);
        if (req.file) {
            const fp = path.join(uploadsDir, req.file.filename);
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        res.status(500).json({ error: 'Failed to add faculty member' });
    }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, designation, department } = req.body;
        const updates = [];
        const values = [];

        if (name) { updates.push('name = ?'); values.push(name); }
        if (designation) { updates.push('designation = ?'); values.push(designation); }
        if (department) { updates.push('department = ?'); values.push(department); }

        if (req.file) {
            // Get old image path to delete
            const [oldRows] = await db.query('SELECT image_path FROM faculty WHERE id = ?', [req.params.id]);
            if (oldRows[0] && oldRows[0].image_path) {
                const oldPath = path.join(__dirname, '../../frontend', oldRows[0].image_path);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updates.push('image_path = ?');
            values.push(`uploads/faculty/${req.file.filename}`);
        }

        if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

        values.push(req.params.id);
        await db.query(`UPDATE faculty SET ${updates.join(', ')} WHERE id = ?`, values);

        const [rows] = await db.query('SELECT * FROM faculty WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Faculty member not found' });

        res.json({ message: 'Faculty member updated successfully', faculty: rows[0] });
    } catch (error) {
        console.error('Update faculty error:', error);
        res.status(500).json({ error: 'Failed to update faculty member' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT image_path FROM faculty WHERE id = ?', [req.params.id]);
        if (rows[0] && rows[0].image_path) {
            const fp = path.join(__dirname, '../../frontend', rows[0].image_path);
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        await db.query('DELETE FROM faculty WHERE id = ?', [req.params.id]);
        res.json({ message: 'Faculty member deleted successfully' });
    } catch (error) {
        console.error('Delete faculty error:', error);
        res.status(500).json({ error: 'Failed to delete faculty member' });
    }
});

module.exports = router;
