'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import {
  useImages,
  useUploadImage,
  useDeleteImage,
} from '../../lib/hooks/use-images';
import styles from './pinterest.module.css';

interface ImageCard {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  originalName: string;
  size: number;
}

export default function PinterestPage() {
  const router = useRouter();
  const { data: imagesData, isLoading } = useImages(1, 20);
  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());


  const images: ImageCard[] =
    imagesData?.images.map((img) => {
      const imageUrl =
        img.urlOriginal ||
        img.urlLarge ||
        img.urlMedium ||
        img.urlTiny ||
        img.url ||
        '';

      return {
        id: img.id,
        imageUrl,
        title: img.originalName.split('.')[0] || 'Untitled',
        description: `${(img.size / 1024).toFixed(2)} KB`,
        originalName: img.originalName,
        size: img.size,
      };
    }) || [];

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      await uploadMutation.mutateAsync({ file });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = (image: ImageCard) => {
    router.push(`/pinterest/${image.id}`);
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  return (
    <div className={styles.pinterestContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div
            className={styles.logo}
            onClick={() => router.push('/pinterest')}
          >
            Monospace
          </div>
          <nav className={styles.nav}>
            <button className={styles.navButton}>Home</button>
            <button className={`${styles.navButton} ${styles.active}`}>
              Today
            </button>
            <button className={styles.navButton}>Create</button>
          </nav>
          <div className={styles.searchBar}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                stroke="#5F5F5F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 14L11.1 11.1"
                stroke="#5F5F5F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.dateHeader}>
          <h1 className={styles.title}>Stay Inspired</h1>
          <p className={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {uploadError && (
          <div className={styles.errorMessage}>{uploadError}</div>
        )}

        {isLoading ? (
          <div className={styles.loading}>Loading images...</div>
        ) : images.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No images found. Upload your first image to get started!</p>
          </div>
        ) : (
          <div className={styles.masonryGrid}>
            {images.map((image) => (
              <div
                key={image.id}
                className={styles.imageCard}
                onClick={() => handleImageClick(image)}
              >
                <div className={styles.imageWrapper}>
                  {imageErrors.has(image.id) || !image.imageUrl ? (
                    <div className={styles.imagePlaceholder}>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                          fill="#999"
                        />
                      </svg>
                      <p>Image unavailable</p>
                    </div>
                  ) : (
                    <NextImage
                      src={image.imageUrl}
                      alt={image.title}
                      className={styles.image}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: 'auto' }}
                      onError={() => handleImageError(image.id)}
                    />
                  )}
                  <div className={styles.imageOverlay}>
                    <div className={styles.imageInfo}>
                      <h3 className={styles.imageTitle}>{image.title}</h3>
                      <p className={styles.imageDescription}>
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
