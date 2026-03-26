/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1120',
        surface: '#1e293b',
        glow: '#38bdf8',
      },
      boxShadow: {
        sharp: '0 0 0 1px rgba(56, 189, 248, 0.5), 0 10px 30px rgba(14, 165, 233, 0.2)',
      },
      animation: {
        pulsefast: 'pulse 1s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
};
