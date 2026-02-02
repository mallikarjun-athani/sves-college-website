-- ============================================
-- SVES College Website - Supabase Database Schema
-- PostgreSQL compatible SQL for Supabase
-- ============================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMIN TABLE
-- Stores admin users for backend access
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default admin user (password: admin123)
-- Generated using bcrypt with 10 rounds
INSERT INTO admin (username, password) 
VALUES ('admin', '$2a$10$gR2nuGhumpJnYrGoTty30.MG6pQCKXXIJ8wEFfk1U/S/UPPeuDqLi')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- COURSES TABLE
-- Stores available courses/programs
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50)
);

-- Insert default courses
INSERT INTO courses (id, name, description, icon) VALUES 
    (1, 'BCA', 'Bachelor of Computer Applications', 'fa-laptop-code'),
    (2, 'BA', 'Bachelor of Arts', 'fa-book'),
    (3, 'B.Com', 'Bachelor of Commerce', 'fa-chart-line'),
    (4, 'B.Sc', 'Bachelor of Science', 'fa-flask')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ANNOUNCEMENTS TABLE
-- Stores college announcements/notices
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTES TABLE
-- Stores study notes/materials uploaded by admin
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_id INT REFERENCES courses(id) ON DELETE SET NULL,
    semester INT CHECK (semester >= 1 AND semester <= 6),
    subject VARCHAR(100),
    unit VARCHAR(100),
    file_path VARCHAR(255),
    upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_notes_course ON notes(course_id);
CREATE INDEX IF NOT EXISTS idx_notes_semester ON notes(semester);

-- ============================================
-- GALLERY TABLE
-- Stores images for campus gallery
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Campus' 
        CHECK (category IN ('Campus', 'Events', 'Cultural', 'Sports', 'Banner')),
    caption VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- ============================================
-- FACULTY TABLE
-- Stores faculty member information
-- ============================================
CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for department filtering
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- For Supabase security
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

-- Public read access for frontend tables
CREATE POLICY "Allow public read access to courses" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to announcements" ON announcements
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to notes" ON notes
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to gallery" ON gallery
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to faculty" ON faculty
    FOR SELECT USING (true);

-- Admin table is NOT publicly readable (authenticate via API)
CREATE POLICY "Deny public access to admin" ON admin
    FOR SELECT USING (false);

-- Full access for service role (backend operations)
-- Note: Service role bypasses RLS by default in Supabase

-- ============================================
-- STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- ============================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a bucket called "uploads"
-- 3. Set it to public (for notes/gallery access)
-- 4. Or use signed URLs for private access

-- Example storage policies (run in SQL editor or via Dashboard):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
