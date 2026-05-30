import type { BlogPostLike } from "~/utils/blog"
import { queryCollection } from "@nuxt/content/server"
import { getBlogPostHref } from "~/utils/blog"
import { escapeXml } from "~/utils/xml"

const trailingSlashPattern = /\/+$/
const staticRoutes = ["/", "/about", "/blog", "/works"]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(String(config.public.siteUrl))
  const posts = await queryCollection(event, "blog")
    .where("draft", "<>", true)
    .order("date", "DESC")
    .all()

  const urls = [
    ...staticRoutes,
    ...posts.map((post) => getBlogPostHref(post as BlogPostLike)),
  ]

  setHeader(event, "content-type", "application/xml; charset=utf-8")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => renderUrl(siteUrl, path)).join("\n")}
</urlset>`
})

function renderUrl(siteUrl: string, path: string) {
  return `  <url>
    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>
  </url>`
}

function normalizeSiteUrl(siteUrl: string) {
  return (siteUrl || "https://ayingott.me").replace(trailingSlashPattern, "")
}
