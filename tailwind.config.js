/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        iprb: {
          navy: '#062552',
          navyDark: '#041938',
          navyDeep: '#082848',
          blue: '#03589E',
          blueHover: '#0A6AC0',
          blueSoft: '#E8F2FC',
          flame: '#E85D04',
          gold: '#F59E0B',
          goldBright: '#FBB016',
          surface: '#F4F7FB',
          border: '#D5E2F0',
          ink: '#0D213A',
        },
        pulpit: {
          bg: '#040B16',
          surface: '#081529',
          card: '#0D1E38',
          cardBorder: '#1C3559',
          text: '#F8FAFC',
          muted: '#CBD5E1',
          gold: '#FBB016',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'system-ui',
          'sans-serif'
        ],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(6, 37, 82, 0.08), 0 1px 2px -1px rgba(6, 37, 82, 0.05)',
        'card': '0 4px 12px -2px rgba(6, 37, 82, 0.08), 0 2px 6px -2px rgba(6, 37, 82, 0.04)',
        'pulpit': '0 10px 28px -5px rgba(4, 11, 22, 0.7), 0 8px 12px -6px rgba(4, 11, 22, 0.6)',
      }
    },
  },
  plugins: [],
}
