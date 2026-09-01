export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#0A0E14',
        panel: '#111926',
        panelLine: '#1E2733',
        scope: '#5EEAD4',
        amber: '#F0A93A',
        fog: '#8593A8',
        paper: '#E8EDF4',
        danger: '#F2545B',
        good: '#4ADE80',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(94, 234, 212, 0.25)',
        glowAmber: '0 0 20px rgba(240, 169, 58, 0.25)',
      },
    },
  },
  plugins: [],
};