const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
(async () => {
    const { data, error } = await s.rpc('get_tables'); // rpc might fail if not defined
    if (error) {
        // try direct SQL if we had it, but we don't.
        // Let's try to query a table we KNOW exists and see if it works.
        const { data: c, error: e } = await s.from('courses').select('name');
        console.log('Courses table check:', e ? e.message : 'OK (' + c.length + ' rows)');

        // Let's try 'timetable' again with a VERY simple query
        const { error: e2 } = await s.from('timetable').select('*').limit(1);
        console.log('Timetable table check:', e2 ? e2.message : 'OK');
    } else {
        console.log('All Tables:', data.map(t => t.table_name));
    }
})();
