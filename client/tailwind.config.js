/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}",
    "node_modules/flowbite-react/**/*.{html,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [import('flowbite-react')],
}

