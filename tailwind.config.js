/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.1)",
        neonBlue: "#00f3ff",
        neonRed: "#ff0055",
        darkBg: "#0a0a0a",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};