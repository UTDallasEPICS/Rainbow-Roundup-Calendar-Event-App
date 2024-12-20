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
    '~/assets/css/main.css', // tailwind css styles imports
    'vuetify/lib/styles/main.sass', // vuetify sass styles imports
    '@mdi/font/css/materialdesignicons.min.css' // vuetify material design styles imports

  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['tailwindcss'],
  compatibilityDate: '2024-10-24',

  build: {
    transpile: ['vuetify'],
  }
})