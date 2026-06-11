/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-driven neutral tokens (flip between dark/light via CSS variables).
        white: 'rgb(var(--w) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--ink-900) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
        },
        sand: {
          DEFAULT: 'rgb(var(--sand) / <alpha-value>)',
          dark: '#E5DECF',
        },
        haze: 'rgb(var(--haze) / <alpha-value>)',
        // Fixed "dark text on a bright accent" token — never changes with theme.
        onink: '#0B0B0B',
        charcoal: '#171717',
        // Brand accents — fixed, legible on both themes.
        ember: {
          DEFAULT: '#D96A2C',
          light: '#E8854A',
          dark: '#B5531D',
        },
        teal: {
          DEFAULT: '#2EC4C7',
          light: '#5BD7D9',
          dark: '#1E9799',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Oswald', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        body: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.18em',
        wider2: '0.28em',
      },
      maxWidth: {
        'screen-2xl': '1440px',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(217, 106, 44, 0.45)',
        teal: '0 0 40px -8px rgba(46, 196, 199, 0.4)',
        card: '0 24px 60px -24px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'ember-fade': 'linear-gradient(135deg, #D96A2C 0%, #B5531D 100%)',
        'dark-fade': 'linear-gradient(180deg, rgba(11,11,11,0) 0%, rgba(11,11,11,0.85) 100%)',
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scroll-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease forwards',
        'scroll-bob': 'scroll-bob 1.8s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
