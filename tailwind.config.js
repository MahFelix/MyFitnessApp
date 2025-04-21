/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#cce4ff',
          200: '#99c9ff',
          300: '#66adff',
          400: '#3392ff',
          500: '#0077ff',
          600: '#005fcc',
          700: '#004799',
          800: '#003066',
          900: '#001833',
        },
        accent: {
          50: '#fff7e6',
          100: '#ffefc9',
          200: '#ffdf94',
          300: '#ffcf5e',
          400: '#ffbf29',
          500: '#ff9500',
          600: '#cc7600',
          700: '#995800',
          800: '#663b00',
          900: '#331d00',
        },
        success: {
          50: '#e8f9f0',
          100: '#d1f4e0',
          200: '#a3e9c2',
          300: '#74dda3',
          400: '#46d285',
          500: '#34c759',
          600: '#299f47',
          700: '#1f7735',
          800: '#155024',
          900: '#0a2812',
        },
        warning: {
          500: '#ff9500',
        },
        error: {
          500: '#ff3b30',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d1d6e0',
          400: '#9aa2b1',
          500: '#697586',
          600: '#4b5565',
          700: '#364152',
          800: '#202939',
          900: '#121926',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'Inter',
          'system-ui',
          'Avenir',
          'Helvetica Neue', 
          'sans-serif',
        ],
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}