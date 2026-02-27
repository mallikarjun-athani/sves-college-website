const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
(async () => {
    // This is what the frontend timetable.html does
    const course_id = 1;
    const semester = 1;
    const day = 'Monday';

    console.log(`Querying: id=${course_id}, sem=${semester}, day=${day}`);

    const { data, error } = await s.from('timetable')
        .select('*')
        .eq('course_id', course_id)
        .eq('semester', semester)
        .eq('day_of_week', day)
        .order('start_time');

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Results count:', data.length);
        if (data.length > 0) {
            console.log('Sample result:', JSON.stringify(data[0], null, 2));
        }
    }
})();
