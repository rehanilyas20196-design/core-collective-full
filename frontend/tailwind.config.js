/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          DEFAULT: '#7C3AED',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          light: '#EDE9FE',
          dark: '#5B21B6',
        },
        gray: {
          50: '#F7FAFC',
          100: '#F0F2F5',
          200: '#E3E8EE',
          300: '#DEE2E7',
          400: '#BDC4CD',
          500: '#8B96A5',
          600: '#505050',
          700: '#3A3A3A',
          800: '#2D2D2D',
          900: '#1C1C1C',
        },
        success: {
          DEFAULT: '#00B517',
          light: '#E5F1E3',
          dark: '#237C02',
        },
        danger: {
          DEFAULT: '#FA3434',
          light: '#FFF0F0',
        },
        warning: {
          DEFAULT: '#FF9017',
          light: '#FFF0DF',
        },
        star: {
          DEFAULT: '#FFB400',
        },
        blue: {
          50: '#E3F0FF',
          100: '#D1E9FF',
          200: '#C3D9FF',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        container: '1180px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px 0 rgba(0,0,0,0.04)',
        'elevated': '0 4px 16px 0 rgba(0,0,0,0.08), 0 2px 8px 0 rgba(0,0,0,0.04)',
        'modal': '0 8px 32px 0 rgba(0,0,0,0.12), 0 4px 16px 0 rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out forwards',
        'slide-down': 'slide-down 0.2s ease-out forwards',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
