/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}",
    "node_modules/flowbite-react/**/*.{html,js,jsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'not-dark': 'var(--bg-light)',
      },
      textColor: {
        'not-dark': 'var(--text-light)',
      },
    },
  },
  plugins: [import('flowbite-react')],
}

