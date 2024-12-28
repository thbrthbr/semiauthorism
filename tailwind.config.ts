import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lobster: ['Lobster', 'sans-serif'], // 'MyCustomFont'은 @font-face에서 설정한 이름
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      utilities: {
        '.custom-line-clamp-3': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          '-webkit-line-clamp': '3',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
} satisfies Config
