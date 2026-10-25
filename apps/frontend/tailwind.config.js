/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--app-font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['var(--app-font-mono)', 'JetBrains Mono', 'monospace'],
      },
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
        navy: {
          800: '#172d4a',
          900: '#1e3a5f',
        },
        theme: {
          bg: 'var(--app-bg)',
          surface: 'var(--app-surface)',
          card: 'var(--app-card)',
          border: 'var(--app-border)',
          primary: 'var(--app-primary)',
          accent: 'var(--app-accent)',
          text: 'var(--app-text)',
          muted: 'var(--app-text-muted)',
        },
      },
    },
  },
  plugins: [],
}
