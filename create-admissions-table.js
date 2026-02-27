require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function createTable() {
    console.log('Creating admissions table...');

    const { data, error } = await supabase.rpc('exec_sql', {
        query: `
            CREATE TABLE IF NOT EXISTS admissions (
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
            );
            
            ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Allow public inserts" ON admissions FOR INSERT WITH CHECK (true);
            CREATE POLICY "Allow service role all" ON admissions FOR ALL USING (true);
        `
    });

    if (error) {
        console.log('RPC method not available, trying direct insert approach...');

        // Try a direct insert to check if table exists
        const { error: testError } = await supabase
            .from('admissions')
            .select('id')
            .limit(1);

        if (testError && testError.message.includes('does not exist')) {
            console.error('\n❌ The "admissions" table does not exist in Supabase.');
            console.log('\n📋 Please go to your Supabase Dashboard:');
            console.log('   1. Open your project at https://supabase.com/dashboard');
            console.log('   2. Go to "SQL Editor" (left sidebar)');
            console.log('   3. Paste and run this SQL:\n');
            console.log(`
CREATE TABLE admissions (
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
);

ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role all" ON admissions FOR ALL TO service_role USING (true);
            `);
        } else if (testError) {
            console.error('Error:', testError.message);
        } else {
            console.log('✅ Table "admissions" already exists!');
        }
    } else {
        console.log('✅ Table created successfully!');
    }
}

createTable();
