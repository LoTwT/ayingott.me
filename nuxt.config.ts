import tailwindcss from "@tailwindcss/vite"
import { defineNuxtConfig } from "nuxt/config"
import { ownerName } from "./app/utils/profile"

// Content 优先按 NITRO_PRESET 选择数据库，值中含 cloudflare 时会切换到 D1，与纯静态部署冲突。
if (process.env.NITRO_PRESET && process.env.NITRO_PRESET !== "static") {
  throw new Error(
    `NITRO_PRESET 只能为 static 或不设置，当前为 ${process.env.NITRO_PRESET}`,
  )
}

export default defineNuxtConfig({
  compatibilityDate: "2026-09-14",
  ssr: true,
  devtools: { enabled: true },
  // nuxt-content-assets 必须在 @nuxt/content 之前，否则缓存的文档可能保留旧的图片路径或尺寸。
  modules: ["nuxt-content-assets", "@nuxt/content", "@nuxtjs/color-mode"],
  css: ["~/assets/main.css"],
  app: {
    // 站内跳转包在 View Transition 中，动画写在 main.css；减少动态效果时 Nuxt 会跳过。
    viewTransition: true,
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
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: `${ownerName} 的文章`,
          href: "/feed.xml",
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
  content: {
    experimental: { sqliteConnector: "native" },
    build: {
      markdown: {
        highlight: { theme: { default: "github-light", dark: "github-dark" } },
        remarkPlugins: { "remark-math": {} },
        rehypePlugins: { "rehype-katex": {} },
      },
    },
  },
  contentAssets: { imageSize: "attrs" },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "ayingott-color-mode",
  },
  nitro: {
    preset: "static",
    prerender: {
      // 文章、标签与 XML 路由由 modules/content-posts.ts 追加。
      routes: ["/"],
      // 输出 posts.html 而非 posts/index.html，Pages 以无尾斜杠的 /posts 提供页面。
      autoSubfolderIndex: false,
      failOnError: true,
    },
  },
  features: {
    // 默认内联 Vue 组件样式，但内联样式排在 entry.css 之前；文章相关页面引入内容字体子集，
    // 必须改用 <link> 排在主题完整字库之后，unicode-range 重叠时子集才会优先。
    inlineStyles: (id) =>
      !!id && id.includes(".vue") && !/\/app\/pages\/(?:posts|tags)\//.test(id),
  },
  experimental: {
    // 构建时用 error.vue 生成完整的 404.html，未匹配路径无需等待客户端渲染。
    prerenderErrorPages: true,
  },
  hooks: {
    // KaTeX 样式只随含公式的文章加载，不在其他页面预取。组件与其样式文件各有一条清单记录，
    // 两者都要关闭；找不到组件时报错，避免改名后静默恢复预取。
    "build:manifest"(manifest) {
      const katexStylesheetKey = "components/posts/PostKatexStylesheet.vue"
      const katexStylesheet = manifest[katexStylesheetKey]
      if (!katexStylesheet) {
        throw new Error(
          `构建清单中没有 ${katexStylesheetKey}，请同步更新 nuxt.config.ts 中的键名`,
        )
      }
      for (const key of [katexStylesheetKey, ...(katexStylesheet.css ?? [])]) {
        const resource = manifest[key]
        if (resource) resource.prefetch = false
      }
    },
  },
  vite: { plugins: [tailwindcss()] },
})
