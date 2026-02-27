const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
(async () => {
    const { data, error } = await s.from('timetable').select('*');
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Timetable Data:', JSON.stringify(data, null, 2));
    }
})();
