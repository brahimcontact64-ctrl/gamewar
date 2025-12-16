/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gaming: {
          green: '#00ff41',
          cyan: '#00d9ff',
          dark: '#0a0e1a',
          darker: '#050810',
          gray: '#1a1f2e',
          'gray-light': '#2a2f3e',
        },
      },
    },
  },
  plugins: [],
};
