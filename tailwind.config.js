module.exports = {
  prefix: 'wxb-',
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    colors: {
      'gray-200': '#616a80',
      'gray-300': '#cacccf',
      'gray-400': '#515c6d',
      'gray-500': '#2b313a',
      'gray-600': '#272a31',
      'gray-700': '#333a44',
      'gray-800': '#262a31',
      'gray-900': '#383e4a',
      'blue-400': '#61c1ff',
      'blue-700': '#5693c3',
      'green-400': '#82e28c',
      'green-700': '#5fa777',
      'red-400': '#e28282',
      'red-700': '#b56777',
      'orange-500': '#f97316',
      'brown-200': '#f4a460',
      'yellow-500': '#ffff00',
      'white-500': '#ffffff'
    },
    extend: {
      'flex': {
        '2xl': '0 0 16rem',
        'lg': '0 0 10rem',
        'md': '0 0 7.5rem',
        'sm': '0 0 6.25rem',
        'xs': '0 0 2rem'
      }
    }
  },
  plugins: []
}
