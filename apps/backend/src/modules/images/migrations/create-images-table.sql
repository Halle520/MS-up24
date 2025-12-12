-- Create images table for storing image metadata
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL UNIQUE,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  url_tiny TEXT,
  url_medium TEXT,
  url_large TEXT,
  url_original TEXT NOT NULL,
  user_id VARCHAR(255),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on filename for faster lookups
CREATE INDEX IF NOT EXISTS idx_images_filename ON images(filename);

-- Create index on user_id for user-specific queries
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);

-- Create index on uploaded_at for sorting
CREATE INDEX IF NOT EXISTS idx_images_uploaded_at ON images(uploaded_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on images" ON images;
DROP POLICY IF EXISTS "Allow public read access on images" ON images;
DROP POLICY IF EXISTS "Allow public insert on images" ON images;
DROP POLICY IF EXISTS "Allow public update on images" ON images;
DROP POLICY IF EXISTS "Allow public delete on images" ON images;

-- Create separate policies for each operation (more explicit and reliable)
-- This allows public access for all operations (adjust based on your security requirements)

-- Allow anyone to read/view images
CREATE POLICY "Allow public read access on images" ON images
  FOR SELECT
  USING (true);

-- Allow anyone to insert/upload images
CREATE POLICY "Allow public insert on images" ON images
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update images
CREATE POLICY "Allow public update on images" ON images
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete images
CREATE POLICY "Allow public delete on images" ON images
  FOR DELETE
  USING (true);

-- Alternative: Single policy for all operations (simpler but less explicit)
-- CREATE POLICY "Allow all operations on images" ON images
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- For more restrictive policies (when authentication is implemented):
-- CREATE POLICY "Users can view all images" ON images
--   FOR SELECT
--   USING (true);
--
-- CREATE POLICY "Users can insert their own images" ON images
--   FOR INSERT
--   WITH CHECK (true);  -- Allow anonymous inserts, or use: auth.uid()::text = user_id
--
-- CREATE POLICY "Users can update their own images" ON images
--   FOR UPDATE
--   USING (true)  -- Or: auth.uid()::text = user_id
--   WITH CHECK (true);  -- Or: auth.uid()::text = user_id
--
-- CREATE POLICY "Users can delete their own images" ON images
--   FOR DELETE
--   USING (true);  -- Or: auth.uid()::text = user_id
