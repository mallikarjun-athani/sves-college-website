const fs = require('fs');
const files = [
    'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-gallery.html',
    'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-notes.html',
    'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-faculty.html',
    'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-announcements.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    const corrupted = /\n\s+[\r\n]+\s+}\s+[\r\n]+\s+}\);\r?\n\r?\n\s+const alertEl/g;
    // Actually, looking at the view_file output:
    // 160:         
    // 161:             }
    // 162:         });
    // 163: 
    // 164:         const alertEl = ...

    // Safer to just replace the specific fragment
    const fragment = /\r?\n\s+[\r\n]+\r?\n\s+}\r?\n\s+}\);\r?\n/g;

    // Let's be even more specific based on line numbers 160-162
    const lines = content.split(/\r?\n/);
    let changed = false;

    // Find the lines: empty/whitespace, then }, then });
    for (let i = 0; i < lines.length - 2; i++) {
        if (lines[i].trim() === '' && lines[i + 1].trim() === '}' && lines[i + 2].trim() === '});') {
            lines.splice(i, 3);
            changed = true;
            break;
        }
    }

    if (changed) {
        fs.writeFileSync(file, lines.join('\n'));
        console.log(`✅ Fixed: ${file}`);
    } else {
        console.log(`ℹ️ Already clean or markers not found: ${file}`);
    }
});
