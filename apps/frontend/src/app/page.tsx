'use client';

import Link from 'next/link';
import { ROUTES } from '../lib/routes';
import { ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
      <div className="max-w-2xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-warm-50">
          <span className="block text-2xl md:text-3xl font-medium text-primary-400 mb-4 tracking-normal">
            Hello there,
          </span>
          Welcome to <span className="text-primary-500">Monospace</span> 👋
        </h1>

        <p className="text-xl text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Experience our beautiful, high-performance visual gallery and collaborative features.
        </p>

        <div className="pt-8">
          <Link
            href={ROUTES.SHOW}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20 hover:scale-105 active:scale-95"
          >
            View Gallery
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
