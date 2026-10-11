import { lstat, mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { dirname, extname, join, relative, resolve, sep } from "node:path"
import type { Nodes } from "mdast"
import { imageSize } from "image-size"
import { fromMarkdown } from "mdast-util-from-markdown"
import { defineNuxtModule } from "nuxt/kit"
import { parseDocument } from "yaml"
import { z } from "zod"
import { ownerName, siteOrigin } from "../app/utils/profile"
import { renderPostShareCard } from "./post-share-cards/render-post-share-card"

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const contentFileExtensions = new Set([".md", ".yml", ".yaml", ".json"])
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const shareCardImageExtensions = new Set([".png", ".jpg", ".jpeg"])

function isExistingCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const [year, month, day] = match.slice(1).map(Number) as [
    number,
    number,
    number,
  ]
  // Date.UTC(year, month, 0) 是该月最后一天；只用 UTC 计算，不受时区影响。
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth
}

function requiredString() {
  return z.string({
    error: (issue) =>
      issue.input === undefined ? "缺少必填字段" : "必须是字符串",
  })
}

const calendarDateSchema = requiredString().refine(
  isExistingCalendarDate,
  "必须是真实存在的 YYYY-MM-DD 日期",
)

const postFrontmatterSchema = z
  .strictObject(
    {
      title: requiredString().trim().min(1, "不能为空"),
      description: requiredString().trim().min(1, "不能为空"),
      date: calendarDateSchema,
      updated: calendarDateSchema.optional(),
      image: z.string("必须是文章目录内图片的相对路径").optional(),
      tags: z
        .array(
          z.string().regex(slugPattern, "标签必须匹配 slug 格式，如 nuxt、css"),
          "必须是字符串数组",
        )
        .optional(),
    },
    {
      error: (issue) =>
        issue.code === "unrecognized_keys"
          ? `不支持的字段：${issue.keys.join("、")}`
          : undefined,
    },
  )
  // 两者都是 YYYY-MM-DD，按字符串比较即按日期先后比较。
  .refine(
    (frontmatter) =>
      !frontmatter.updated || frontmatter.updated >= frontmatter.date,
    {
      message: "updated 不能早于 date",
      path: ["updated"],
    },
  )

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>

// CommonMark 遇到没有定义的引用式图片时保留为普通文本，只能从文本中识别。
const undefinedImageReferencePattern = /!\[([^\]]*)\]\[([^\]]*)\]/g

// 用显式栈遍历，嵌套极深的正文也不会使校验本身栈溢出。
function inspectMarkdownBody(tree: Nodes) {
  const definitionUrls = new Map<string, string>()
  const imageUrls: string[] = []
  const referencedImageIdentifiers: string[] = []
  const undefinedImageReferences: string[] = []
  let hasTopLevelHeading = false
  const pendingNodes: Nodes[] = [tree]
  while (pendingNodes.length > 0) {
    const node = pendingNodes.pop()!
    if (node.type === "image") imageUrls.push(node.url)
    if (node.type === "imageReference") {
      referencedImageIdentifiers.push(node.identifier)
    }
    if (node.type === "definition") {
      definitionUrls.set(node.identifier, node.url)
    }
    if (node.type === "heading" && node.depth === 1) hasTopLevelHeading = true
    if (node.type === "text") {
      for (const match of node.value.matchAll(undefinedImageReferencePattern)) {
        undefinedImageReferences.push(match[2] || match[1]!)
      }
    }
    if ("children" in node) pendingNodes.push(...(node.children as Nodes[]))
  }
  // 只有存在对应定义时才会解析为 imageReference，地址取自该定义。
  for (const identifier of referencedImageIdentifiers) {
    imageUrls.push(definitionUrls.get(identifier)!)
  }
  return { imageUrls, undefinedImageReferences, hasTopLevelHeading }
}

function isRelativeImageUrl(url: string) {
  return !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(url)
}

async function getImageFileKind(path: string) {
  return lstat(path).then(
    (stats) =>
      stats.isSymbolicLink() ? "symlink" : stats.isFile() ? "file" : "other",
    () => "missing" as const,
  )
}

