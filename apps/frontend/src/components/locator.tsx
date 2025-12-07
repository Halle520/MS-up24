'use client';

import { useEffect } from 'react';

export function Locator() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      import('@locator/runtime').then((locator) => {
        // Initialize LocatorJS UI (default export is setup function)
        const setupLocatorUI = locator.default;
        setupLocatorUI();
      }).catch((err) => {
        // Silently fail if LocatorJS can't be loaded
        console.debug('LocatorJS not available:', err);
      });
    }
  }, []);

  return null;
}

