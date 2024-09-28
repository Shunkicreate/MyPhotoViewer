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
      boxShadow: {
        'inner-search': '1px 1px 2px rgba(255, 255, 255, 0.3), -1px -1px 2px rgba(112, 112, 107, 0.5), inset -2px 2px 4px rgba(112, 112, 107, 0.2), inset 2px -2px 4px rgba(112, 112, 107, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.9), inset 2px 2px 5px rgba(112, 112, 107, 0.9)',
        'outer-common': '-2px 2px 4px rgba(134, 134, 128, 0.2), 2px -2px 4px rgba(134, 134, 128, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.9), 2px 2px 5px rgba(134, 134, 128, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.3), inset -1px -1px 2px rgba(134, 134, 128, 0.5)',
      },
    },
    fontFamily: {
      'noto-sans-jp': ['"Noto Sans JP"', 'sans-serif'],
    },
    colors: {
      'bg-color': '#E0DFD5',
      'text-color': '#525252',
    },
  },
  plugins: [],
} satisfies Config;
