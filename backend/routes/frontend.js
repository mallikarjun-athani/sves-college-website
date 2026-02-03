const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Home page
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT image_path FROM gallery WHERE category = 'Banner' ORDER BY id DESC LIMIT 1");
        let hero_bg = "/Home page/photes/collage ground.png";
        if (rows.length > 0) {
            hero_bg = "/" + rows[0].image_path;
        }
        res.render('index', { page_title: 'Home', hero_bg });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// About page
router.get('/about', (req, res) => {
    res.render('about', { page_title: 'About Us' });
});

// Admissions page
router.get('/admissions', (req, res) => {
    res.render('admissions', { page_title: 'Admissions' });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('contact', { page_title: 'Contact Us' });
});

// Courses page
router.get('/courses', (req, res) => {
    res.render('courses', { page_title: 'Our Courses' });
});

// Departments page
router.get('/departments', (req, res) => {
    res.render('departments', { page_title: 'Departments' });
});

// Faculty page
router.get('/faculty', (req, res) => {
    res.render('faculty', { page_title: 'Our Faculty' });
});

// Gallery page
router.get('/gallery', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM gallery ORDER BY id DESC");
        res.render('gallery', { page_title: 'Gallery', gallery_items: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Notes page
router.get('/notes', async (req, res) => {
    try {
        const { course, semester, subject } = req.query;
        let query = "SELECT * FROM notes WHERE 1=1";
        const params = [];

        if (course) {
            query += " AND course_id = ?";
            params.push(course);
        }
        if (semester) {
            query += " AND semester = ?";
            params.push(semester);
        }
        if (subject) {
            query += " AND subject LIKE ?";
            params.push(`%${subject}%`);
        }
        query += " ORDER BY upload_date DESC";

        const [rows] = await db.query(query, params);
        res.render('notes', {
            page_title: 'Notes & Resources',
            notes: rows,
            filters: { course, semester, subject }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Placements page
router.get('/placements', (req, res) => {
    res.render('placements', { page_title: 'Placements' });
});

// Student Corner page
router.get('/student-corner', (req, res) => {
    res.render('student-corner', { page_title: 'Student Corner' });
});

// Login page
router.get('/login', (req, res) => {
    res.render('login', { page_title: 'Student Login' });
});

module.exports = router;
