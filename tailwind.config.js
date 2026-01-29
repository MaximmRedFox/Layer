/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#00ff00',
          600: '#00cc00',
          900: '#001100',
        },
      },
    },
  },
  plugins: [],
}
