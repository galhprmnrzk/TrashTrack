/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Ini akan menggantikan font 'sans' bawaan Tailwind
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}