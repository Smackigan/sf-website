/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [ './storage/framework/views/*.php',
              './resources/views/**/*.blade.php',
              './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [ 
    require('flowbite/plugin')
  ],
}
