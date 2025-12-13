'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, Link, ArrowLeft, Check } from 'lucide-react';
import { useUploadImage, useUploadImageFromUrl } from '../lib/hooks/use-images';
import NextImage from 'next/image';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type UploadMode = 'file' | 'url';
type UploadStep = 'input' | 'preview';

interface PreviewData {
  source: 'file' | 'url';
  file?: File;
  url?: string;
  previewUrl: string;
  name: string;
  size?: number;
}

export function UploadModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadModalProps) {
  const [mode, setMode] = useState<UploadMode>('file');
  const [step, setStep] = useState<UploadStep>('input');
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileMutation = useUploadImage();
  const uploadUrlMutation = useUploadImageFromUrl();

  const isUploading =
    uploadFileMutation.isPending || uploadUrlMutation.isPending;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('input');
      setPreviewData(null);
      setUrlInput('');
      setUrlError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isUploading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isUploading, onClose]);

  const validateImageUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setUrlError('URL must start with http:// or https://');
        return false;
      }

      setIsLoadingPreview(true);
      setUrlError(null);

      // Validate by loading the image in an img element
      // This works even with CORS restrictions for display purposes
      return new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => {
          setIsLoadingPreview(false);
          setUrlError('Image load timeout. Please check the URL.');
          resolve(false);
        }, 10000); // 10 second timeout

        img.onload = () => {
          clearTimeout(timeout);
          setIsLoadingPreview(false);
          resolve(true);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          setIsLoadingPreview(false);
          setUrlError('Invalid image URL or image cannot be loaded');
          resolve(false);
        };
        img.src = url;
      });
    } catch (error) {
      setIsLoadingPreview(false);
      setUrlError('Invalid URL format');
      return false;
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUrlError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUrlError('File size must be less than 10MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewData({
      source: 'file',
      file,
      previewUrl,
      name: file.name,
      size: file.size,
    });
    setStep('preview');
    setUrlError(null);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter an image URL');
      return;
    }

    const isValid = await validateImageUrl(urlInput.trim());
    if (!isValid) {
      return;
    }

    setPreviewData({
      source: 'url',
      url: urlInput.trim(),
      previewUrl: urlInput.trim(),
      name: urlInput.trim().split('/').pop() || 'Image from URL',
    });
    setStep('preview');
    setUrlError(null);
  };

  const handleBack = () => {
    setStep('input');
    setPreviewData(null);
    setUrlError(null);
    if (previewData?.source === 'file' && previewData.previewUrl) {
      URL.revokeObjectURL(previewData.previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!previewData) return;

    try {
      if (previewData.source === 'file' && previewData.file) {
        await uploadFileMutation.mutateAsync({ file: previewData.file });
      } else if (previewData.source === 'url' && previewData.url) {
        await uploadUrlMutation.mutateAsync({ url: previewData.url });
      }

      // Cleanup preview URL if it was a file
      if (previewData.source === 'file' && previewData.previewUrl) {
        URL.revokeObjectURL(previewData.previewUrl);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      setUrlError(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    if (previewData?.source === 'file' && previewData.previewUrl) {
      URL.revokeObjectURL(previewData.previewUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-neutral-950/60 flex items-center justify-center z-[2000] backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-warm-50 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col animate-zoomIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-warm-200">
          <h2 className="text-2xl font-semibold text-neutral-900">
            {step === 'input' ? 'Upload Image' : 'Preview Image'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:bg-warm-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'input' ? (
            <div className="space-y-6">
              {/* Mode Tabs */}
              <div className="flex gap-2 border-b border-warm-200">
                <button
                  onClick={() => {
                    setMode('file');
                    setUrlError(null);
                  }}
                  className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
                    mode === 'file'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Upload size={18} />
                    <span>Upload File</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setMode('url');
                    setUrlError(null);
                  }}
                  className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
                    mode === 'url'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Link size={18} />
                    <span>From URL</span>
                  </div>
                </button>
              </div>

              {/* File Upload */}
              {mode === 'file' && (
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-warm-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 transition-colors bg-warm-100/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={48} className="mx-auto mb-4 text-neutral-500" />
                    <p className="text-lg font-semibold text-neutral-900 mb-2">
                      Click to select an image
                    </p>
                    <p className="text-sm text-neutral-600">
                      JPEG, PNG, GIF, WebP, SVG (max 10MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* URL Input */}
              {mode === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="image-url"
                      className="block text-sm font-semibold text-neutral-900 mb-2"
                    >
                      Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="image-url"
                        type="url"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.target.value);
                          setUrlError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isLoadingPreview) {
                            handleUrlSubmit();
                          }
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-3 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                        disabled={isLoadingPreview}
                      />
                      <button
                        onClick={handleUrlSubmit}
                        disabled={isLoadingPreview || !urlInput.trim()}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoadingPreview ? 'Loading...' : 'Load'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {urlError && (
                <div className="bg-error-50 text-error-600 p-4 rounded-lg border border-error-200">
                  {urlError}
                </div>
              )}
            </div>
          ) : (
            /* Preview Step */
            previewData && (
              <div className="space-y-6">
                <div className="relative bg-warm-100 rounded-lg overflow-hidden min-h-[300px] flex items-center justify-center">
                  <NextImage
                    src={previewData.previewUrl}
                    alt={previewData.name}
                    width={800}
                    height={600}
                    className="max-w-full max-h-[60vh] object-contain"
                    unoptimized={previewData.source === 'url'}
                    onError={() => {
                      setUrlError('Failed to load image preview');
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-600">
                      Name:
                    </span>
                    <span className="text-sm text-neutral-900">
                      {previewData.name}
                    </span>
                  </div>
                  {previewData.size && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-neutral-600">
                        Size:
                      </span>
                      <span className="text-sm text-neutral-900">
                        {(previewData.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-600">
                      Source:
                    </span>
                    <span className="text-sm text-neutral-900 capitalize">
                      {previewData.source === 'file' ? 'File Upload' : 'URL'}
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-warm-200 bg-warm-50">
          {step === 'preview' ? (
            <>
              <button
                onClick={handleBack}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-warm-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}

