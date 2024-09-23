/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.html', './static/js/**/*.js'],

  theme: {
    fontFamily:{
      'sans': ['Roboto','sans-serif']
    },
    extend: {
      backgroundImage: {
        "home": "url('/static/imagens/capa.png')"
      }
    },
  },
  plugins: [],
}

