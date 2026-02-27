const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
(async () => {
    const tables = ['admin', 'courses', 'announcements', 'notes', 'gallery', 'faculty', 'timetable', 'showcase', 'faqs', 'admission_applications'];
    const results = {};
    for (const t of tables) {
        const { error } = await s.from(t).select('id').limit(1);
        results[t] = error ? 'MISSING' : 'OK';
    }
    console.log(JSON.stringify(results, null, 2));
})();
