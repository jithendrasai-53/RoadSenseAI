/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080B0A',
        surface: {
          DEFAULT: '#131713',
          card: '#0D120E',
          panel: '#151C15',
          border: 'rgba(118, 185, 0, 0.2)',
          borderHover: 'rgba(118, 185, 0, 0.45)',
        },
        primary: {
          DEFAULT: '#76B900',
          hover: '#8AE000',
          glow: 'rgba(118, 185, 0, 0.4)',
          dim: 'rgba(118, 185, 0, 0.1)',
        },
        damage: {
          d00: '#38BDF8', // Longitudinal - Cyan / Blue
          d10: '#10B981', // Transverse - Emerald
          d20: '#F59E0B', // Alligator - Amber
          d40: '#EF4444', // Potholes - Red
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(118, 185, 0, 0.35)',
        'neon-strong': '0 0 35px rgba(118, 185, 0, 0.65)',
        'neon-sm': '0 0 10px rgba(118, 185, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 10px rgba(118, 185, 0, 0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(118, 185, 0, 0.8))' }
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
