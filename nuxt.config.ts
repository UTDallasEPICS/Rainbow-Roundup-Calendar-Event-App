import dotenv from 'dotenv'

dotenv.config()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    BASEURL: '',
    ISSUER: '',
  },

  devtools: { enabled: true },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['tailwindcss'],
  compatibilityDate: '2024-10-24',

  plugins: ['~/plugins/fullcalendar.client'],
  build: {
    transpile: ['@fullcalendar']
  },

  // something about the fullcalendar styles aren't importing correctly
  css: [
    // 'fullcalendar/core/main.css',
    // 'fullcalendar/daygrid/main.css',
    // 'fullcalendar/timegrid/main.css'
  ]


})