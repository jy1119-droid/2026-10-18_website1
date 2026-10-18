import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#09090b',
        ring: {
          green: '#10b981',
          amber: '#f59e0b',
          red: '#e11d48',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        fight: '0.22em',
      },
      boxShadow: {
        'glow-green': '0 0 0 1px rgba(16,185,129,.35), 0 0 28px -6px rgba(16,185,129,.55)',
        'glow-amber': '0 0 0 1px rgba(245,158,11,.35), 0 0 28px -6px rgba(245,158,11,.55)',
        'glow-red': '0 0 0 1px rgba(225,29,72,.35), 0 0 28px -6px rgba(225,29,72,.55)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(.85)', opacity: '0.9' },
          '70%': { transform: 'scale(2.2)', opacity: '0' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2.4s cubic-bezier(.4,0,.6,1) infinite',
        marquee: 'marquee 38s linear infinite',
        sweep: 'sweep 3.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
