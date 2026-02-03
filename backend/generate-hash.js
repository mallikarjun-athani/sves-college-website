/**
 * Utility script to generate bcrypt password hashes
 * Run with: node generate-hash.js <password>
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';

const hash = bcrypt.hashSync(password, 10);

console.log(`
Password: ${password}
Hash: ${hash}

Use this hash in your SQL to insert the admin user:

INSERT INTO admin (username, password) 
VALUES ('admin', '${hash}')
ON CONFLICT (username) DO UPDATE SET password = '${hash}';
`);
