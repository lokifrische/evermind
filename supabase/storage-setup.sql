-- Storage Setup for Evermind
-- Run this in Supabase SQL Editor after schema.sql

-- Create the media bucket for storing images
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

-- Allow public read access to the media bucket
CREATE POLICY "Public read access for media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated users to upload to the media bucket
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "Users can update own media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND auth.uid() = owner
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.uid() = owner
);

-- ALTERNATIVE: If you want to allow anonymous uploads (for demo purposes)
-- Uncomment the following policy and comment out the authenticated one above
/*
CREATE POLICY "Anyone can upload media (demo mode)"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');
*/
