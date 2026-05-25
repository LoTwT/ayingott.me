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

  modules: ["@vueuse/nuxt", "@nuxtjs/color-mode", "@nuxt/content"],

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

  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
    experimental: {
      sqliteConnector: "native",
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: "https://ayingott.me",
      nowText: "",
      resumePdfUrl: "",
    },
  },

  nitro: {
    prerender: {
      routes: ["/feed.xml", "/sitemap.xml"],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
