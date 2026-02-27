-- ====================================================================
-- SVES COLLEGE WEBSITE - ADMIN MODULES FIX MIGRATION
-- Run this in Supabase SQL Editor to support new requirement fields
-- ====================================================================

-- 1. Update ANNOUNCEMENTS table
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS announcement_date DATE;

-- 2. Update FACULTY table
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS qualification VARCHAR(255);
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS profile_description TEXT;

-- 3. Ensure TIMETABLE has all fields
-- Current fields: id, course_id, semester, day_of_week, start_time, end_time, subject, room_no
-- The user requested: Course, Semester, Subject, Time & Day. (Already present)

-- 4. NOTES table already has: title, course_id, semester, subject, unit, file_path
-- This matches the requirement.

-- 5. GALLERY table already has: image_path, category, caption
-- This matches the requirement.

-- 6. Add Indexes for better performance if not present
CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(announcement_date);
CREATE INDEX IF NOT EXISTS idx_faculty_dept ON faculty(department);

-- Done! These changes will allow the admin dashboard to store and display the new fields.
