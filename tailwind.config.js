/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Mobile-first helpers:
      // - xs: smallest modern phones (360px)
      // - phone: typical iPhone/Samsung base width (390px)
      screens: {
        xs: "360px",
        phone: "390px",
      },
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
