-- ============================================
-- SVES College Website - Fix Missing Tables & Constraints
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. UPDATE TIMETABLE CONSTRAINT (Support up to Semester 8)
ALTER TABLE IF EXISTS timetable 
DROP CONSTRAINT IF EXISTS timetable_semester_check;

ALTER TABLE IF EXISTS timetable 
ADD CONSTRAINT timetable_semester_check CHECK (semester >= 1 AND semester <= 8);

-- 2. CREATE MISSING NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_id INT REFERENCES courses(id) ON DELETE SET NULL,
    semester INT CHECK (semester >= 1 AND semester <= 8),
    subject VARCHAR(100),
    unit VARCHAR(100),
    file_path VARCHAR(255),
    upload_date TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notes' AND policyname = 'Allow public read access to notes') THEN
        CREATE POLICY "Allow public read access to notes" ON notes FOR SELECT USING (true);
    END IF;
END $$;

-- 3. CREATE MISSING FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Allow public read access to faqs') THEN
        CREATE POLICY "Allow public read access to faqs" ON faqs FOR SELECT USING (true);
    END IF;
END $$;

-- 4. CREATE MISSING STORIES TABLE
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100) DEFAULT 'General',
    image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stories' AND policyname = 'Allow public read access to stories') THEN
        CREATE POLICY "Allow public read access to stories" ON stories FOR SELECT USING (true);
    END IF;
END $$;

-- 5. CREATE MISSING EFFECTIVE MANAGER TABLE
CREATE TABLE IF NOT EXISTS effective_manager (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link TEXT,
    category VARCHAR(100) DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE effective_manager ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'effective_manager' AND policyname = 'Allow public read access to effective_manager') THEN
        CREATE POLICY "Allow public read access to effective_manager" ON effective_manager FOR SELECT USING (true);
    END IF;
END $$;

-- 6. CREATE MISSING SHOWCASE TABLE
CREATE TABLE IF NOT EXISTS showcase (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Project', 'Research Paper', 'Portfolio')),
    student_name VARCHAR(255),
    description TEXT,
    thumbnail_url VARCHAR(255),
    content_url VARCHAR(255),
    gallery_images JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE showcase ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'showcase' AND policyname = 'Allow public read access to showcase') THEN
        CREATE POLICY "Allow public read access to showcase" ON showcase FOR SELECT USING (true);
    END IF;
END $$;

-- 7. STORAGE SETUP (Create uploads bucket & set up policies)
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access (Required for files to be accessible by URL)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access for Uploads') THEN
        CREATE POLICY "Public Access for Uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
    END IF;
END $$;

-- Allow authenticated uploads (Required for admin to upload)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin Upload to Uploads') THEN
        CREATE POLICY "Admin Upload to Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
    END IF;
END $$;

-- 8. ADD SAMPLE DATA FOR NOTES (Optional)
INSERT INTO notes (title, course_id, semester, subject, unit, file_path)
SELECT 'Sample Note', id, 1, 'General', 'Unit 1', 'https://example.com/sample.pdf'
FROM courses
WHERE name = 'BCA'
OR name = 'Bachelor of Computer Applications'
LIMIT 1;
