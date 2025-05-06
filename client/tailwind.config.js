/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "amazon-badge": "#FF9900",
        "ebay-badge": "#86B817",
        "bestbuy-badge": "#0a4abf",
      },
    },
  },
  plugins: [require("daisyui")],
}