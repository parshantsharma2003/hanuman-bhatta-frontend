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
        // Earthy Industrial Palette for Brick Manufacturing
        // Terracotta Red - Primary brand color for CTAs and accents
        'terracotta': {
          DEFAULT: '#B2422F',
          light: '#C85A45',
          dark: '#8E3525',
          50: '#F9E8E5',
          100: '#F3D1CB',
          200: '#E7A397',
          300: '#DB7563',
          400: '#CF472F',
          500: '#B2422F',
          600: '#8E3525',
          700: '#6B281C',
          800: '#471B13',
          900: '#240E0A',
        },
        // Charcoal Grey - Text and dark industrial elements
        'charcoal': {
          DEFAULT: '#333333',
          light: '#4D4D4D',
          dark: '#1A1A1A',
          50: '#F5F5F5',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
        },
        // Sand/Sandy Beige - Backgrounds and warm elements
        'sand': {
          DEFAULT: '#F5F5DC',
          light: '#FDFDF5',
          dark: '#E8E8C8',
          50: '#FEFEF9',
          100: '#FDFDF5',
          200: '#FBFBEB',
          300: '#F9F9E1',
          400: '#F7F7D7',
          500: '#F5F5DC',
          600: '#E8E8C8',
          700: '#DBDBB4',
          800: '#CECEA0',
          900: '#C1C18C',
        },
        // Alias for consistency
        'sandy': {
          DEFAULT: '#F5F5DC',
          light: '#FDFDF5',
          dark: '#E8E8C8',
          50: '#FEFEF9',
          100: '#FDFDF5',
          200: '#FBFBEB',
          300: '#F9F9E1',
          400: '#F7F7D7',
          500: '#F5F5DC',
          600: '#E8E8C8',
          700: '#DBDBB4',
          800: '#CECEA0',
          900: '#C1C18C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-roboto-slab)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'brick-texture': "url('/images/brick-texture.jpg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'slide-left': 'slideLeft 20s linear infinite',
        'slide-right': 'slideRight 20s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'brick': '0 4px 6px -1px rgba(178, 66, 47, 0.1), 0 2px 4px -1px rgba(178, 66, 47, 0.06)',
        'brick-lg': '0 10px 15px -3px rgba(178, 66, 47, 0.1), 0 4px 6px -2px rgba(178, 66, 47, 0.05)',
      },
    },
  },
  plugins: [],
}
