const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
(async () => {
    const tables = ['courses', 'timetable', 'announcements'];
    for (const t of tables) {
        const { error } = await s.from(t).select('id').limit(1);
        console.log(`${t}: ${error ? 'MISSING (' + error.message + ')' : 'OK'}`);
    }
})();
