/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#0F172A',         // Rich midnight slate
          surface: '#1E293B',    // Card surface
          card: '#1E293B',
          cardHover: '#334155',
          border: '#334155',
          primary: '#6366F1',    // Vibrant Indigo
          primaryHover: '#4F46E5',
          emerald: '#10B981',    // Success / Mastery
          gold: '#F59E0B',       // Coins / Rewards / Stars
          goldHover: '#D97706',
          coral: '#F43F5E',      // Mistakes / Danger
          purple: '#8B5CF6',     // Epic / Special
          cyan: '#06B6D4',       // Info / Speed
          fire: '#FF5722',       // Streak flame
        }
      },
      fontFamily: {
        game: ['"Fredoka"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'game-sm': '0 3px 0 0 rgba(0,0,0,0.3)',
        'game-btn': '0 4px 0 0 rgba(0,0,0,0.35)',
        'game-btn-active': '0 1px 0 0 rgba(0,0,0,0.35)',
        'game-card': '0 6px 0 0 rgba(0,0,0,0.25), 0 10px 15px -3px rgba(0,0,0,0.3)',
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.4)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        'coin-spin': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        'flame-wobble': {
          '0%, 100%': { transform: 'rotate(-2deg) scale(1)' },
          '50%': { transform: 'rotate(2deg) scale(1.08)' },
        }
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'coin-spin': 'coin-spin 1.2s linear infinite',
        'flame-wobble': 'flame-wobble 1.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
