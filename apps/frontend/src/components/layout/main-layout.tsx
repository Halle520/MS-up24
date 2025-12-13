'use client';

import { ReactNode } from 'react';
import { Header } from './header';

interface MainLayoutProps {
  children: ReactNode;
  onUploadSuccess?: () => void;
}

export function MainLayout({ children, onUploadSuccess }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-warm-50">
      <Header onUploadSuccess={onUploadSuccess} />
      <main className="max-w-[1400px] mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
