/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        deepGreen: '#0A4D2E', gold: '#C49A2B', cream: '#F9F1E0',
        sand: '#E5D5B0', charcoal: '#2C3E2F', whiteSoft: '#FEF9E7',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'], inter: ['Inter', 'sans-serif'], amiri: ['Amiri', 'serif'],
      },
      boxShadow: {
        '3d': '0 20px 40px -10px rgba(10, 77, 46, 0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
        '3d-hover': '0 30px 50px -12px rgba(10, 77, 46, 0.3), inset 0 1px 0 rgba(255,255,255,0.6)',
      }
    },
  },
  plugins: [],
};
