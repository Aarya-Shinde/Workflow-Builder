/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#001017",
        'surface-900': "#0a1929",
        'surface-800': "#132f4c",
        primary: "#81ecff",
        'primary-container': "#00e3fd",
        'primary-dim': "#00d4ec",
        secondary: "#cfdef5",
        tertiary: "#eef8ff",
        error: "#ff716c",
        'error-container': "#9f0519",
        outline: "#657881",
        'outline-variant': "#374b53",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dot-pattern': "radial-gradient(circle, #374b53 1px, transparent 1px)",
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(129, 236, 255, 0.4)',
        'neon-cyan-lg': '0 0 40px rgba(129, 236, 255, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class',
}