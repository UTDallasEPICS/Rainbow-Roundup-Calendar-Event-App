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
  css: [
    '~/assets/css/main.css',
    // '@fullcalendar/core/main.css',
    // '@fullcalendar/daygrid/main.css',
    // '@fullcalendar/list/main.css',
    // '@fullcalendar/interaction/main.css',
  ],

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
  }

})