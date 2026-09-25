/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#020B24',
          800: '#061432',
          700: '#081A3A',
        },
        brand: {
          blue: '#2563EB',
          cyan: '#22D3EE',
          violet: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 28px -8px rgba(59,130,246,0.35)',
      },
    },
  },
  plugins: [],
};
