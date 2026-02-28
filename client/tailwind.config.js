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
        "primary": "#1152d4",
        "background-light": "#f6f6f8",
        "emerald-custom": "#10b981",
        "rose-custom": "#f43f5e",
        "background-dark": "#101622",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "body": ["Manrope", "sans-serif"]
      },
    },
  },
  plugins: [],
}