const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkTable() {
    console.log('Checking for admissions table...');
    const { data, error } = await supabase
        .from('admissions')
        .select('id')
        .limit(1);

    if (error) {
        if (error.code === '42P01') {
            console.error('\n❌ TABLE MISSING: The "admissions" table does not exist in your Supabase database.');
            console.log('\nPlease run this SQL in your Supabase SQL Editor:\n');
            console.log(`
CREATE TABLE admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course_interest TEXT NOT NULL,
  previous_qualification TEXT NOT NULL,
  address TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert
CREATE POLICY "Allow public inserts" ON admissions FOR INSERT WITH CHECK (true);

-- Allow admin to read/update
CREATE POLICY "Allow admin all" ON admissions FOR ALL USING (true);
            `);
        } else {
            console.error('Error checking table:', error.message);
        }
    } else {
        console.log('✅ Success: "admissions" table exists and is accessible.');
    }
}

checkTable();
