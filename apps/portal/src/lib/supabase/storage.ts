import { getSupabaseClient } from './client';

const BUCKET_NAME = 'media';

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder path (e.g., 'memories', 'family')
 * @returns The public URL of the uploaded image, or null if failed
 */
export async function uploadImage(
  file: File,
  folder: string = 'uploads'
): Promise<string | null> {
  const supabase = getSupabaseClient();
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image
 * @returns true if successful, false otherwise
 */
export async function deleteImage(url: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  // Extract path from URL
  const bucketUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl('').data.publicUrl;
  const path = url.replace(bucketUrl, '');
  
  if (!path) return false;
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);
  
  return !error;
}

/**
 * Check if a URL is from our Supabase Storage
 */
export function isSupabaseUrl(url: string): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return url.includes(supabaseUrl);
}
