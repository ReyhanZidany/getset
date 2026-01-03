import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*. {js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1b4f8f',
        'primary-dark': '#153d70',
        'primary-light': '#2563a8',
        'broken-white': '#f5f5f0',
        'blue': {
          50: '#e6f0f9',
          100: '#cce1f3',
          200: '#99c3e7',
          300: '#66a5db',
          400: '#3387cf',
          500: '#2068b3',
          600: '#1b4f8f',
          700: '#153d70',
          800: '#0f2b50',
          900: '#0a1930',
        },
      },
    },
  },
  plugins: [],
}
export default config