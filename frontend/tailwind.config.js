/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAFBF7',
          100: '#F7F7F2', // Primary warm off-white background
          200: '#EEF0E7',
          300: '#E2E6D8',
        },
        charcoal: {
          DEFAULT: '#20221F', // Primary deep charcoal text
          50: '#F2F3F0',
          100: '#D5D7D1',
          200: '#999D93',
          400: '#5A5F54',
          700: '#32362F',
          900: '#20221F',
        },
        sage: {
          light: '#E7EDE3', // Secondary background
          DEFAULT: '#C8D6C0',
          dark: '#69846E',
        },
        lime: {
          accent: '#C5F36B', // Electric lime accent
          hover: '#B1DF55',
        },
        forest: {
          muted: '#496B50', // Secondary accent
          dark: '#2E4733',
        },
        sky: {
          soft: '#DCEAF0', // Supporting soft sky blue
          DEFAULT: '#B4D6E3',
        },
        aqi: {
          good: '#2E8B57', // 0-50
          moderate: '#D97706', // 51-100
          unhealthySensitive: '#EA580C', // 101-150
          unhealthy: '#DC2626', // 151-200
          veryUnhealthy: '#9333EA', // 201-300
          hazardous: '#881337', // 300+
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        number: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(32, 34, 31, 0.04)',
        'card': '0 4px 20px -2px rgba(32, 34, 31, 0.05)',
        'hover': '0 12px 30px -4px rgba(32, 34, 31, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
