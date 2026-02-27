-- ====================================================================
-- SVES COLLEGE WEBSITE - NEW TABLES MIGRATION
-- Run this in Supabase SQL Editor to add Stories & Effective Manager
-- ====================================================================

-- STORIES TABLE
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

-- Drop policy if it already exists (prevents errors on re-run)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stories' AND policyname = 'Allow public read access to stories') THEN
        CREATE POLICY "Allow public read access to stories" ON stories FOR SELECT USING (true);
    END IF;
END $$;

-- EFFECTIVE MANAGER TABLE
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

-- SHOWCASE TABLE (if not already present)
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

ALTER TABLE showcase ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'showcase' AND policyname = 'Allow public read access to showcase') THEN
        CREATE POLICY "Allow public read access to showcase" ON showcase FOR SELECT USING (true);
    END IF;
END $$;

-- Done! You can now use the Stories, Effective Manager, and Showcase modules.
