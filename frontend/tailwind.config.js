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
          DEFAULT: '#7C3AED',
          light: '#EDE9FE',
          dark: '#5B21B6',
        },
        secondary: {
          DEFAULT: '#8B96A5', // Gray for text
          light: '#F7FAFC', // Background
        },
        dark: {
          DEFAULT: '#1C1C1C', // Heading
          light: '#505050', // Subtle text
        },
        orange: {
          DEFAULT: '#FF9017',
        },
        teal: {
          DEFAULT: '#00B517', // Success or specific accent
          light: '#E5F1E3',
        },
        aqua: {
          DEFAULT: '#237C02', // Some aqua/green in design
          light: '#C3FFCB',
        },
        shade: {
          DEFAULT: '#F7F7F7',
          border: '#E3E8EE'
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        'container': '1180px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}
