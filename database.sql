-- Removed CREATE DATABASE for shared hosting compatibility

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course_id INT,
    semester INT,
    subject VARCHAR(100),
    unit VARCHAR(100),
    file_path VARCHAR(255),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    category ENUM('Campus', 'Events', 'Cultural', 'Sports', 'Banner') DEFAULT 'Campus',
    caption VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Default Admin (password: admin123)
-- In production, always use password_hash()
INSERT INTO admin (username, password) VALUES ('admin', '$2y$10$8W9.8vK.5sO.p013z.XmEuW7.Ew8p7.XmEuW7.Ew8p7.XmEuW7.Ew'); 
-- Note: Replace with actual hash if needed.
