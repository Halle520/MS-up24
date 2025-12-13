'use client';

import styles from './page.module.css';
import { useGreeting } from '../lib/hooks/use-greeting';
import { usePages } from '../lib/hooks/use-pages';
import { useComponents } from '../lib/hooks/use-components';
import { useImages } from '../lib/hooks/use-images';

import Link from 'next/link';
import { ROUTES } from '../lib/routes';

export default function Index() {
  const {
    data: greetingData,
    isLoading: isLoadingGreeting,
    error: greetingError,
  } = useGreeting();
  const {
    data: pagesData,
    isLoading: isLoadingPages,
    error: pagesError,
  } = usePages(1, 5);
  const {
    data: componentsData,
    isLoading: isLoadingComponents,
    error: componentsError,
  } = useComponents();
  const {
    data: imagesData,
    isLoading: isLoadingImages,
    error: imagesError,
  } = useImages(1, 5);

  const isLoading =
    isLoadingGreeting || isLoadingPages || isLoadingComponents || isLoadingImages;
  const error =
    greetingError || pagesError || componentsError || imagesError
      ? (greetingError || pagesError || componentsError || imagesError)?.message ||
      'An error occurred'
      : null;

  const greeting = greetingData?.message || '';
  const pages = pagesData?.pages || [];
  const components = componentsData?.components || [];
  const images = imagesData?.images || [];

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span>Hello there, </span>
              Welcome to Monospace Frontend 👋
            </h1>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link
                href={ROUTES.SHOW}
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#e60023',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '24px',
                  fontWeight: 600,
                }}
              >
                View Pinterest Style Gallery →
              </Link>
            </div>
          </div>

          {isLoading && (
            <div id="hero" className="rounded">
              <div className="text-container">
                <p>Loading data from API...</p>
              </div>
            </div>
          )}

          {error && (
            <div id="hero" className="rounded">
              <div className="text-container">
                <p style={{ color: 'red' }}>
                  Error: {typeof error === 'string' ? error : 'An error occurred'}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <div id="hero" className="rounded">
                <div className="text-container">
                  <h2>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    <span>Greeting from Backend</span>
                  </h2>
                  {greeting && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: '#333',
                        }}
                      >
                        {greeting}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div id="hero" className="rounded" style={{ marginTop: '2rem' }}>
                <div className="text-container">
                  <h2>📄 Pages ({pages.length})</h2>
                  {pages.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {pages.map((page) => (
                        <li
                          key={page.id}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '4px',
                          }}
                        >
                          <strong>{page.name}</strong> ({page.slug}) -{' '}
                          {page.isPublished ? 'Published' : 'Draft'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No pages found</p>
                  )}
                </div>
              </div>

              <div id="hero" className="rounded" style={{ marginTop: '2rem' }}>
                <div className="text-container">
                  <h2>🧩 Components ({components.length})</h2>
                  {components.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {components.slice(0, 5).map((component) => (
                        <li
                          key={component.id}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '4px',
                          }}
                        >
                          <strong>{component.type}</strong> - {component.id}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No components found</p>
                  )}
                </div>
              </div>

              <div id="hero" className="rounded" style={{ marginTop: '2rem' }}>
                <div className="text-container">
                  <h2>🖼️ Images ({images.length})</h2>
                  {images.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {images.map((image) => (
                        <li
                          key={image.id}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '4px',
                          }}
                        >
                          <strong>{image.originalName}</strong> -{' '}
                          {(image.size / 1024).toFixed(2)} KB
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No images found</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
