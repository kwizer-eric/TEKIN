import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--tekin-font-sans)', 'sans-serif'],
      },
      colors: {
        tekin: {
          navy: 'var(--tekin-navy)',
          'navy-light': 'var(--tekin-navy-light)',
          'navy-muted': 'var(--tekin-navy-muted)',
          emerald: 'var(--tekin-emerald)',
          'emerald-light': 'var(--tekin-emerald-light)',
          'emerald-mid': 'var(--tekin-emerald-mid)',
          amber: 'var(--tekin-amber)',
          'amber-light': 'var(--tekin-amber-light)',
          red: 'var(--tekin-red)',
          'red-light': 'var(--tekin-red-light)',
          blue: 'var(--tekin-blue)',
          'blue-light': 'var(--tekin-blue-light)',
          gray: {
            50: 'var(--tekin-gray-50)',
            100: 'var(--tekin-gray-100)',
            200: 'var(--tekin-gray-200)',
            400: 'var(--tekin-gray-400)',
            600: 'var(--tekin-gray-600)',
            800: 'var(--tekin-gray-800)',
            900: 'var(--tekin-gray-900)',
          },
          white: 'var(--tekin-white)',
        },
      },
      boxShadow: {
        card: 'var(--tekin-shadow-card)',
      },
    },
  },
  plugins: [],
} satisfies Config
