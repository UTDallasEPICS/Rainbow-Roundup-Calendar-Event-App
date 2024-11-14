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
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['tailwindcss', "@vite-pwa/nuxt"],
  compatibilityDate: '2024-10-24',

  pwa: {
    manifest: {
      name: "Rainbow Roundup",
      short_name: "Rainbow Roundup",
      description: "Event calendar app for Rainbow Roundup",
      icons: [
        {}
        {}
        {}
      ]

    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: true,
      type: "module",
    }
  },
});