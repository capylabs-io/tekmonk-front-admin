import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          25: '#FCF7FB',
          50: '#FBF3FA',
          100: '#F9E7F6',
          200: '#F5D0EF',
          300: '#EEABE4',
          400: '#E578D5',
          500: '#DC58C8',
          600: '#BC4CAC',
          700: '#9A1595',
          800: '#83077E',
          900: '#5A0057',
          950: '#320130',
        }
      }
    },
  },
  plugins: [],
}
export default config
