// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        mobile: { max: '768px' }, // 768px 이하에서 적용
      },
    },
    colors: {
      'light-toggle-background': '#E9E9E9',
      'dark-toggle-background': '#626262',
    },
  },
  plugins: [],
};
