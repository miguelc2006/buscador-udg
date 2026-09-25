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
          blue: '#202945',
          red: '#B12028',
          gold: '#FDCF85',
          green: '#8F993E',
          light: '#F4F6F9',
          dark: '#0B192C'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['"Times New Roman"', 'serif'],
      }
    },
  },
  plugins: [],
}
