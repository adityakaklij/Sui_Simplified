/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#359EFF",
        "background-light": "#f0fdf4",
        "background-dark": "#064e3b",
        'comic-blue': '#359EFF',
        'comic-yellow': '#FFD166',
        'comic-red': '#EF476F',
        'comic-green': '#06D6A0',
        'map-terrain-light': '#a3e635',
        'map-terrain-dark': '#0d9488',
        'map-path': '#facc15',
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      boxShadow: {
        'comic': '8px 8px 0px rgba(0, 0, 0, 1)',
        'comic-dark': '8px 8px 0px rgba(255, 255, 255, 0.8)',
        'map-landmark': '0px 8px 12px rgba(0,0,0,0.3)',
        'map-landmark-dark': '0px 8px 12px rgba(255,255,255,0.2)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

