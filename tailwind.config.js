/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          amethyst: '#9966CC',
          deep: '#663399',
          light: '#B399D9',
        },
        text: {
          starwhite: '#F5F5F5',
          muted: '#B8B8C2',
        },
        status: {
          ok: '#2ECC71',
          warning: '#F39C12',
          error: '#E74C3C',
        },
        highlight: {
          gold: '#FFD700',
          silver: '#C0C0C0',
        },
        background: {
          void: '#0A0A0F',
          panel: 'rgba(255, 255, 255, 0.06)',
        }
      },
      borderRadius: {
        'yoni': '14px',
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Space Grotesk', 'var(--font-space-grotesk)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'starfield': 'starfield 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        starfield: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
