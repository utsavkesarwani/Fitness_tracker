/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gym: {
          dark: '#020617',
          panel: '#0f172a',
          accent: '#14b8a6',
          accentLight: '#a7f3d0',
        },
      },
    },
  },
  plugins: [],
};
