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
    strategies: "injectManifest",
    srcDir: "service-worker",
    filename: "sw.ts",
    registerType: 'autoUpdate',
    manifest: {
      name: "Rainbow Roundup",
      short_name: "RR",
      description: "Event calendar app for Rainbow Roundup",
      theme_color: "#ffffff",
      icons: [
        {
          src: "images/icons/pwa_logo_64.png",
          sizes: "64x64",
          type: "image/png"
        },
        {
          src: "images/icons/pwa_logo_144.png",
          sizes: "144x144",
          type: "image/png"
        },{
          src: "images/icons/pwa_logo_192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "images/icons/pwa_logo_512.png",
          sizes: "512x512",
          type: "image/png"
        },
      ]
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    }
  },
});