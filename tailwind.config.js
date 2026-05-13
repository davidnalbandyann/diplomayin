/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        math: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
