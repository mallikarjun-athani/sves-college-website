/**
 * SVES College Website - Node.js Backend Server
 * 
 * This Express server provides RESTful API endpoints for the college website,
 * replacing the previous PHP backend with Supabase as the database.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const announcementsRoutes = require('./routes/announcements');
const notesRoutes = require('./routes/notes');
const galleryRoutes = require('./routes/gallery');
const facultyRoutes = require('./routes/faculty');
const dashboardRoutes = require('./routes/dashboard');
const coursesRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS for frontend
app.use(cors({
    origin: ['http://localhost', 'http://127.0.0.1', 'http://localhost:5500'],
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/courses', coursesRoutes);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'SVES Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// Handle multer errors
app.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size is too large' });
    }
    if (error.message === 'Only PDF files are allowed') {
        return res.status(400).json({ error: 'Only PDF files are allowed' });
    }
    if (error.message === 'Only image files are allowed') {
        return res.status(400).json({ error: 'Only image files are allowed' });
    }
    next(error);
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// Handle 404 - Route not found
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     SVES College Backend API Server        ║
╠════════════════════════════════════════════╣
║  Status:  Running                          ║
║  Port:    ${PORT}                              ║
║  Mode:    ${process.env.NODE_ENV || 'development'}                      ║
╚════════════════════════════════════════════╝

API Endpoints:
  Auth:          POST /api/auth/login, /logout, /verify
  Announcements: GET/POST/PUT/DELETE /api/announcements
  Notes:         GET/POST/DELETE /api/notes
  Gallery:       GET/POST/DELETE /api/gallery
  Faculty:       GET/POST/PUT/DELETE /api/faculty
  Dashboard:     GET /api/dashboard/stats
  Courses:       GET /api/courses
  Health:        GET /api/health
    `);
});

module.exports = app;
