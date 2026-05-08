// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2026-03-31",

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  modules: ["@vueuse/nuxt", "@nuxtjs/color-mode"],

  css: ["~/assets/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
    },
  },

  colorMode: {
    classSuffix: "",
    storage: "cookie",
    storageKey: "ayin-theme",
  },

  runtimeConfig: {
    public: {
      siteUrl: "https://ayingott.me",
      nowText: "",
      resumePdfUrl: "",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
