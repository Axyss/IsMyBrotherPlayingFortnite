/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}", "./views/*.handlebars"],
  theme: {
    extend: {
      fontFamily: {
        "fortnite": ["Fortnite", "serif"]
      },
      backgroundImage: {
        'fortnite-sunset': "url('../assets/images/background-2.png')"
      }
    },
  },
  plugins: [],
}

