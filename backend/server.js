const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
// Load .env from root
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'views/frontend'),
    path.join(__dirname, 'views/admin')
]);

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(session({
    secret: process.env.SESSION_SECRET || 'sves_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/Home page', express.static(path.join(__dirname, 'public/Home page')));

// DB Connection
const db = require('./config/db');

// Global middleware to pass session to templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Import Routes
const frontendRoutes = require('./routes/frontend');
const adminRoutes = require('./routes/admin');

app.use('/', frontendRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
