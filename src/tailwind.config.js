/ @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{js,jsx,ts,tsx}", // Check files in the root
    "./components//*.{js,jsx,ts,tsx}", // Check files in components
    "./utils//*.{js,jsx,ts,tsx}", // Check files in utils
    "./mock//*.{js,jsx,ts,tsx}" // Check files in mock
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};