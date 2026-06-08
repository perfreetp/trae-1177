/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#2D6A4F',
          700: '#1B4332',
          800: '#132d1f',
          900: '#0a1f14',
          950: '#050f0a',
        },
        amber: {
          DEFAULT: '#D4A017',
        },
        danger: {
          DEFAULT: '#E63946',
        },
      },
    },
  },
  plugins: [],
};
