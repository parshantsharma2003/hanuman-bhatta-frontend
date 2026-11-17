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
        // Architectural & Industrial Brand Palette
        // Brick Red / Terracotta - Primary brand color for strategic CTAs and structural accents
        'terracotta': {
          DEFAULT: '#B8402C',
          light: '#C95743',
          dark: '#8E2E1D',
          50: '#FBEEEB',
          100: '#F5CAC3',
          200: '#EAA194',
          300: '#DB7967',
          400: '#C95743',
          500: '#B8402C',
          600: '#A33623',
          700: '#8E2E1D',
          800: '#6B1F13',
          900: '#44140C',
        },
        // Architectural Charcoal - High-end industrial darks and typography
        'charcoal': {
          DEFAULT: '#242321',
          light: '#42403B',
          dark: '#171615',
          deep: '#191817',
          muted: '#A9A39A',
          50: '#F5F3EF',
          100: '#EAE7E1',
          200: '#D8D4CC',
          300: '#BCB7AD',
          400: '#A9A39A',
          500: '#736F67',
          600: '#57544E',
          700: '#42403B',
          800: '#31302C',
          900: '#242321',
          950: '#191817',
        },
        // Warm Cream / Mineral Sand - Rich architectural background & calm whitespace
        'sand': {
          DEFAULT: '#F5F0E8',
          light: '#FAF8F5',
          dark: '#E2DDD5',
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#EDE8DF',
          300: '#E2DDD5',
          400: '#D1C7B6',
          500: '#B8AD9B',
          600: '#9A907E',
          700: '#7A7161',
          800: '#5C5447',
          900: '#3F392F',
        },
        'sandy': {
          DEFAULT: '#F5F0E8',
          light: '#FAF8F5',
          dark: '#E2DDD5',
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#EDE8DF',
          300: '#E2DDD5',
          400: '#D1C7B6',
          500: '#B8AD9B',
          600: '#9A907E',
          700: '#7A7161',
          800: '#5C5447',
          900: '#3F392F',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-roboto-slab)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'brick-texture': "url('/images/brick-texture.jpg')",
      },
      boxShadow: {
        'brick': '0 1px 3px rgba(36, 35, 33, 0.06), 0 1px 2px rgba(36, 35, 33, 0.04)',
        'brick-lg': '0 4px 14px rgba(36, 35, 33, 0.08), 0 1px 3px rgba(36, 35, 33, 0.04)',
      },
    },
  },
  plugins: [],
}
