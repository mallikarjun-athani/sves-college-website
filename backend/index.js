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

// Enable CORS for frontend (allow both local and production)
const allowedOrigins = ['http://localhost', 'http://127.0.0.1', 'http://localhost:5500', 'http://localhost:3000'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Allow all Vercel preview deployments
        if (origin && origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // Allow in development mode
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));



// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

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

// Only start the server if this file is run directly (not imported as a module for Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        const localUrl = `http://localhost:${PORT}`;
        console.log(`
        \x1b[36m╔══════════════════════════════════════════════════════════╗\x1b[0m
        \x1b[36m║\x1b[0m \x1b[1m\x1b[35m         🚀 SVES COLLEGE - BACKEND RUNNING           \x1b[0m \x1b[36m║\x1b[0m
        \x1b[36m╠══════════════════════════════════════════════════════════╣\x1b[0m
        \x1b[36m║\x1b[0m  \x1b[32m✔\x1b[0m  Frontend & API:  \x1b[1m\x1b[34m${localUrl}\x1b[0m              \x1b[36m║\x1b[0m
        \x1b[36m║\x1b[0m  \x1b[32m✔\x1b[0m  Environment:     \x1b[33m${process.env.NODE_ENV || 'development'}\x1b[0m                        \x1b[36m║\x1b[0m
        \x1b[36m║\x1b[0m  \x1b[32m✔\x1b[0m  Port:            \x1b[33m${PORT}\x1b[0m                               \x1b[36m║\x1b[0m
        \x1b[36m╚══════════════════════════════════════════════════════════╝\x1b[0m

        \x1b[1mQuick Access:\x1b[0m
        \x1b[32m➜\x1b[0m  \x1b[1mHome:\x1b[0m       \x1b[34m${localUrl}/\x1b[0m
        \x1b[32m➜\x1b[0m  \x1b[1mAdmin:\x1b[0m      \x1b[34m${localUrl}/admin/login.html\x1b[0m
        \x1b[32m➜\x1b[0m  \x1b[1mHealth:\x1b[0m     \x1b[34m${localUrl}/api/health\x1b[0m
        `);
    });
}

module.exports = app;
