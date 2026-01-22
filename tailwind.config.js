/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4FC3F7',
          dark: '#29B6F6',
          light: '#81D4FA',
        },
        secondary: {
          DEFAULT: '#1E88E5',
          dark: '#1976D2',
          light: '#42A5F5',
        },
        accent: {
          DEFAULT: '#E53935',
          dark: '#D32F2F',
          light: '#EF5350',
        },
        background: '#F4F6FA',
        gaming: {
          gray: '#1F2937',
        },
      },
    },
  },
  plugins: [],
};
