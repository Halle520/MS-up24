/**
 * Images API client for backend API
 * Handles image operations via the NestJS backend API
 */

import { apiGet, apiDelete, apiUpload, apiPost } from './api-client';

export interface Image {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  urlTiny?: string;
  urlMedium?: string;
  urlLarge?: string;
  urlOriginal: string;
  uploadedAt: string;
  userId?: string;
}

export interface ImageListResponse {
  images: Image[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Get all images with pagination
 */
export async function getImages(
  page = 1,
  limit = 10,
  type?: 'original' | 'large' | 'medium' | 'tiny'
): Promise<ImageListResponse> {
  let url = `/images?page=${page}&limit=${limit}`;
  if (type) {
    url += `&type=${type}`;
  }
  return apiGet<ImageListResponse>(url);
}

/**
 * Get an image by ID
 */
export async function getImageById(id: string): Promise<Image> {
  return apiGet<Image>(`/images/${id}`);
}

/**
 * Upload an image
 */
export async function uploadImage(file: File): Promise<Image> {
  const formData = new FormData();
  formData.append('file', file);
  return apiUpload<Image>('/images/upload', formData);
}

/**
 * Upload an image from a URL
 */
export async function uploadImageFromUrl(url: string): Promise<Image> {
  return apiPost<Image>('/images/upload-from-url', { url });
}

/**
 * Get image file URL
 */
export function getImageFileUrl(filename: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  return `${apiUrl}/images/file/${filename}`;
}

/**
 * Delete an image
 */
export async function deleteImage(id: string): Promise<void> {
  return apiDelete<void>(`/images/${id}`);
}
