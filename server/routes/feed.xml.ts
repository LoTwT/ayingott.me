import { queryCollection } from "@nuxt/content/server"
import { defineEventHandler, setHeader } from "h3"
import { ownerName, siteOrigin } from "~~/app/utils/profile"

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

// XML 1.0 不允许制表、换行、回车以外的控制字符、孤立的代理码位及 U+FFFE、U+FFFF，
// 出现一个就会使阅读器拒收整个 feed。
function isAllowedXmlCharacter(character: string) {
  const codePoint = character.codePointAt(0)!
  if (codePoint === 0x9 || codePoint === 0xa || codePoint === 0xd) return true
  if (codePoint < 0x20 || codePoint === 0xfffe || codePoint === 0xffff) {
    return false
  }
  return codePoint < 0xd800 || codePoint > 0xdfff
}

function escapeXml(text: string) {
  return [...text]
    .filter(isAllowedXmlCharacter)
    .join("")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

// date 为 YYYY-MM-DD；只用 UTC 计算星期，不受构建环境的时区影响。
function formatRfc822Date(date: string) {
  const [year, month, day] = date.split("-").map(Number) as [
    number,
    number,
    number,
  ]
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return `${weekdayNames[weekday]}, ${date.slice(8)} ${monthNames[month - 1]} ${year} 00:00:00 GMT`
}

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, "posts")
    .select("path", "title", "description", "date")
    .order("date", "DESC")
    .all()
  const feedUrl = `${siteOrigin}/feed.xml`
  const postsUrl = `${siteOrigin}/posts`

  // 只输出摘要，不输出全文：交互组件与图表无法在阅读器中正确呈现。
  const items = posts.map((post) => {
    const postUrl = `${siteOrigin}${post.path}`
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${formatRfc822Date(post.date)}</pubDate>
    </item>`
  })

  setHeader(event, "content-type", "application/rss+xml; charset=utf-8")
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${ownerName} 的文章`)}</title>
    <link>${postsUrl}</link>
    <description>${escapeXml(`${ownerName} 写的文章。`)}</description>
    <language>zh-CN</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`
})
