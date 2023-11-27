// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@nuxtjs/i18n", "@vueuse/nuxt", "@unocss/nuxt"],
  i18n: {
    defaultLocale: "en",
  },
  css: ["@unocss/reset/tailwind.css"],
})
