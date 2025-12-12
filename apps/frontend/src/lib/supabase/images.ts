/**
 * Supabase image management utilities
 * Handles image upload, storage, and database operations directly from frontend
 */

import { getSupabaseClient } from './supabase-client';

export interface ImageMetadata {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  url_tiny?: string;
  url_medium?: string;
  url_large?: string;
  url_original: string;
  user_id?: string;
  uploaded_at: string;
}

export interface CreateImageMetadataDto {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  url_tiny?: string;
  url_medium?: string;
  url_large?: string;
  url_original: string;
  user_id?: string;
}

export interface ImageListResponse {
  images: ImageMetadata[];
  total: number;
  page: number;
  limit: number;
}

const BUCKET_NAME = 'images';

/**
 * Check if bucket exists and create it if it doesn't
 */
async function ensureBucketExists(): Promise<void> {
  const supabase = getSupabaseClient();

  // Try to list files in the bucket to check if it exists
  const { error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list('', { limit: 1 });

  // If bucket doesn't exist, try to create it
  if (listError) {
    // Check if error is due to bucket not existing
    const errorMessage = listError.message || '';
    if (
      errorMessage.includes('not found') ||
      errorMessage.includes('Bucket not found') ||
      errorMessage.includes('does not exist') ||
      errorMessage.includes('No such bucket')
    ) {
      // Try to create the bucket
      // Note: This requires admin/service role permissions
      // If using anon key, this will fail and user needs to create bucket manually
      const { error: createError } = await supabase.storage.createBucket(
        BUCKET_NAME,
        {
          public: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
          ],
          fileSizeLimit: 10485760, // 10MB
        }
      );

      if (createError) {
        // If creation fails, provide helpful error message
        const createErrorMessage = createError.message || '';
        if (
          createErrorMessage.includes('permission') ||
          createErrorMessage.includes('unauthorized') ||
          createErrorMessage.includes('Forbidden') ||
          createErrorMessage.includes('403')
        ) {
          throw new Error(
            `Storage bucket '${BUCKET_NAME}' does not exist and cannot be created automatically. ` +
              `Please create it manually in the Supabase Dashboard: ` +
              `Storage > New bucket > Name: "${BUCKET_NAME}" > Public: true`
          );
        }
        throw new Error(
          `Failed to create storage bucket: ${createErrorMessage}`
        );
      }
    } else {
      // Other error (permissions, etc.)
      throw new Error(`Storage bucket error: ${errorMessage}`);
    }
  }
}

/**
 * Upload image file to Supabase Storage
 */
export async function uploadImageFile(
  file: File,
  path: string
): Promise<string> {
  const supabase = getSupabaseClient();

  // Ensure bucket exists before uploading
  await ensureBucketExists();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  return data.path;
}

/**
 * Get public URL for an image
 */
export function getImagePublicUrl(path: string): string {
  const supabase = getSupabaseClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return publicUrl;
}

/**
 * Check if bucket exists (without creating it)
 */
export async function checkBucketExists(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit: 1 });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Initialize bucket - ensures bucket exists before any operations
 * Call this function early in your app lifecycle if needed
 */
export async function initializeBucket(): Promise<void> {
  await ensureBucketExists();
}

/**
 * Delete image file from Supabase Storage
 */
export async function deleteImageFile(path: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Delete multiple image files
 */
export async function deleteImageFiles(paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths);

  if (error) {
    throw new Error(`Failed to delete images: ${error.message}`);
  }
}

/**
 * Upload image and save metadata to database
 */
export async function uploadImage(
  file: File,
  userId?: string
): Promise<ImageMetadata> {
  // Validate file
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`
    );
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds maximum limit of 10MB');
  }

  // Generate unique filename
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  const filename = `${crypto.randomUUID()}${
    fileExtension ? '.' + fileExtension : ''
  }`;
  const filePath = `original/${filename}`;

  // Get image dimensions (for non-SVG images)
  let width: number | undefined;
  let height: number | undefined;

  if (!file.type.includes('svg')) {
    try {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    } catch (error) {
      console.warn('Failed to get image dimensions:', error);
    }
  }

  // Upload file to storage
  await uploadImageFile(file, filePath);

  // Get public URL
  const urlOriginal = getImagePublicUrl(filePath);

  // For now, we'll use the same URL for all resolutions
  // In production, you could:
  // 1. Use Supabase Edge Functions to create multiple resolutions
  // 2. Use a service like Cloudinary/ImageKit
  // 3. Process client-side before upload (limited browser support)
  const urlTiny = urlOriginal;
  const urlMedium = urlOriginal;
  const urlLarge = urlOriginal;

  // Save metadata to database
  const metadata: CreateImageMetadataDto = {
    filename,
    original_name: file.name,
    mime_type: file.type,
    size: file.size,
    width,
    height,
    url_tiny: urlTiny,
    url_medium: urlMedium,
    url_large: urlLarge,
    url_original: urlOriginal,
    user_id: userId,
  };

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('images')
    .insert(metadata)
    .select()
    .single();

  if (error || !data) {
    // If database insert fails, try to clean up the uploaded file
    try {
      await deleteImageFile(filePath);
    } catch (cleanupError) {
      console.error('Failed to cleanup uploaded file:', cleanupError);
    }

    // Provide helpful error message for RLS policy errors
    const errorMessage = error?.message || 'Unknown error';
    if (
      errorMessage.includes('row-level security') ||
      errorMessage.includes('RLS') ||
      errorMessage.includes('policy')
    ) {
      throw new Error(
        `Row Level Security (RLS) policy error: ${errorMessage}. ` +
          `Please run the fix script in Supabase SQL Editor: ` +
          `apps/backend/src/modules/images/migrations/fix-rls-policies.sql`
      );
    }

    throw new Error(`Failed to save image metadata: ${errorMessage}`);
  }

  return data as ImageMetadata;
}

/**
 * Get image dimensions from file
 */
function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Get all images with pagination
 */
export async function getImages(
  page = 1,
  limit = 10,
  userId?: string
): Promise<ImageListResponse> {
  const supabase = getSupabaseClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from('images')
    .select('*', { count: 'exact' })
    .order('uploaded_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }

  return {
    images: (data || []) as ImageMetadata[],
    total: count || 0,
    page,
    limit,
  };
}

/**
 * Get image by ID
 */
export async function getImageById(id: string): Promise<ImageMetadata> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new Error(`Image with ID ${id} not found`);
  }

  return data as ImageMetadata;
}

/**
 * Get image by filename
 */
export async function getImageByFilename(
  filename: string
): Promise<ImageMetadata> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('filename', filename)
    .single();

  if (error || !data) {
    throw new Error(`Image with filename ${filename} not found`);
  }

  return data as ImageMetadata;
}

/**
 * Delete image (removes file from storage and metadata from database)
 */
export async function deleteImage(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  // First, get the image to find the file path
  const image = await getImageById(id);
  const filePath = `original/${image.filename}`;

  // Delete file from storage
  await deleteImageFile(filePath);

  // Delete metadata from database
  const { error } = await supabase.from('images').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete image metadata: ${error.message}`);
  }
}
