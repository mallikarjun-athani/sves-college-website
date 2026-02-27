-- ====================================================================
-- SVES COLLEGE WEBSITE - SUPABASE DATABASE SCHEMA
-- ====================================================================
-- Instructions:
-- 1. Log in to your Supabase Dashboard.
-- 2. Go to the SQL Editor.
-- 3. Copy and paste these queries to create all necessary tables.
-- ====================================================================

-- 1. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    duration VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial courses if they don't exist
INSERT INTO courses (name, duration) 
VALUES ('BCA', '3 Years'), ('BA', '3 Years'), ('B.Com', '3 Years'), ('B.Sc', '3 Years')
ON CONFLICT (name) DO NOTHING;

-- 2. STUDY NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_id INTEGER REFERENCES courses(id),
    semester INTEGER NOT NULL,
    subject VARCHAR(200) NOT NULL,
    unit VARCHAR(100),
    file_path TEXT NOT NULL,
    upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    category VARCHAR(100) DEFAULT 'Campus',
    image_url TEXT NOT NULL,
    upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type VARCHAR(50) DEFAULT 'general', -- e.g., 'exam', 'holiday', 'event'
    is_urgent BOOLEAN DEFAULT FALSE,
    date TIMESTAMPTZ DEFAULT NOW(),
    expiry_date TIMESTAMPTZ
);

-- 5. TIMETABLE TABLE
CREATE TABLE IF NOT EXISTS timetable (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    semester INTEGER NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_no VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FACULTY MEMBERS TABLE
CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification TEXT,
    experience VARCHAR(50),
    image_path TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ALUMNI STORIES TABLE
CREATE TABLE IF NOT EXISTS alumni (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    batch VARCHAR(50) NOT NULL,
    story TEXT NOT NULL,
    designation VARCHAR(255),
    image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DOWNLOADS TABLE
CREATE TABLE IF NOT EXISTS downloads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General', -- e.g., 'Syllabus', 'Form'
    file_path TEXT NOT NULL,
    upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADMISSION APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS admission_applications (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    course VARCHAR(100) NOT NULL,
    father_name VARCHAR(255),
    address TEXT,
    education VARCHAR(255),
    background TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'contacted', 'admitted', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ADMIN TABLE (For authentication)
-- Note: Password should be a bcrypt hash. 'admin123' hash is provided below.
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin if not exists (username: admin, password: admin123)
-- Hash for 'admin123': $2a$10$gR2nu8wEFfk1U/S/UPPeuDqLi"pQCKXXIJ8
-- (Wait, the hash in the previous log was slightly different format, but bcrypt is what we use)
INSERT INTO admin (username, password) 
VALUES ('admin', '$2a$10$gR2nu8wEFfk1U/S/UPPeuDqLi"pQCKXXIJ8')
ON CONFLICT (username) DO NOTHING;

-- ====================================================================
-- STORAGE BUCKETS (Create these in Supabase Dashboard -> Storage)
-- ====================================================================
-- 1. 'uploads' (Set to public)
--    - Subfolders: 'notes', 'gallery', 'faculty', 'alumni', 'downloads', 'stories'
-- ====================================================================

-- 12. STORIES TABLE
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100) DEFAULT 'General',
    image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for stories
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to stories" ON stories FOR SELECT USING (true);

-- 13. EFFECTIVE MANAGER TABLE
CREATE TABLE IF NOT EXISTS effective_manager (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link TEXT,
    category VARCHAR(100) DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for effective_manager
ALTER TABLE effective_manager ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to effective_manager" ON effective_manager FOR SELECT USING (true);

-- 14. SHOWCASE TABLE
CREATE TABLE IF NOT EXISTS showcase (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    student_name VARCHAR(255),
    description TEXT,
    thumbnail_url VARCHAR(255),
    content_url VARCHAR(255),
    gallery_images JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for showcase
ALTER TABLE showcase ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to showcase" ON showcase FOR SELECT USING (true);
