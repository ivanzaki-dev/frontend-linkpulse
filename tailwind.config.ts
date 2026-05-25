import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },
        success: { 50: '#ECFDF5', 100: '#D1FAE5', 600: '#059669', 700: '#047857' },
        warning: { 50: '#FFFBEB', 100: '#FEF3C7', 600: '#D97706', 700: '#B45309' },
        error: { 50: '#FEF2F2', 100: '#FEE2E2', 600: '#DC2626', 700: '#B91C1C' },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 1px 0 rgb(15 23 42 / 0.02)',
        'card-hov':
          '0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 4px 0 rgb(15 23 42 / 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
