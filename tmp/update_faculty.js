const fs = require('fs');
const path = 'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-faculty.html';
let content = fs.readFileSync(path, 'utf8');

const startMarker = 'async function deleteFaculty(id) {';
const endMarker = 'document.addEventListener(\'DOMContentLoaded\', loadFaculty);';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `async function deleteFaculty(id) {
            if (!confirm('Are you sure you want to delete this faculty member?')) return;
            try { 
                await apiDelete(\`/faculty/\${id}\`); 
                showAlert('Faculty member removed', false); 
                loadFaculty(); 
            }
            catch (e) { showAlert('Failed to delete', true); }
        }

        document.getElementById('add-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            btn.disabled = true;

            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('designation', document.getElementById('designation').value);
            formData.append('department', document.getElementById('department').value);
            if (document.getElementById('image').files[0]) {
                formData.append('image', document.getElementById('image').files[0]);
            }
            try {
                await apiPost('/faculty', formData);
                showAlert('Faculty member added successfully!', false);
                document.getElementById('add-form').reset();
                loadFaculty();
            } catch (e) { 
                showAlert('Failed to add faculty', true); 
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });

        document.addEventListener('DOMContentLoaded', loadFaculty);`;

    const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(path, newContent);
    console.log('✅ Success: Updated Faculty scripts.');
} else {
    console.log('❌ Error: Markers not found.');
}
