// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      screens: {
        mobile: { max: '768px' }, // 768px 이하에서 적용
      },
    },
    colors: {
      'light-toggle-background': '#E9E9E9',
      'dark-toggle-background': '#626262',
      'light-text': '#2E2E2E',
      'light-highlight': '#A7C7E7',
      'light-hover': '#78A4D1',
      'light-bg': '#FAFAFA',
      'light-strong': '#5A9BD8',
      'dark-text': '#FAFAFA',
      'dark-highlight': '#8BAFC9',
      'dark-hover': '#7295B0',
      'dark-strong': '#4A88C7',
      'dark-bg': '#2E2E2E',
    },
  },
  plugins: [],
};
