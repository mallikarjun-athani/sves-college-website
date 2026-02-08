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
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const announcementsRoutes = require('./routes/announcements');
const notesRoutes = require('./routes/notes');
const galleryRoutes = require('./routes/gallery');
const facultyRoutes = require('./routes/faculty');
const dashboardRoutes = require('./routes/dashboard');
const coursesRoutes = require('./routes/courses');
const timetableRoutes = require('./routes/timetable');
const showcaseRoutes = require('./routes/showcase');
const faqRoutes = require('./routes/faqs');
const admissionsRoutes = require('./routes/admissions');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// ENVIRONMENT VALIDATION
// ============================================
const requiredEnv = ['JWT_SECRET', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'SUPABASE_ANON_KEY'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0) {
    console.error(`\x1b[31mCRITICAL ERROR: Missing environment variables: ${missingEnv.join(', ')}\x1b[0m`);
    process.exit(1);
}

// ============================================
// MIDDLEWARE
// ============================================

// Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "*.supabase.co"],
            "script-src": ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
            "connect-src": ["'self'", "http://localhost:*", "http://127.0.0.1:*", "https://*.supabase.co", "https://*.vercel.app"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
        },
    },
}));

// Request Logging
app.use(morgan('dev'));

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    message: { error: 'Too many login attempts, please try again in an hour.' }
});

// Apply general limiter to all routes
app.use('/api/', generalLimiter);
// Apply stricter limiter to login specifically
app.use('/api/auth/login', loginLimiter);

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
app.use('/api/timetable', timetableRoutes);
app.use('/api/showcase', showcaseRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/admissions', admissionsRoutes);

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
    const server = app.listen(PORT, () => {
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

    // Graceful Shutdown
    process.on('SIGINT', () => {
        console.log('Shutting down server...');
        server.close(() => {
            console.log('Server closed. Goodbye!');
            process.exit(0);
        });
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            console.log('Process terminated.');
            process.exit(0);
        });
    });
}

module.exports = app;
