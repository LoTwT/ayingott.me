// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-10-22",

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  modules: ["@unocss/nuxt", "@vueuse/nuxt", "@nuxtjs/color-mode"],

  css: ["@unocss/reset/tailwind-compat.css", "~/assets/main.css"],

  colorMode: {
    storageKey: "vueuse-color-scheme",
  },
})
