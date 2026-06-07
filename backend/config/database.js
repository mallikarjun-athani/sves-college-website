const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sves_college',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Enable named placeholders for cleaner queries
    namedPlaceholders: true,
    // Timezone configuration
    timezone: '+05:30',
    // Convert DATETIME to JS Date objects
    dateStrings: false
});

// Test connection on startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('\x1b[32m✔\x1b[0m  MySQL connected successfully to database:', process.env.DB_NAME || 'sves_college');
        connection.release();
    } catch (err) {
        console.error('\x1b[31m✖  MySQL connection failed:\x1b[0m', err.message);
        console.error('   Make sure MySQL is running in XAMPP and the database exists.');
        process.exit(1);
    }
})();

module.exports = pool;
