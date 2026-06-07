const fs = require('fs');
const path = require('path');

async function run() {
    // 1. Get token
    const authRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const authData = await authRes.json();
    const token = authData.token;

    console.log('Login token:', token ? 'Success' : 'Failed');

    // 2. Upload first file
    const formData1 = new FormData();
    formData1.append('caption', 'First Image');
    formData1.append('category', 'Campus');
    // create a fake file blob
    const blob1 = new Blob(['fake image data 1'], { type: 'image/jpeg' });
    formData1.append('image_file', blob1, 'test1.jpg');

    const res1 = await fetch('http://localhost:3000/api/gallery', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData1
    });
    console.log('Upload 1 status:', res1.status);
    console.log('Upload 1 body:', await res1.text());

    // 3. Upload second file
    const formData2 = new FormData();
    formData2.append('caption', 'Second Image');
    formData2.append('category', 'Campus');
    const blob2 = new Blob(['fake image data 2'], { type: 'image/jpeg' });
    formData2.append('image_file', blob2, 'test2.jpg');

    const res2 = await fetch('http://localhost:3000/api/gallery', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData2
    });
    console.log('Upload 2 status:', res2.status);
    console.log('Upload 2 body:', await res2.text());
}

run().catch(console.error);
