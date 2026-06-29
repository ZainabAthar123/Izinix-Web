import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Kanit', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config
