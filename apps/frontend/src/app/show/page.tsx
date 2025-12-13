'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { ImageOff, Maximize2, X } from 'lucide-react';
import { useImages } from '../../lib/hooks/use-images';
import { truncateFileName } from '../../utils/string.utils';
import { ROUTES } from '../../lib/routes';
import { MainLayout } from '../../components/layout/main-layout';

interface ImageCard {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  originalName: string;
  size: number;
}

export default function ShowPage() {
  const router = useRouter();
  const {
    data: imagesData,
    isLoading,
    refetch,
  } = useImages(1, 20, undefined, 'medium');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<ImageCard | null>(null);

  const images: ImageCard[] =
    imagesData?.images.map((img) => {
      return {
        id: img.id,
        imageUrl: img.url,
        title: img.originalName.split('.')[0] || 'Untitled',
        description: `${(img.size / 1024).toFixed(2)} KB`,
        originalName: img.originalName,
        size: img.size,
      };
    }) || [];

  const handleImageClick = (image: ImageCard) => {
    router.push(ROUTES.MEDIA_DETAIL(image.id));
  };

  const handlePreviewClick = (e: React.MouseEvent, image: ImageCard) => {
    e.stopPropagation();
    setSelectedImage(image);
  };

  const handleKeyDown = (e: React.KeyboardEvent, image: ImageCard) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedImage(image);
    }
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  const closePreview = () => {
    setSelectedImage(null);
  };

  // Close on Escape key
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closePreview();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [selectedImage]);

  const handleUploadSuccess = () => {
    refetch();
  };

  return (
    <MainLayout onUploadSuccess={handleUploadSuccess}>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-neutral-900 mb-2">
          Stay Inspired
        </h1>
        <p className="text-xl font-semibold text-neutral-800">
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-neutral-600 text-lg">
          Loading images...
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-neutral-600 text-lg">
          <p>No images found. Upload your first image to get started!</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-5 gap-4 w-full">
          {images.map((image) => (
            <div
              key={image.id}
              className="group break-inside-avoid mb-4 cursor-pointer relative block outline-none"
              onClick={() => handleImageClick(image)}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, image)}
              role="button"
              aria-label={`View ${image.title}`}
            >
              <div className="relative overflow-hidden bg-warm-100 rounded-md transition-shadow duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:shadow-lg group-focus:ring-4 group-focus:ring-primary-500/50 group-focus:z-10">
                {imageErrors.has(image.id) || !image.imageUrl ? (
                  <div className="w-full min-h-[300px] flex flex-col items-center justify-center bg-warm-100 text-neutral-500 gap-3">
                    <ImageOff size={48} className="text-neutral-500" />
                    <p className="m-0 text-sm font-medium">Image unavailable</p>
                  </div>
                ) : (
                  <>
                    <NextImage
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-auto block object-cover rounded-md transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                      width={0}
                      height={0}
                      style={{ width: '100%', height: 'auto' }}
                      onError={() => handleImageError(image.id)}
                    />
                    <button
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-warm-50/80 backdrop-blur-sm border-neutral-200/50 flex items-center justify-center cursor-pointer opacity-0 scale-[0.8] transition-all duration-200 z-10 shadow-sm text-neutral-900 group-hover:opacity-100 group-hover:scale-100 group-focus:opacity-100 group-focus:scale-100 hover:bg-warm-50 hover:scale-110 hover:shadow-md"
                      onClick={(e) => handlePreviewClick(e, image)}
                      aria-label="Preview image"
                      title="Preview"
                      tabIndex={0}
                    >
                      <Maximize2 size={20} />
                    </button>
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-neutral-900/60 p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="text-warm-50">
                    <h3 className="text-base font-normal m-0 mb-2 text-center">
                      {truncateFileName(image.title)}
                    </h3>
                    <p className="text-[28px] font-semibold m-0 text-center leading-[1.2]">
                      {image.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Picture in Picture Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-neutral-950/95 flex items-center justify-center z-[2000] backdrop-blur-sm animate-fadeIn cursor-zoom-out"
          onClick={closePreview}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center animate-zoomIn cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-warm-50 bg-warm-50/10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-warm-50/20 hover:rotate-90 border-none"
              onClick={closePreview}
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            />
            <div className="mt-4 text-warm-50/90 text-base font-medium drop-shadow-md">
              {selectedImage.title}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
