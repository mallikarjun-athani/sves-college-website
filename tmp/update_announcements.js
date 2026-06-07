const fs = require('fs');
const path = 'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-announcements.html';
let content = fs.readFileSync(path, 'utf8');

const startMarker = 'async function deleteAnnouncement(id) {';
const endMarker = 'document.addEventListener(\'DOMContentLoaded\', loadAnnouncements);';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `async function deleteAnnouncement(id) {
            if (!confirm('Are you sure you want to delete this announcement?')) return;
            try { 
                await apiDelete(\`/announcements/\${id}\`); 
                showAlert('Announcement deleted', false); 
                loadAnnouncements(); 
            }
            catch (e) { showAlert('Failed to delete', true); }
        }

        document.getElementById('add-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            btn.disabled = true;

            const title = document.getElementById('title').value;
            const link = document.getElementById('link').value;
            
            try {
                await apiPost('/announcements', { title, link });
                showAlert('Announcement added successfully!', false);
                document.getElementById('add-form').reset();
                loadAnnouncements();
            } catch (e) { 
                showAlert('Failed to add announcement', true); 
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });

        document.addEventListener('DOMContentLoaded', loadAnnouncements);`;

    const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(path, newContent);
    console.log('✅ Success: Updated Announcement scripts.');
} else {
    console.log('❌ Error: Markers not found.');
}
