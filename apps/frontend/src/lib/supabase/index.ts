/**
 * Supabase utilities and hooks
 * Main export file for Supabase functionality
 */

export { getSupabaseClient, initSupabaseClient } from './supabase-client';
export { useSupabase } from './hooks/use-supabase';
export {
  uploadImage,
  deleteImage,
  getImagePublicUrl,
  IMAGE_RESOLUTIONS,
  type UploadImageResult,
  type UploadImageOptions,
  type ImageResolution,
} from './storage';
export {
  useImageUpload,
  type UseImageUploadOptions,
  type UseImageUploadReturn,
} from './hooks/use-image-upload';
export {
  uploadImage as uploadImageToSupabase,
  getImages,
  getImageById,
  getImageByFilename,
  deleteImage as deleteImageFromSupabase,
  uploadImageFile,
  getImagePublicUrl as getSupabaseImageUrl,
  deleteImageFile,
  deleteImageFiles,
  checkBucketExists,
  initializeBucket,
  type ImageMetadata,
  type CreateImageMetadataDto,
  type ImageListResponse,
} from './images';
