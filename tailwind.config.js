/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};
