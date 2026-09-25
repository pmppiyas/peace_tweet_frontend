import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        fb: {
          bg: '#f0f2f5',
          card: '#ffffff',
          darkBg: '#18191a',
          darkCard: '#242526',
          border: '#e4e6eb',
          darkBorder: '#393a3b',
          hover: '#e4e6eb',
          darkHover: '#3a3b3c',
          text: '#050505',
          secondary: '#65676b',
          darkText: '#e4e6eb',
          darkSecondary: '#b0b3b8',
          blue: '#1877f2',
          emerald: '#059669',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ["'Nunito Sans'", 'var(--font-nunito-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        arabic: ['var(--font-amiri)', "'Scheherazade New'", "'Traditional Arabic'", 'serif'],
        bangla: ['var(--font-noto-sans-bengali)', "'SolaimanLipi'", "'Kalpurush'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
