/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        udg: {
          blue: '#002B49',
          gold: '#C59B27',
          red: '#9B111E',
          light: '#F4F6F9',
          dark: '#0B192C'
        }
      }
    },
  },
  plugins: [],
}
