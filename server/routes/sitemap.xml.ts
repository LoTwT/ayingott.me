import { queryCollection } from "@nuxt/content/server"
import { defineEventHandler, setHeader } from "h3"
import { siteOrigin } from "~~/app/utils/profile"

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, "posts")
    .select("path", "date", "updated", "tags")
    .order("date", "DESC")
    .all()
  const tags = [...new Set(posts.flatMap((post) => post.tags ?? []))].toSorted()

  const entries: { path: string; lastModified?: string }[] = [
    { path: "/" },
    { path: "/posts" },
    ...posts.map((post) => ({
      path: post.path,
      lastModified: post.updated ?? post.date,
    })),
    ...tags.map((tag) => ({ path: `/tags/${tag}` })),
  ]
  const urls = entries.map(({ path, lastModified }) =>
    [
      "  <url>",
      `    <loc>${siteOrigin}${path}</loc>`,
      ...(lastModified ? [`    <lastmod>${lastModified}</lastmod>`] : []),
      "  </url>",
    ].join("\n"),
  )

  setHeader(event, "content-type", "application/xml; charset=utf-8")
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`
})
