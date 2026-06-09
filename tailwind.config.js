/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f8f2', 100: '#c5eddf', 200: '#9de1ca',
          300: '#6dd4b2', 400: '#4dd6a3', 500: '#1D9E75',
          600: '#168a64', 700: '#0f7453', 800: '#095f42', 900: '#044a32',
        },
        dark: {
          bg:    '#141820',
          card:  '#1b2131',
          card2: '#1e2736',
          border: 'rgba(255,255,255,0.06)',
          muted: '#252d3d',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in':   'fadeIn 0.25s ease-out',
        'slide-up':  'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        'bounce-in': 'bounceIn 0.45s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn:   { from: { opacity:'0', transform:'translateY(6px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        slideUp:  { from: { transform:'translateY(100%)', opacity:'0' }, to: { transform:'translateY(0)', opacity:'1' } },
        bounceIn: { from: { transform:'scale(0)', opacity:'0' }, to: { transform:'scale(1)', opacity:'1' } },
      },
      boxShadow: {
        green: '0 4px 20px rgba(29,158,117,0.35)',
        card:  '0 2px 20px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
