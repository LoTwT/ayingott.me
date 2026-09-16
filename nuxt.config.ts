import tailwindcss from "@tailwindcss/vite"
import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  compatibilityDate: "2026-09-14",
  ssr: true,
  devtools: { enabled: true },
  modules: ["@nuxtjs/color-mode"],
  css: ["~/assets/main.css"],
  app: {
    head: {
      htmlAttrs: { lang: "zh-CN", class: "brutal" },
      title: "Lo · 个人主页",
      link: [{ rel: "icon", href: "data:," }],
      meta: [{ name: "description", content: "Lo 的个人主页。" }],
    },
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "ayingott-color-mode",
  },
  nitro: {
    prerender: {
      routes: ["/"],
      failOnError: true,
    },
  },
  vite: { plugins: [tailwindcss()] },
})
