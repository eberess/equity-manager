/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ADEO Primary Colors
        primary: {
          100: '#d9f0f3',
          200: '#91d5db',
          300: '#48bac4',
          400: '#009eac',
          500: '#00919f',
          600: '#007f8c',
          700: '#006974',
          800: '#004e57',
          900: '#002e33',
        },
        // ADEO Grey Colors
        grey: {
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#191919',
          999: '#000000',
          50: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
