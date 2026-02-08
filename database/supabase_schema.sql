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
    icon VARCHAR(50),
    duration VARCHAR(50),
    eligibility TEXT,
    subjects TEXT,
    career_options JSONB,
    fee_estimate VARCHAR(50)
);

-- Insert default courses with full details for comparison
INSERT INTO courses (id, name, description, icon, duration, eligibility, subjects, career_options, fee_estimate) VALUES 
    (1, 'BCA', 'Bachelor of Computer Applications', 'fa-laptop-code', '3 Years (6 Sem)', 'PUC II / Class 12 (Science / Commerce with Math)', 'Programming in C/Java, Data Structures, DBMS, Web Development, AI Basics', '["Software Engineer", "Web Developer", "Systems Admin", "App Developer"]', '₹ 22,000'),
    (2, 'BA', 'Bachelor of Arts', 'fa-book', '3 Years (6 Sem)', 'PUC II / Class 12 (Any Stream)', 'History, Political Science, Economics, Sociology, Rural Development', '["IAS/KAS Aspirant", "Professor", "Journalist", "Social Worker", "Legal Assistant"]', '₹ 8,500'),
    (3, 'B.Com', 'Bachelor of Commerce', 'fa-chart-line', '3 Years (6 Sem)', 'PUC II / Class 12 (Any Stream)', 'Accountancy, Business Math, Auditing, GST, Income Tax, Financial Management', '["Chartered Accountant", "Financial Analyst", "Banker", "Tax Consultant"]', '₹ 12,800'),
    (4, 'B.Sc', 'Bachelor of Science', 'fa-flask', '3 Years (6 Sem)', 'PUC II / Class 12 (Science PCM/CBZ)', 'Physics, Chemistry, mathematics, Botany, Zoology, Statistics', '["Researcher", "Lab Technician", "Professor", "Environmentalist", "Quality Analyst"]', '₹ 15,400')
ON CONFLICT (id) DO UPDATE SET
    duration = EXCLUDED.duration,
    eligibility = EXCLUDED.eligibility,
    subjects = EXCLUDED.subjects,
    career_options = EXCLUDED.career_options,
    fee_estimate = EXCLUDED.fee_estimate;

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

-- Sample Data for Notes
INSERT INTO notes (title, course_id, semester, subject, unit, file_path) VALUES
    ('Data Structures Introduction', 1, 3, 'Data Structures', 'Unit 1', 'notes/sample-ds-unit1.pdf'),
    ('Java Programming Basics', 1, 4, 'Java Programming', 'Unit 1', 'notes/sample-java-basics.pdf'),
    ('Macro Economics Overview', 3, 2, 'Economics', 'General', 'notes/economics-overview.pdf'),
    ('Business Management Principles', 3, 4, 'Management', 'Unit 2', 'notes/management-principles.pdf')
ON CONFLICT DO NOTHING;

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
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample Data for Faculty
INSERT INTO faculty (name, designation, department, status) VALUES
    ('Dr. V.S. Kulkarni', 'Principal', 'Science', 'Available'),
    ('Prof. S.B. Patil', 'HOD', 'BCA', 'Busy'),
    ('Prof. M.A. Hiremath', 'Asst. Professor', 'BCA', 'On Leave'),
    ('Dr. G.R. Deshpande', 'HOD', 'B.Com', 'Available'),
    ('Prof. S.N. Nayak', 'Associate Professor', 'BA', 'Available')
ON CONFLICT DO NOTHING;

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

-- ============================================
-- TIMETABLE TABLE
-- Stores class schedules
-- ============================================
CREATE TABLE IF NOT EXISTS timetable (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    semester INT CHECK (semester >= 1 AND semester <= 6),
    day_of_week VARCHAR(15) CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject VARCHAR(255) NOT NULL,
    faculty_id INT REFERENCES faculty(id) ON DELETE SET NULL,
    room_no VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample Data for Timetable
INSERT INTO timetable (course_id, semester, day_of_week, start_time, end_time, subject, room_no) VALUES
    (1, 4, 'Monday', '09:30', '10:30', 'Java Programming', 'Lab 2'),
    (1, 4, 'Monday', '10:30', '11:30', 'Software Engineering', 'R204'),
    (1, 4, 'Tuesday', '09:30', '10:30', 'Entrepreneurship', 'R204'),
    (1, 4, 'Wednesday', '11:30', '12:30', 'Data Mining', 'R201')
ON CONFLICT DO NOTHING;

-- Enable RLS for timetable
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to timetable" ON timetable
    FOR SELECT USING (true);

-- ============================================
-- SHOWCASE TABLE
-- Stores student projects, papers, and portfolios
-- ============================================
CREATE TABLE IF NOT EXISTS showcase (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Project', 'Research Paper', 'Portfolio')),
    student_name VARCHAR(255),
    description TEXT,
    thumbnail_url VARCHAR(255),
    content_url VARCHAR(255), -- Link to PDF or external site
    gallery_images JSONB DEFAULT '[]', -- Array of image URLs for portfolios
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample Data for Showcase
INSERT INTO showcase (title, category, student_name, description, thumbnail_url, content_url, gallery_images) VALUES
    ('SVES Virtual Library System', 'Project', 'Final Year BCA Team', 'A digital transformation project for campus book management.', 'assets/images/project1.jpg', null, '["assets/images/project1-a.jpg", "assets/images/project1-b.jpg"]'),
    ('AI in Rural Agriculture', 'Research Paper', 'Arjun M.', 'Analysis of AI implementation for local farmers.', 'assets/images/research1.jpg', 'assets/docs/research-agri.pdf', '[]'),
    ('Modern Web Portfolio', 'Portfolio', 'Sneha K.', 'Full stack developer portfolio showcasing 15+ college projects.', 'assets/images/portfolio1.jpg', 'https://sneha-dev.example.com', '["assets/images/p1.jpg", "assets/images/p2.jpg", "assets/images/p3.jpg"]');

-- Enable RLS for showcase
ALTER TABLE showcase ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to showcase" ON showcase
    FOR SELECT USING (true);

-- ============================================
-- FAQS TABLE
-- Stores frequently asked questions
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample Data for FAQs
INSERT INTO faqs (question, answer, category, priority) VALUES
    ('How do I apply for BCA?', 'You can apply online through our Admission portal or visit the campus with your PUC/12th marksheet.', 'Admissions', 1),
    ('What are the college timings?', 'The regular classes run from 09:30 AM to 04:30 PM, Monday to Saturday.', 'General', 2),
    ('Is there a hostel facility?', 'Yes, we provide separate hostel facilities for boys and girls with all basic amenities.', 'Facilities', 3);

-- Enable RLS for faqs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to faqs" ON faqs
    FOR SELECT USING (true);

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
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;

-- Policies are not required as the backend uses the service_role key for all operations.
-- This ensures the table is not directly accessible via the public API.
