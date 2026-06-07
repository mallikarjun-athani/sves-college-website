const fs = require('fs');
const path = 'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-notes.html';
let content = fs.readFileSync(path, 'utf8');
const search = 'if (!isLoggedIn()) window.location.href = \'login.html\';\r\n\r\n        \r\n            }\r\n        });\r\n\r\n        const alertEl';
const replace = 'if (!isLoggedIn()) window.location.href = \'login.html\';\r\n\r\n        const alertEl';

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(path, content);
    console.log('✅ Success: Removed corrupted fragment.');
} else {
    // Try with \n only
    const search2 = 'if (!isLoggedIn()) window.location.href = \'login.html\';\n\n        \n            }\n        });\n\n        const alertEl';
    const replace2 = 'if (!isLoggedIn()) window.location.href = \'login.html\';\n\n        const alertEl';
    if (content.includes(search2)) {
        content = content.replace(search2, replace2);
        fs.writeFileSync(path, content);
        console.log('✅ Success: Removed corrupted fragment (Unix line endings).');
    } else {
        console.log('❌ Error: Target sequence not found.');
    }
}
