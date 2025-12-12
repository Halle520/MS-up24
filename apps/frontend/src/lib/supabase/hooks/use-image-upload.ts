/**
 * React hook for image upload to Supabase Storage
 */

import { useState, useCallback } from 'react';
import { uploadImage, deleteImage, type UploadImageResult } from '../storage';

export interface UseImageUploadOptions {
  bucketName?: string;
  userId?: string;
  onSuccess?: (result: UploadImageResult) => void;
  onError?: (error: Error) => void;
}

export interface UseImageUploadReturn {
  upload: (file: File) => Promise<UploadImageResult | null>;
  remove: (filename: string) => Promise<void>;
  isUploading: boolean;
  error: Error | null;
  progress: number;
}

/**
 * Hook for uploading images to Supabase Storage
 */
export function useImageUpload(
  options: UseImageUploadOptions = {}
): UseImageUploadReturn {
  const { bucketName, userId, onSuccess, onError } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(
    async (file: File): Promise<UploadImageResult | null> => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const result = await uploadImage({
          file,
          bucketName,
          userId,
          onProgress: setProgress,
        });

        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [bucketName, userId, onSuccess, onError]
  );

  const remove = useCallback(
    async (filename: string): Promise<void> => {
      try {
        await deleteImage(filename, bucketName);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      }
    },
    [bucketName, onError]
  );

  return {
    upload,
    remove,
    isUploading,
    error,
    progress,
  };
}
