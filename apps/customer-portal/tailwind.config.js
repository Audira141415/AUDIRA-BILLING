/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          bg: '#070b14',
          card: '#0e1626',
          border: '#1f293d',
          neon: '#00dfd8',
          blue: '#0070f3',
          purple: '#7928ca',
          lime: '#10b981',
          danger: '#ef4444',
        },
      },
      boxShadow: {
        'neo': '4px 4px 0px #000000',
        'neo-sm': '2px 2px 0px #000000',
        'neo-lg': '6px 6px 0px #000000',
        'neo-cyan': '4px 4px 0px #00dfd8',
        'neo-blue': '4px 4px 0px #0070f3',
      },
    },
  },
  plugins: [],
}
