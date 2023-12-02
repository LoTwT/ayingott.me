import { AvailableThemes } from "./uno.config"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["@unocss/reset/tailwind.css"],

  runtimeConfig: {
    public: {
      availableThemes: AvailableThemes,
    },
  },

  modules: ["@nuxt/content", "@nuxtjs/i18n", "@vueuse/nuxt", "@unocss/nuxt"],

  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en"],
    strategy: "prefix_and_default",
    detectBrowserLanguage: {
      alwaysRedirect: true,
      useCookie: true,
      redirectOn: "root",
      fallbackLocale: "zh",
      cookieKey: "ayingott_locale",
      cookieCrossOrigin: true,
    },
  },

  content: {
    markdown: {
      anchorLinks: false,
    },
  },
})
