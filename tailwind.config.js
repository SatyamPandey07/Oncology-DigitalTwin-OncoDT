/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        surface: {
          900: '#07080f',
          800: '#0d0f1e',
          750: '#111328',
          700: '#151830',
          600: '#1c2040',
          500: '#242850',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          glow: 'rgba(34,211,238,0.15)',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          glow: 'rgba(167,139,250,0.15)',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
          glow: 'rgba(251,113,133,0.15)',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          glow: 'rgba(52,211,153,0.15)',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          glow: 'rgba(251,191,36,0.15)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 5px rgba(34,211,238,0.2)' },
          to: { boxShadow: '0 0 20px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.2)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
