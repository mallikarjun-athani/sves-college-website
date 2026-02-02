const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Please check your .env file.');
    process.exit(1);
}

// Service client for backend operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Public client for read-only operations
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabaseAdmin, supabasePublic };
