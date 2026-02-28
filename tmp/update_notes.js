const fs = require('fs');
const path = 'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-notes.html';
let content = fs.readFileSync(path, 'utf8');

// Target the entire script block that we've been trying to replace
const startMarker = 'async function deleteNote(id) {';
const endMarker = 'document.addEventListener(\'DOMContentLoaded\', loadNotes);';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `async function deleteNote(id) {
            if (!confirm('Are you sure you want to delete this note?')) return;
            try { 
                await apiDelete(\`/notes/\${id}\`); 
                showAlert('Note deleted successfully', false); 
                loadNotes(); 
            }
            catch (e) { showAlert('Failed to delete note', true); }
        }

        document.getElementById('upload-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            btn.disabled = true;

            const formData = new FormData();
            formData.append('title', document.getElementById('title').value);
            formData.append('course', document.getElementById('course').value);
            formData.append('semester', document.getElementById('semester').value);
            formData.append('subject', document.getElementById('subject').value);
            formData.append('unit', document.getElementById('unit').value);
            formData.append('pdf_file', document.getElementById('pdf_file').files[0]);
            
            try {
                await apiPost('/notes', formData);
                showAlert('Note uploaded successfully!', false);
                document.getElementById('upload-form').reset();
                loadNotes();
            } catch (e) { 
                showAlert('Failed to upload note', true); 
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });

        document.addEventListener('DOMContentLoaded', loadNotes);`;

    const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(path, newContent);
    console.log('✅ Success: Updated Manage Notes scripts.');
} else {
    console.log('❌ Error: Start or end markers not found.');
    console.log('Start index:', startIndex);
    console.log('End index:', endIndex);
}
