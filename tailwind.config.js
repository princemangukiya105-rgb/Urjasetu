/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#38b0f8',
          500: '#0e94e6',
          600: '#0275c8',
          700: '#035da3',
          800: '#074f85',
          900: '#0c426e',
          950: '#082a49',
        },
        civic: {
          navy: '#0F172A',
          dark: '#1E293B',
          blue: '#2563EB',
          sky: '#0EA5E9',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          light: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
