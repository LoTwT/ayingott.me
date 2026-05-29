// https://nuxt.com/docs/api/configuration/nuxt-config
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"

const blogContentRoot = fileURLToPath(
  new URL("./content/blog", import.meta.url),
)
const markdownExtension = ".md"
const draftFileExtension = ".draft.md"
const wrappingQuotePattern = /^["']|["']$/g

function collectMarkdownFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return []
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      return collectMarkdownFiles(fullPath)
    }

    return entry.isFile() && entry.name.endsWith(markdownExtension)
      ? [fullPath]
      : []
  })
}

function readFrontmatter(source: string) {
  if (!source.startsWith("---\n")) {
    return new Map<string, string>()
  }

  const end = source.indexOf("\n---", 4)

  if (end === -1) {
    return new Map<string, string>()
  }

  return new Map(
    source
      .slice(4, end)
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes(":"))
      .map((line) => {
        const separator = line.indexOf(":")
        const key = line.slice(0, separator).trim()
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(wrappingQuotePattern, "")

        return [key, value] as const
      }),
  )
}

function getBlogPrerenderRoutes() {
  const routes = collectMarkdownFiles(blogContentRoot)
    .filter((filePath) => !filePath.endsWith(draftFileExtension))
    .flatMap((filePath) => {
      const source = readFileSync(filePath, "utf8")
      const frontmatter = readFrontmatter(source)

      if (frontmatter.get("draft") === "true") {
        return []
      }

      const frontmatterSlug = frontmatter.get("slug")?.trim()
      const fileSlug = relative(blogContentRoot, filePath)
        .slice(0, -markdownExtension.length)
        .split(sep)
        .join("/")
      const slug = frontmatterSlug || fileSlug

      return slug ? [`/blog/${slug}`] : []
    })

  return Array.from(new Set(["/", "/blog", ...routes])).sort()
}

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
      routes: [...getBlogPrerenderRoutes(), "/feed.xml", "/sitemap.xml"],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
