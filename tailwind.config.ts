import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f1fe',
          100: '#dde0fc',
          200: '#c2c6fa',
          300: '#989ef6',
          400: '#6d6ff0',
          500: '#5550e8',
          600: '#4838d5',
          700: '#3e2dba',
          800: '#352897',
          900: '#2f2778',
          950: '#1c1746',
        },
        stability: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
          bg: '#eef2ff',
        },
        growth: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
          bg: '#ecfdf5',
        },
        surface: {
          DEFAULT: '#1a1b2e',
          light: '#242640',
          lighter: '#2d2f4a',
          card: '#1e2035',
        },
        accent: {
          amber: '#f59e0b',
          rose: '#f43f5e',
          sky: '#0ea5e9',
          violet: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #1a1b2e 0%, #242640 50%, #1a1b2e 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
