/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          amethyst: '#9966CC',
        },
        text: {
          starwhite: '#F5F5F5',
        },
        ok: {
          emerald: '#2ECC71',
        },
        hl: {
          gold: '#FFD700',
        },
      },
    },
  },
  plugins: [],
}
