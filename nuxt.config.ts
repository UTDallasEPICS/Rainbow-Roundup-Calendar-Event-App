import dotenv from "dotenv";

dotenv.config();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
  },

  devtools: { enabled: true },
  css: [
    "~/assets/css/main.css",
    // '@fullcalendar/core/main.css',
    // '@fullcalendar/daygrid/main.css',
    // '@fullcalendar/list/main.css',
    // '@fullcalendar/interaction/main.css',
    "vuetify/lib/styles/main.sass", // vuetify sass styles imports
    "@mdi/font/css/materialdesignicons.min.css", // vuetify material design styles imports
  ],

  app: {
    head: {
      script: [
        {
          src: "https://unpkg.com/@heroicons/vue/outline",
          type: "text/javascript",
        },
      ],
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "tailwindcss",
    "@vite-pwa/nuxt",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@sidebase/nuxt-auth",
  ],
  auth: {
    isEnabled: true,
    baseURL: "http://localhost:3000/api/auth",
    provider: {
      type: "authjs",
      trustHost: false,
      defaultProvider: "email",
      addDefaultCallbackUrl: true,
    },
  },
  compatibilityDate: "2024-10-24",

  plugins: ["~/plugins/fullcalendar.client"],
  build: {
    transpile: ["vuetify"],
  },
  pwa: {
    strategies: "injectManifest",
    srcDir: "service-worker",
    filename: "sw.ts",
    registerType: "autoUpdate",
    manifest: {
      name: "Rainbow Roundup",
      short_name: "RR",
      start_url: "/",
      description: "Event calendar app for Rainbow Roundup",
      theme_color: "#ffffff",
      icons: [
        {
          src: "images/icons/pwa_logo_64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "images/icons/pwa_logo_144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "images/icons/pwa_logo_192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "images/icons/pwa_logo_512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "images/icons/pwa_logo_mb_ss.png",
          sizes: "600x400",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
  },
});
