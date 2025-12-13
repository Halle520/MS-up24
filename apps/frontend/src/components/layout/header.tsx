'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { ROUTES } from '../../lib/routes';
import { UploadModal } from '../upload-modal';

interface HeaderProps {
  onUploadSuccess?: () => void;
}

export function Header({ onUploadSuccess }: HeaderProps) {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    onUploadSuccess?.();
  };

  return (
    <header className="sticky top-0 z-[100] bg-warm-50 border-b border-warm-200 py-4">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-6">
        <div
          className="text-2xl font-bold text-primary-600 cursor-pointer hover:text-primary-700 transition-colors"
          onClick={() => router.push(ROUTES.SHOW)}
        >
          Monospace
        </div>
        <nav className="flex gap-2 items-center">
          <button
            className="px-4 py-3.5 border-none bg-transparent text-base font-semibold text-neutral-900 cursor-pointer rounded-3xl hover:bg-warm-100 transition-colors"
            onClick={() => router.push(ROUTES.HOME)}
          >
            Home
          </button>
          <button className="px-4 py-3.5 border-none text-base font-semibold cursor-pointer rounded-3xl transition-colors bg-neutral-900 text-warm-50 hover:bg-neutral-950">
            Today
          </button>
          <button className="px-4 py-3.5 border-none bg-transparent text-base font-semibold text-neutral-900 cursor-pointer rounded-3xl hover:bg-warm-100 transition-colors">
            Create
          </button>
        </nav>
        <div className="flex-1 max-w-[400px] flex items-center gap-3 bg-warm-200 rounded-3xl px-4 py-3.5 h-12">
          <Search size={16} className="text-neutral-500" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 border-none bg-transparent text-base text-neutral-800 outline-none placeholder:text-neutral-500"
          />
        </div>
        <div className="flex gap-3 items-center">
          <button
            className="px-6 py-3.5 bg-primary-600 text-white border-none rounded-3xl text-base font-semibold cursor-pointer hover:bg-primary-700 transition-colors"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Image
          </button>
        </div>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </header>
  );
}
