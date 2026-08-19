/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        reddit: {
          orange: '#FF4500',
          dark: '#0B1416',
          card: '#1A282D',
          hover: '#24373D',
          border: '#2D424A',
        }
      }
    },
  },
  plugins: [],
}
