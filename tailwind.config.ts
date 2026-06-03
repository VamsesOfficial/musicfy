import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090909',
        foreground: '#FFFFFF',
        secondary: '#111111',
        tertiary: '#161616',
        muted: '#A1A1AA',
        accent: '#1ED760',
        border: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.1)',
        'glass-lg': '0 20px 60px rgba(0,0,0,0.15)',
        'card': '0 4px 12px rgba(0,0,0,0.15)',
        'card-lg': '0 8px 24px rgba(0,0,0,0.2)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
