async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/courses');
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Fetch Error:', e.message);
    }
}
test();
