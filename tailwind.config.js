/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',       // se estiver usando App Router (Next 13+)
    './components/**/*.{js,ts,jsx,tsx}', 
    './pages/**/*.{js,ts,jsx,tsx}'      // se ainda tiver pages/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
