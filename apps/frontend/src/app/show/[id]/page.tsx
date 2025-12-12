'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NextImage from 'next/image';
import {
  useImage,
  useUploadImage,
  useDeleteImage,
} from '../../../lib/hooks/use-images';
import styles from '../pinterest.module.css';

export default function PinterestShowPage() {
  const router = useRouter();
  const params = useParams();
  const imageId = params?.id as string;
  const { data: imageData, isLoading } = useImage(imageId);
  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const originalAspectRatio = useRef<number>(800 / 600);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
      const img = imageRef.current;
      originalAspectRatio.current = img.naturalWidth / img.naturalHeight;
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    }
  }, [imageData]);

  if (isLoading) {
    return (
      <div className={styles.pinterestContainer}>
        <div className={styles.loading}>Loading image...</div>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className={styles.pinterestContainer}>
        <div className={styles.emptyState}>
          <p>Image not found</p>
          <button
            className={styles.primaryButton}
            onClick={() => router.push('/pinterest')}
            style={{ marginTop: '16px' }}
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  const imageUrl =
    imageData.urlOriginal ||
    imageData.urlLarge ||
    imageData.urlMedium ||
    imageData.urlTiny ||
    '';
  const imageTitle = imageData.originalName.split('.')[0] || 'Untitled';

  const handleWidthChange = (newWidth: number) => {
    if (newWidth < 100) newWidth = 100;
    if (newWidth > 4000) newWidth = 4000;
    setWidth(newWidth);
    if (maintainAspectRatio && originalAspectRatio.current > 0) {
      setHeight(Math.round(newWidth / originalAspectRatio.current));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (newHeight < 100) newHeight = 100;
    if (newHeight > 4000) newHeight = 4000;
    setHeight(newHeight);
    if (maintainAspectRatio && originalAspectRatio.current > 0) {
      setWidth(Math.round(newHeight * originalAspectRatio.current));
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      originalAspectRatio.current = img.naturalWidth / img.naturalHeight;
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    }
  };

  const handleResize = async () => {
    if (!imageData) return;

    try {
      setIsResizing(true);
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              async (blob) => {
                if (blob) {
                  const file = new File([blob], imageData.originalName, {
                    type: blob.type || 'image/jpeg',
                  });
                  try {
                    await uploadMutation.mutateAsync({ file });
                    await deleteMutation.mutateAsync(imageData.id);
                    router.push('/pinterest');
                    resolve();
                  } catch (error) {
                    reject(error);
                  }
                } else {
                  reject(new Error('Failed to create blob'));
                }
              },
              'image/jpeg',
              0.9
            );
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to resize and upload image'
      );
    } finally {
      setIsResizing(false);
    }
  };

  const handleDelete = async () => {
    if (!imageData) return;
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteMutation.mutateAsync(imageData.id);
        router.push('/pinterest');
      } catch (error) {
        alert('Failed to delete image');
      }
    }
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
            <button
              className={styles.navButton}
              onClick={() => router.push('/pinterest')}
            >
              Home
            </button>
            <button className={styles.navButton}>Today</button>
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
              className={styles.secondaryButton}
              onClick={() => router.push('/pinterest')}
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </header>

      <main className={styles.showMain}>
        <div className={styles.showContainer}>
          <div className={styles.imagePreview}>
            {imageUrl ? (
              <NextImage
                ref={imageRef}
                src={imageUrl}
                alt={imageTitle}
                onLoad={handleImageLoad}
                className={styles.previewImage}
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: `${Math.min((width / 800) * 100, 100)}%`,
                  height: 'auto',
                }}
              />
            ) : (
              <div className={styles.emptyState}>No image URL available</div>
            )}
            <div className={styles.previewInfo}>
              Original: {imageRef.current?.naturalWidth || '...'} ×{' '}
              {imageRef.current?.naturalHeight || '...'} px
              <br />
              New: {width} × {height} px
            </div>
          </div>
          <div className={styles.editorControls}>
            <h2 className={styles.editorTitle}>Edit Image</h2>
            <div className={styles.imageDetails}>
              <p>
                <strong>Name:</strong> {imageData.originalName}
              </p>
              <p>
                <strong>Size:</strong> {(imageData.size / 1024).toFixed(2)} KB
              </p>
              <p>
                <strong>Type:</strong> {imageData.mimeType}
              </p>
              <p>
                <strong>Uploaded:</strong>{' '}
                {new Date(imageData.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>
                Width (px):
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min="100"
                  max="4000"
                  className={styles.input}
                />
              </label>
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>
                Height (px):
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min="100"
                  max="4000"
                  className={styles.input}
                />
              </label>
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className={styles.checkbox}
                />
                Maintain aspect ratio
              </label>
            </div>
            <div className={styles.buttonGroup}>
              <button
                className={styles.primaryButton}
                onClick={handleResize}
                disabled={isResizing}
              >
                {isResizing ? 'Processing...' : 'Resize & Save'}
              </button>
              <button
                className={styles.dangerButton}
                onClick={handleDelete}
                disabled={isResizing}
              >
                Delete Image
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => router.push('/pinterest')}
                disabled={isResizing}
              >
                Back to Gallery
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
