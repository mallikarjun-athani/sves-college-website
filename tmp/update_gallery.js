const fs = require('fs');
const path = 'c:\\xampp1\\htdocs\\SVES website\\frontend\\admin\\manage-gallery.html';
let content = fs.readFileSync(path, 'utf8');

const startMarker = 'async function deleteImage(id) {';
const endMarker = 'document.addEventListener(\'DOMContentLoaded\', loadGallery);';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `async function deleteImage(id) {
            if (!confirm('Are you sure you want to delete this image?')) return;
            try { 
                await apiDelete(\`/gallery/\${id}\`); 
                showAlert('Image deleted from gallery', false); 
                loadGallery(); 
            }
            catch (e) { showAlert('Failed to delete image', true); }
        }

        document.getElementById('upload-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            btn.disabled = true;

            const formData = new FormData();
            formData.append('caption', document.getElementById('caption').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('image_file', document.getElementById('image_file').files[0]);
            
            try {
                await apiPost('/gallery', formData);
                showAlert('Image uploaded successfully!', false);
                document.getElementById('upload-form').reset();
                loadGallery();
            } catch (e) { 
                showAlert('Failed to upload image', true); 
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });

        document.addEventListener('DOMContentLoaded', loadGallery);`;

    const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(path, newContent);
    console.log('✅ Success: Updated Gallery scripts.');
} else {
    console.log('❌ Error: Markers not found.');
}
