// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    BASEURL: '',
    ISSUER: ''
  },
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
