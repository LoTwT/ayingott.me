// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  modules: ["@unocss/nuxt", "@vueuse/nuxt", "@nuxtjs/color-mode"],

  css: ["@unocss/reset/tailwind.css"],

  colorMode: {
    storageKey: "vueuse-color-scheme",
  },
})
