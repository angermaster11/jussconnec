/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00C6C2',
          50: '#E6FFFE',
          100: '#B3FFF9',
          200: '#80FFF3',
          300: '#4DFFED',
          400: '#1AFFE7',
          500: '#00C6C2',
          600: '#009E9B',
          700: '#007674',
          800: '#004E4D',
          900: '#002626',
        },
        navy: {
          DEFAULT: '#0A0F1E',
          50: '#E8E9EC',
          100: '#C5C7CE',
          200: '#9EA2AF',
          300: '#777D90',
          400: '#565D79',
          500: '#363D62',
          600: '#2A3050',
          700: '#1E233E',
          800: '#14182D',
          900: '#0A0F1E',
        },
        accent: {
          DEFAULT: '#7B5EA7',
          50: '#F1ECF6',
          100: '#DCD0EA',
          200: '#C6B3DD',
          300: '#B097D1',
          400: '#9A7BC4',
          500: '#7B5EA7',
          600: '#624B86',
          700: '#4A3864',
          800: '#312543',
          900: '#191321',
        },
        surface: {
          DEFAULT: '#1A1F35',
          light: '#F5F5F5',
          dark: '#0F1329',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00C6C2 0%, #7B5EA7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0A0F1E 0%, #1A1F35 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,198,194,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,198,194,0.6)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
