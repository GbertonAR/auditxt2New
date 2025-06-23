import { type Config } from 'tailwindcss'
import { defineConfig } from 'tailwindcss/helpers'

export default defineConfig({
  darkMode: 'media', // o 'class' si preferís controlar el modo oscuro manualmente
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config)