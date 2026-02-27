const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
(async () => {
    const { data, error } = await s.from('faculty').select('*');
    if (error) console.log('Faculty table error:', error.message);
    else console.log('Faculty count:', data.length);
})();
