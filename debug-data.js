const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
(async () => {
    const { data: admins } = await s.from('admin').select('id, username, password');
    const { data: courses } = await s.from('courses').select('id, name');
    const { data: notes } = await s.from('notes').select('count');
    const { data: gallery } = await s.from('gallery').select('count');
    const { data: announcements } = await s.from('announcements').select('count');
    console.log('Notes:', notes ? 'Exists' : 'Missing');
    console.log('Gallery:', gallery ? 'Exists' : 'Missing');
    console.log('Announcements:', announcements ? 'Exists' : 'Missing');
})();
