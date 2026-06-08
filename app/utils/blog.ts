export interface BlogPostLike {
  path: string
  slug?: string
  title: string
  date: string
  updated?: string
  description: string
  tags?: string[]
  body?: unknown
}

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Shanghai",
})
const whitespacePattern = /\s+/g
const cjkPattern = /[\u4E00-\u9FFF]/g
const nonCjkPattern = /[\u4E00-\u9FFF]/g

export function getBlogPostSlug(post: Pick<BlogPostLike, "path" | "slug">) {
  const frontmatterSlug = post.slug?.trim()

  if (frontmatterSlug) {
    return frontmatterSlug
  }

  const segments = post.path.split("/").filter(Boolean)
  return segments.at(-1) ?? ""
}

export function getBlogPostHref(post: Pick<BlogPostLike, "path" | "slug">) {
  return `/blog/${getBlogPostSlug(post)}`
}

export function formatBlogDate(date: string) {
  const parsed = parseIsoDate(date)

  if (!parsed) {
    return date
  }

  return dateFormatter.format(parsed)
}

export function formatRssDate(date: string) {
  return parseIsoDate(date)?.toUTCString() ?? new Date().toUTCString()
}

export function estimateReadingTime(body: unknown) {
  const text = collectText(body).replace(whitespacePattern, " ").trim()

  if (!text) {
    return "1 分钟"
  }

  const cjkCount = text.match(cjkPattern)?.length ?? 0
  const latinText = text.replace(nonCjkPattern, " ")
  const latinWords = latinText.split(whitespacePattern).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(cjkCount / 500 + latinWords / 220))

  return `${minutes} 分钟`
}

function parseIsoDate(date: string) {
  const parsed = new Date(`${date}T00:00:00+08:00`)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

function collectText(node: unknown): string {
  if (!node) {
    return ""
  }

  if (typeof node === "string") {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(collectText).join(" ")
  }

  if (typeof node !== "object") {
    return ""
  }

  const record = node as Record<string, unknown>
  const directText = typeof record.value === "string" ? record.value : ""
  const children = Array.isArray(record.children) ? record.children : []
  const minimarkValue = Array.isArray(record.value) ? record.value : []

  return [directText, collectText(children), collectText(minimarkValue)]
    .filter(Boolean)
    .join(" ")
}
