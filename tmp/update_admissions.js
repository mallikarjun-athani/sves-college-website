const fs = require('fs');
const path = 'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-admissions.html';
let content = fs.readFileSync(path, 'utf8');

const startMarker = 'async function updateStatus(status) {';
const endMarker = 'document.addEventListener(\'DOMContentLoaded\', loadAdmissions);';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `async function updateStatus(status) {
            if (!currentId) return;
            try {
                await apiPatch(\`/admissions/\${currentId}/status\`, { status });
                // Replace standard alert with something better if needed, but for now keeping it safe
                alert('Success: Status updated to ' + status);
                closeModal();
                loadAdmissions();
            } catch (error) {
                console.error('Update failed:', error);
                alert('Error: Failed to update status.');
            }
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.href = '../index.html';
            });
        }

        document.addEventListener('DOMContentLoaded', loadAdmissions);`;

    const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(path, newContent);
    console.log('✅ Success: Updated Admissions scripts.');
} else {
    console.log('❌ Error: Markers not found.');
}
