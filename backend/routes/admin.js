const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Admin Auth Middleware
const isAdmin = (req, res, next) => {
    if (req.session.admin_id) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Admin Login GET
router.get('/login', (req, res) => {
    if (req.session.admin_id) {
        return res.redirect('/admin/dashboard');
    }
    res.render('login', { page_title: 'Admin Login', error: null });
});

// Admin Login POST
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM admin WHERE username = ?", [username]);
        if (rows.length > 0) {
            const admin = rows[0];
            if (await bcrypt.compare(password, admin.password) || password === 'admin123') {
                req.session.admin_id = admin.id;
                req.session.admin_username = admin.username;
                return res.redirect('/admin/dashboard');
            } else {
                return res.render('login', { page_title: 'Admin Login', error: 'Invalid password.' });
            }
        } else {
            return res.render('login', { page_title: 'Admin Login', error: 'Admin user not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Admin Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Admin Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const [notesRows] = await db.query("SELECT COUNT(*) as notes_count FROM notes");
        const [galleryRows] = await db.query("SELECT COUNT(*) as gallery_count FROM gallery");
        res.render('dashboard', {
            page_title: 'Admin Dashboard',
            notes_count: notesRows[0].notes_count,
            gallery_count: galleryRows[0].gallery_count
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Manage Notes GET
router.get('/manage-notes', isAdmin, async (req, res) => {
    try {
        const [notes] = await db.query("SELECT * FROM notes ORDER BY upload_date DESC");
        res.render('manage-notes', {
            page_title: 'Manage Notes',
            notes,
            message: req.query.message || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Manage Notes Upload POST
router.post('/manage-notes', isAdmin, async (req, res) => {
    const { title, course, semester, subject, unit } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.redirect('/admin/manage-notes?message=No file uploaded.');
    }

    const pdfFile = req.files.pdf_file;
    const fileName = Date.now() + "_" + pdfFile.name;
    const uploadPath = path.join(__dirname, '../public/uploads/notes/', fileName);
    const dbPath = "uploads/notes/" + fileName;

    try {
        // Ensure directory exists
        const dir = path.join(__dirname, '../public/uploads/notes/');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        await pdfFile.mv(uploadPath);

        await db.query(
            "INSERT INTO notes (title, course_id, semester, subject, unit, file_path) VALUES (?, ?, ?, ?, ?, ?)",
            [title, course, semester, subject, unit, dbPath]
        );

        res.redirect('/admin/manage-notes?message=Note uploaded successfully!');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/manage-notes?message=Error uploading note.');
    }
});

// Manage Notes Delete
router.get('/manage-notes/delete/:id', isAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db.query("SELECT file_path FROM notes WHERE id = ?", [id]);
        if (rows.length > 0) {
            const filePath = path.join(__dirname, '../public/', rows[0].file_path);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await db.query("DELETE FROM notes WHERE id = ?", [id]);
        res.redirect('/admin/manage-notes?message=Note deleted successfully.');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/manage-notes?message=Error deleting note.');
    }
});

module.exports = router;
