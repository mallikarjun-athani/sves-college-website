const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
(async () => {
    const { data, error } = await s.from('courses').select('*');
    if (error) console.error(error.message);
    else console.log('Courses:', JSON.stringify(data, null, 2));
})();
