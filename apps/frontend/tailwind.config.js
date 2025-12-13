const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, './src/**/*.{js,ts,jsx,tsx,mdx}')],
  theme: {
    extend: {
      colors: {
        // Primary warm palette - Terracotta & Rust tones
        primary: {
          50: '#fef5f0',
          100: '#fde8dc',
          200: '#fbd5c1',
          300: '#f8b89a',
          400: '#f4936b',
          500: '#f07047', // Main primary
          600: '#e1552e',
          700: '#c03f23',
          800: '#9e3520',
          900: '#7f2f1f',
          950: '#44160d',
        },
        // Secondary warm palette - Soft Peach & Apricot
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Main secondary
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Warm neutrals - Cream & Beige tones
        warm: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#eae3d5',
          300: '#d9cdb8',
          400: '#c4b299',
          500: '#a8957a',
          600: '#8b7659',
          700: '#6f5f4a',
          800: '#5a4d3d',
          900: '#4a3f33',
          950: '#27211a',
        },
        // Warm grays - Soft taupe undertones
        neutral: {
          50: '#faf9f7',
          100: '#f4f2ef',
          200: '#e8e4de',
          300: '#d6d0c7',
          400: '#b8afa3',
          500: '#9d9182',
          600: '#7d7162',
          700: '#655c50',
          800: '#534c42',
          900: '#453f37',
          950: '#25211c',
        },
        // Semantic colors with warm undertones
        success: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce4cc',
          300: '#8fcfab',
          400: '#5ab283',
          500: '#369865',
          600: '#257a4f',
          700: '#1e6241',
          800: '#1a4e35',
          900: '#16412c',
          950: '#0a2418',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.7)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        zoomIn: 'zoomIn 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
      },
      borderRadius: {
        xs: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        full: '50%',
      },
    },
  },
  plugins: [],
};
