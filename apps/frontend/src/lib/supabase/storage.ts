/**
 * Supabase Storage utilities for image management
 */

import { getSupabaseClient } from './supabase-client';

/**
 * Image resolution configuration
 */
export interface ImageResolution {
  name: 'tiny' | 'medium' | 'large' | 'original';
  width: number;
  height?: number;
  quality?: number;
}

export const IMAGE_RESOLUTIONS: ImageResolution[] = [
  { name: 'tiny', width: 150, quality: 80 },
  { name: 'medium', width: 600, quality: 85 },
  { name: 'large', width: 1200, quality: 90 },
  { name: 'original', width: 0, quality: 95 }, // 0 means no resize
];

/**
 * Upload image to Supabase Storage
 */
export interface UploadImageOptions {
  file: File;
  bucketName?: string;
  userId?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadImageResult {
  urlTiny: string;
  urlMedium: string;
  urlLarge: string;
  urlOriginal: string;
  filename: string;
  metadata: {
    originalName: string;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
  };
}

/**
 * Upload an image file to Supabase Storage
 * Note: This uploads the original file. Image resizing should be handled
 * by a serverless function or client-side processing before upload.
 */
export async function uploadImage(
  options: UploadImageOptions
): Promise<UploadImageResult> {
  const { file, bucketName = 'images', userId, onProgress } = options;

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

  const supabase = getSupabaseClient();
  const storage = supabase.storage.from(bucketName);

  // Generate unique filename
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  const filename = `${crypto.randomUUID()}${
    fileExtension ? '.' + fileExtension : ''
  }`;

  // Upload file
  const { data, error } = await storage.upload(filename, file, {
    contentType: file.type,
    upsert: false,
    cacheControl: '3600',
  });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = storage.getPublicUrl(filename);

  // For now, we'll use the same URL for all resolutions
  // In a production setup, you'd want to:
  // 1. Process images server-side (e.g., using Supabase Edge Functions)
  // 2. Or process client-side before upload
  // 3. Or use a service like Cloudinary/ImageKit
  const result: UploadImageResult = {
    urlTiny: publicUrl,
    urlMedium: publicUrl,
    urlLarge: publicUrl,
    urlOriginal: publicUrl,
    filename,
    metadata: {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    },
  };

  if (onProgress) {
    onProgress(100);
  }

  return result;
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  filename: string,
  bucketName: string = 'images'
): Promise<void> {
  const supabase = getSupabaseClient();
  const storage = supabase.storage.from(bucketName);

  const { error } = await storage.remove([filename]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Get public URL for an image
 */
export function getImagePublicUrl(
  filename: string,
  bucketName: string = 'images'
): string {
  const supabase = getSupabaseClient();
  const storage = supabase.storage.from(bucketName);
  const {
    data: { publicUrl },
  } = storage.getPublicUrl(filename);
  return publicUrl;
}
