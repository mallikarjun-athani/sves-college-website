# Database Setup Instructions

To enable the Admission Application features, you need to create the necessary table in your Supabase database.

## Steps

1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project (`sves-college-harugeri`).
3.  Go to the **SQL Editor** (icon on the left sidebar).
4.  Click **New Query**.
5.  Copy and paste the following SQL code:

```sql
-- ============================================
-- ADMISSION APPLICATIONS TABLE
-- Stores online admission form submissions
-- ============================================
CREATE TABLE IF NOT EXISTS admission_applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    course VARCHAR(100) NOT NULL,
    academic_background TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'admitted', 'rejected')),
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admission_email ON admission_applications(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_admission_status ON admission_applications(status);

-- Enable RLS for admission_applications
-- We enable RLS but do NOT add any policies.
-- This effectively blocks all direct public access.
-- The backend uses the Service Role Key to bypass RLS matching the security best practices.
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;
```

6.  Click **Run** to execute the query.
7.  Verify that the `admission_applications` table appears in the Table Editor.

Once this is done, the admission form and admin management page will function correctly.
