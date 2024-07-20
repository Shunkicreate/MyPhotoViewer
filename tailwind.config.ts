import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        tilt: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(15deg)' },
          '75%': { transform: 'rotate(-15deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        tilt: 'tilt 2s cubic-bezier(0.68, -0.6, 0.32, 1.6) infinite;',
      },
    },
  },
  plugins: [],
} satisfies Config;
