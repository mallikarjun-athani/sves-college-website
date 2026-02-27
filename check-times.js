const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
(async () => {
    const { data, error } = await s.from('timetable').select('subject, start_time, end_time').limit(2);
    if (error) console.error(error.message);
    else {
        data.forEach((row, i) => {
            console.log(`Row ${i}:`);
            console.log(`  Subject: ${row.subject}`);
            console.log(`  Start: ${JSON.stringify(row.start_time)}`);
            console.log(`  End: ${JSON.stringify(row.end_time)}`);
        });
    }
})();
