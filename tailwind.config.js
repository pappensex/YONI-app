/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          amethyst: '#9966CC',
          purple: '#7c3aed',
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
        bg: {
          dark: '#0b0b10',
        },
      },
      borderRadius: {
        'yoni': '14px',
      },
    },
  },
  plugins: [],
}
