import dotenv, { config } from "dotenv";
import { runtimeconfig } from "googleapis/build/src/apis/runtimeconfig";

dotenv.config();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      NUXT_GOOGLE_PLACES: process.env.NUXT_GOOGLE_PLACES,
      NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY: process.env.NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY
    },
    
    AWS_REGION: process.env.AWS_REGION,
    NUXT_AWS_ACCESS_KEY_ID: process.env.NUXT_AWS_ACCESS_KEY_ID,
    NUXT_AWS_SECRET_ACCESS_KEY: process.env.NUXT_AWS_SECRET_ACCESS_KEY,
    NUXT_AWS_S3_BUCKET_NAME: process.env.NUXT_AWS_S3_BUCKET_NAME,

    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
    url: process.env.URL,
    BETTER_AUTH_URL: process.env.URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    NUXT_PUSH_VAPID_PRIVATE_KEY: process.env.NUXT_PUSH_VAPID_PRIVATE_KEY
  },
  vite: {
    resolve: {
      alias: {
        // Redirect the invalid import to an empty stub
        '.prisma/client/index-browser': '/dev/null'
      }
    }
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
    //"@sidebase/nuxt-auth",
    "nuxt-scheduler",
    '@pinia/nuxt'
  ],
  /*auth: {
    isEnabled: true,
    baseURL: process.env.URL + "/api/auth",
    provider: {
      type: "authjs",
      trustHost: false,
      defaultProvider: "email",
      addDefaultCallbackUrl: true,
    },
  },*/
  compatibilityDate: "2024-10-24",

  plugins: ["~/plugins/fullcalendar.client"],
  build: {
    transpile: ["vuetify"],
  },
  pwa: {
    strategies: "injectManifest",
    srcDir: "./service-worker",
    filename: "sw.ts",
    registerType: "autoUpdate",
    client: {
      installPrompt: true,
    },
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
