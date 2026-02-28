require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function setup() {
    console.log('Connecting to Supabase at:', process.env.SUPABASE_URL);
    console.log('Checking admissions table...');

    const { data, error } = await supabase.from('admissions').select('id').limit(1);

    if (error) {
        console.log('\nError:', error.message, '\nCode:', error.code);
        console.log('\n========================================');
        console.log('TABLE DOES NOT EXIST - CREATE IT MANUALLY');
        console.log('========================================');
        console.log('\nOpen this link in your browser:\n');
        console.log('https://supabase.com/dashboard/project/waxycnrtwborcwyulrtv/sql/new');
        console.log('\nPaste this SQL:\n');
        console.log(`CREATE TABLE admissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    course_interest TEXT NOT NULL,
    previous_qualification TEXT,
    address TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);`);
        console.log('\nThen click RUN button.');
    } else {
        console.log('✅ Table exists! Rows found:', data.length);
    }
}

setup().catch(e => console.error('Connection error:', e.message));
