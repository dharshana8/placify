/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          bg: '#020617',
          card: '#111827',
          hover: '#1e293b',
          border: '#334155',
        },
        status: {
          applied: '#3b82f6',
          shortlisted: '#f59e0b',
          interview: '#8b5cf6',
          selected: '#22c55e',
          rejected: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}