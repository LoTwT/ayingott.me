import type { BlogPostLike } from "~/utils/blog"
import { queryCollection } from "@nuxt/content/server"
import { formatRssDate, getBlogPostHref } from "~/utils/blog"
import { escapeXml } from "~/utils/xml"

const trailingSlashPattern = /\/+$/

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(String(config.public.siteUrl))
  const posts = await queryCollection(event, "blog")
    .where("draft", "<>", true)
    .order("date", "DESC")
    .all()

  setHeader(event, "content-type", "application/rss+xml; charset=utf-8")

  const items = posts
    .map((post) => renderRssItem(siteUrl, post as BlogPostLike))
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ayingott.me 文章</title>
    <link>${escapeXml(siteUrl)}</link>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Lo 的笔记。</description>
    <language>zh-CN</language>
    ${items}
  </channel>
</rss>`
})

function renderRssItem(siteUrl: string, post: BlogPostLike) {
  const href = `${siteUrl}${getBlogPostHref(post)}`

  return `  <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(href)}</link>
      <guid>${escapeXml(href)}</guid>
      <pubDate>${escapeXml(formatRssDate(post.date))}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`
}

function normalizeSiteUrl(siteUrl: string) {
  return (siteUrl || "https://ayingott.me").replace(trailingSlashPattern, "")
}
