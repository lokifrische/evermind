-- Fix Storage for Demo Mode
-- Run this in your Supabase SQL Editor

-- First, ensure the media bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Drop existing policies if they exist (ignore errors)
DROP POLICY IF EXISTS "Public read access for media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload media (demo mode)" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete media (demo mode)" ON storage.objects;

-- Allow anyone to READ from media bucket (public)
CREATE POLICY "Public read access for media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow anyone to UPLOAD to media bucket (for demo)
CREATE POLICY "Anyone can upload media (demo mode)"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');

-- Allow anyone to DELETE from media bucket (for demo)  
CREATE POLICY "Anyone can delete media (demo mode)"
ON storage.objects FOR DELETE
USING (bucket_id = 'media');

-- Verify bucket exists
SELECT id, name, public FROM storage.buckets WHERE id = 'media';