// 返回错误说明；绝对地址与站内地址不检查，返回 undefined。
async function checkImageReference(postDirectory: string, url: string) {
  if (!url.trim()) return "图片地址为空"
  if (!isRelativeImageUrl(url)) return undefined
  let decodedPath: string
  try {
    decodedPath = decodeURI(url.replace(/[?#].*$/, ""))
  } catch {
    return `图片路径无法解码：${url}`
  }
  const imagePath = resolve(postDirectory, decodedPath)
  if (!imagePath.startsWith(postDirectory + sep)) {
    return `图片路径越出文章目录：${url}`
  }
  const imageFileKind = await getImageFileKind(imagePath)
  // 符号链接已在扫描 content/ 时报错，这里不再重复。
  if (imageFileKind === "missing" || imageFileKind === "other") {
    return `图片不存在：${url}`
  }
  return undefined
}

async function checkShareCardImage(postDirectory: string, url: string) {
  if (!url.trim()) return "图片地址为空"
  if (!isRelativeImageUrl(url)) return "必须是文章目录内图片的相对路径"
  if (!shareCardImageExtensions.has(extname(url).toLowerCase())) {
    return "分享卡片图片只支持 PNG 与 JPEG"
  }
  const referenceError = await checkImageReference(postDirectory, url)
  if (referenceError) return referenceError
  // 按文件内容判断格式，避免扩展名与实际内容不符时到生成卡片时才失败。
  const imageData = await readFile(resolve(postDirectory, decodeURI(url)))
  let imageType: string | undefined
  try {
    imageType = imageSize(imageData).type
  } catch {
    imageType = undefined
  }
  if (imageType !== "png" && imageType !== "jpg") {
    return `不是有效的 PNG 或 JPEG 图片：${url}`
  }
  return undefined
}

async function validatePost(contentDirectory: string, slug: string) {
  const errors: string[] = []
  const postDirectory = join(contentDirectory, "posts", slug)
  const postFile = join(postDirectory, "index.md")
  const displayPath = relative(process.cwd(), postFile)
  const source = await readFile(postFile, "utf8")

  const frontmatterMatch = frontmatterPattern.exec(source)
  if (!frontmatterMatch) {
    return { errors: [`${displayPath}：缺少以 --- 包围的 frontmatter`] }
  }

  const document = parseDocument(frontmatterMatch[1]!)
  if (document.errors.length > 0) {
    for (const error of document.errors) {
      errors.push(`${displayPath}：frontmatter 无法解析：${error.message}`)
    }
    return { errors }
  }

  const result = postFrontmatterSchema.safeParse(document.toJSON() ?? {})
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "frontmatter"
      errors.push(`${displayPath}：${field}：${issue.message}`)
    }
  }

  const body = inspectMarkdownBody(
    fromMarkdown(source.slice(frontmatterMatch[0].length)),
  )
  if (body.hasTopLevelHeading) {
    errors.push(
      `${displayPath}：正文不要使用一级标题，文章标题由 frontmatter 的 title 提供`,
    )
  }
  for (const label of body.undefinedImageReferences) {
    errors.push(`${displayPath}：未定义的图片引用：${label}`)
  }
  for (const url of body.imageUrls) {
    const imageError = await checkImageReference(postDirectory, url)
    if (imageError) errors.push(`${displayPath}：${imageError}`)
  }

  const shareCardImage = result.data?.image
  if (shareCardImage !== undefined) {
    const imageError = await checkShareCardImage(postDirectory, shareCardImage)
    if (imageError) errors.push(`${displayPath}：image：${imageError}`)
  }

  return { errors, frontmatter: result.data }
}

async function listContentEntries(contentDirectory: string) {
  try {
    return await readdir(contentDirectory, {
      recursive: true,
      withFileTypes: true,
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return []
    throw error
  }
}

export async function validateContentPosts(contentDirectory: string) {
  const errors: string[] = []
  const slugs = new Set<string>()

  // readdir 会列出隐藏条目；Content 收集文章时同样会匹配隐藏目录，扫描必须与之一致。
  for (const entry of await listContentEntries(contentDirectory)) {
    const entryPath = join(entry.parentPath, entry.name)
    const segments = relative(contentDirectory, entryPath).split(sep)
    const displayPath = relative(process.cwd(), entryPath)

    if (segments.some((segment) => segment.startsWith("."))) {
      // content/posts/ 下的隐藏目录会被 Content 当作文章收录；其他隐藏条目不会发布，直接忽略。
      if (
        segments[0] === "posts" &&
        segments.length === 2 &&
        segments[1]!.startsWith(".") &&
        entry.isDirectory()
      ) {
        errors.push(`${displayPath}：content/posts/ 下不能有隐藏目录`)
      }
      continue
    }
    if (entry.isSymbolicLink()) {
      errors.push(`${displayPath}：content/ 中不能使用符号链接`)
      continue
    }
    if (!entry.isFile()) continue

    if (segments[0] === "posts" && segments.length >= 3) {
      const slug = segments[1]!
      if (slug === "index") {
        errors.push(`${displayPath}：文章目录不能命名为 index`)
        continue
      }
      if (!slugPattern.test(slug)) {
        errors.push(
          `${displayPath}：文章目录名 ${slug} 必须匹配 ${slugPattern}`,
        )
        continue
      }
      if (segments.length === 3 && segments[2] === "index.md") {
        slugs.add(slug)
        continue
      }
    }

    const extension = entry.name
      .slice(entry.name.lastIndexOf("."))
      .toLowerCase()
    if (contentFileExtensions.has(extension)) {
      errors.push(
        `${displayPath}：只允许 content/posts/<slug>/index.md 作为内容文件`,
      )
    }
  }

  const posts: { slug: string; frontmatter: PostFrontmatter }[] = []
  for (const slug of [...slugs].toSorted()) {
    const result = await validatePost(contentDirectory, slug)
    errors.push(...result.errors)
    if (result.frontmatter)
      posts.push({ slug, frontmatter: result.frontmatter })
  }

  return { errors, posts }
}

export default defineNuxtModule({
  meta: { name: "content-posts" },
  async setup(_options, nuxt) {
    const contentDirectory = join(nuxt.options.rootDir, "content")
    const { errors, posts } = await validateContentPosts(contentDirectory)
    if (errors.length > 0) {
      throw new Error(
        `文章内容校验失败（${errors.length} 项）：\n${errors.map((error) => `  - ${error}`).join("\n")}`,
      )
    }

    // 生产构建为每篇文章生成分享卡片；开发服务不生成，页面中的 og:image 地址在开发时无对应文件。
    if (!nuxt.options.dev) {
      nuxt.hook("nitro:build:public-assets", async (nitro) => {
        for (const post of posts) {
          const postDirectory = join(contentDirectory, "posts", post.slug)
          const card = await renderPostShareCard({
            title: post.frontmatter.title,
            date: post.frontmatter.date,
            byline: `${ownerName} · ${new URL(siteOrigin).host}`,
            imagePath: post.frontmatter.image
              ? resolve(postDirectory, decodeURI(post.frontmatter.image))
              : undefined,
          })
          const cardPath = join(
            nitro.options.output.publicDir,
            "og",
            "posts",
            `${post.slug}.png`,
          )
          await mkdir(dirname(cardPath), { recursive: true })
          await writeFile(cardPath, card)
        }
      })
    }

    const tags = new Set(posts.flatMap((post) => post.frontmatter.tags ?? []))
    // Nitro 的爬虫不跟随 .xml 链接，XML 路由必须显式列出。文章与标签页虽能经链接发现，
    // 也显式列出：Content 解析失败跳过某篇文章时，该路由会渲染 404 并由 failOnError 使构建失败。
    nuxt.options.nitro.prerender ??= {}
    nuxt.options.nitro.prerender.routes = [
      ...(nuxt.options.nitro.prerender.routes ?? []),
      "/posts",
      ...posts.map((post) => `/posts/${post.slug}`),
      ...[...tags].toSorted().map((tag) => `/tags/${tag}`),
      "/feed.xml",
      "/sitemap.xml",
    ]
  },
})
