/**
 * React Query hooks for Images using backend API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getImages,
  getImageById,
  uploadImage,
  deleteImage,
  type Image,
  type ImageListResponse,
} from '../api/images.api';

/**
 * Query keys for images
 */
export const imageKeys = {
  all: ['images'] as const,
  lists: () => [...imageKeys.all, 'list'] as const,
  list: (page: number, limit: number) =>
    [...imageKeys.lists(), page, limit] as const,
  details: () => [...imageKeys.all, 'detail'] as const,
  detail: (id: string) => [...imageKeys.details(), id] as const,
};

/**
 * Get all images with pagination
 */
export function useImages(page = 1, limit = 10, userId?: string) {
  return useQuery({
    queryKey: imageKeys.list(page, limit),
    queryFn: () => getImages(page, limit),
  });
}

/**
 * Get an image by ID
 */
export function useImage(id: string) {
  return useQuery({
    queryKey: imageKeys.detail(id),
    queryFn: () => getImageById(id),
    enabled: !!id,
  });
}

/**
 * Upload an image
 */
export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file }: { file: File; userId?: string }) =>
      uploadImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
    },
  });
}

/**
 * Delete an image
 */
export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
    },
  });
}

// Export types for compatibility
export type { Image, ImageListResponse };
