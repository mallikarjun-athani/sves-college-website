-- ============================================
-- SVES College Website - MySQL Database Schema
-- Converted from Supabase (PostgreSQL) to MySQL
-- ============================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS sves_college CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sves_college;

-- ============================================
-- ADMIN TABLE
-- Stores admin users for backend access
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default admin user (password: admin123)
-- Generated using bcrypt with 10 rounds
INSERT IGNORE INTO admin (id, username, password) 
VALUES (UUID(), 'admin', '$2a$10$gR2nuGhumpJnYrGoTty30.MG6pQCKXXIJ8wEFfk1U/S/UPPeuDqLi');

-- ============================================
-- COURSES TABLE
-- Stores available courses/programs
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default courses
INSERT IGNORE INTO courses (id, name, description, icon) VALUES 
    (1, 'BCA', 'Bachelor of Computer Applications', 'fa-laptop-code'),
    (2, 'BA', 'Bachelor of Arts', 'fa-book'),
    (3, 'B.Com', 'Bachelor of Commerce', 'fa-chart-line'),
    (4, 'B.Sc', 'Bachelor of Science', 'fa-flask');

-- ============================================
-- ANNOUNCEMENTS TABLE
-- Stores college announcements/notices
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- NOTES TABLE
-- Stores study notes/materials uploaded by admin
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_id INT,
    semester INT CHECK (semester >= 1 AND semester <= 6),
    subject VARCHAR(100),
    unit VARCHAR(100),
    file_path VARCHAR(500),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create index for faster filtering
CREATE INDEX idx_notes_course ON notes(course_id);
CREATE INDEX idx_notes_semester ON notes(semester);

-- ============================================
-- GALLERY TABLE
-- Stores images for campus gallery
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(500) NOT NULL,
    category VARCHAR(50) DEFAULT 'Campus',
    caption VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (category IN ('Campus', 'Events', 'Cultural', 'Sports', 'Banner'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create index for category filtering
CREATE INDEX idx_gallery_category ON gallery(category);

-- ============================================
-- FACULTY TABLE
-- Stores faculty member information
-- ============================================
CREATE TABLE IF NOT EXISTS faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    image_path VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create index for department filtering
CREATE INDEX idx_faculty_department ON faculty(department);

-- ============================================
-- ADMISSIONS TABLE
-- Stores admission applications
-- ============================================
CREATE TABLE IF NOT EXISTS admissions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    course_interest VARCHAR(255) NOT NULL,
    previous_qualification TEXT,
    address TEXT,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TIMETABLE TABLE
-- Stores class timetable entries
-- ============================================
CREATE TABLE IF NOT EXISTS timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    semester INT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_no VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- ACHIEVEMENTS TABLE
-- Stores college achievements
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    achievement_date DATE,
    image_path VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- PORTFOLIOS TABLE
-- Stores student portfolio entries
-- ============================================
CREATE TABLE IF NOT EXISTS portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_course VARCHAR(100) DEFAULT '',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'Other',
    project_link VARCHAR(500),
    image_path VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CHECK (category IN ('Web Development', 'Research Papers', 'Fine Arts', 'Commerce Projects', 'Social Work', 'Science', 'Other'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
