import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff41',
          cyan: '#00f5ff',
          blue: '#0080ff',
          purple: '#bf00ff',
          red: '#ff0040',
          yellow: '#ffff00',
          orange: '#ff8c00',
        },
        cyber: {
          black: '#000000',
          dark: '#050a05',
          panel: '#0a0f0a',
          border: '#1a2f1a',
          glass: 'rgba(0,255,65,0.05)',
        },
      },
      fontFamily: {
        mono: ['Share Tech Mono', 'Courier New', 'monospace'],
        cyber: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite linear',
        'scan': 'scan 8s linear infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'glitch': 'glitch 1s linear infinite',
        'matrix': 'matrix 20s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'type': 'typing 2s steps(40) forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.92' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41' },
          '50%': { boxShadow: '0 0 20px #00ff41, 0 0 40px #00ff41, 0 0 60px #00ff41' },
        },
        glitch: {
          '0%': { textShadow: '2px 0 #ff0040, -2px 0 #00f5ff' },
          '25%': { textShadow: '-2px 0 #ff0040, 2px 0 #00f5ff' },
          '50%': { textShadow: '2px 2px #ff0040, -2px -2px #00f5ff' },
          '75%': { textShadow: '-2px -2px #ff0040, 2px 2px #00f5ff' },
          '100%': { textShadow: '2px 0 #ff0040, -2px 0 #00f5ff' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          from: { transform: 'translateX(-20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.4) saturate(1.5)' },
        },
      },
      backgroundImage: {
        'grid-cyber': "linear-gradient(rgba(0,255,65,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};

export default config;
