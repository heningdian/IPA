/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/app.js"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        ipa: ['Noto Sans', 'Charis SIL', 'Gentium Plus', 'DejaVu Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7ff', 100: '#e0effe', 200: '#bae0fd',
          500: '#0284c7', 600: '#0369a1', 700: '#035388', 800: '#075985', 900: '#0c4a6e',
        },
        phoneme: {
          vowel: '#8b5cf6', consonant: '#0284c7', stress: '#f59e0b', diacritic: '#10b981'
        }
      }
    }
  }
}
