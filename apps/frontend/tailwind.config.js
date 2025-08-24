/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-900': 'var(--bg-900)',
        'bg-800': 'var(--bg-800)',
        'surface-800': 'var(--surface-800)',
        'text-100': 'var(--text-100)',
        'text-300': 'var(--text-300)',
        'line-700': 'var(--line-700)',
        'accent-red': 'var(--accent-red)',
        'accent-red-2': 'var(--accent-red-2)',
        'focus-ring': 'var(--focus-ring)',
        'ton-blue': '#0088cc',
        'ton-light-blue': '#00a8ff',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '36px',
        '6xl': '48px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 8px 25px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(230, 36, 59, 0.3)',
      },
    },
  },
  plugins: [],
}
