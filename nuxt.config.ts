import tailwindcss from "@tailwindcss/vite"
import { defineNuxtConfig } from "nuxt/config"
import { ownerName } from "./app/utils/profile"

export default defineNuxtConfig({
  compatibilityDate: "2026-09-14",
  ssr: true,
  devtools: { enabled: true },
  modules: ["@nuxtjs/color-mode"],
  css: ["~/assets/main.css"],
  app: {
    head: {
      htmlAttrs: { lang: "zh-CN", class: "brutal" },
      title: ownerName,
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon.png",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          sizes: "any",
          href: "/favicon.svg",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
      script: [
        {
          key: "theme-preference",
          tagPosition: "bodyOpen",
          // 复用 color-mode 在 head 中解析的偏好，先于页面内容绘制。
          innerHTML:
            'document.documentElement.dataset.themePreference = window.__NUXT_COLOR_MODE__?.preference || "system";',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      // 在构建时确定，预渲染 HTML 与客户端水合使用同一年份。
      copyrightYear: new Date().getFullYear(),
    },
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "ayingott-color-mode",
  },
  nitro: {
    preset: "static",
    prerender: {
      routes: ["/"],
      failOnError: true,
    },
  },
  vite: { plugins: [tailwindcss()] },
})
