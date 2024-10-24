// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    BASEURL: '',
    ISSUER: ''
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['tailwindcss', '@vite-pwa/nuxt'],
  compatibilityDate: '2024-10-23',

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Rainbow Roundup Event Calendar',
      short_name: 'RR Calendar',
      theme_color: '#ffffff',
      start_url: '/',
      display: 'standalone',
      icons: [
        {
          src: 'pwa_logo_512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa_logo_192.png',
          sizes: '192x192',
          type: 'image/png',
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true
    }
  }
})