type SiteIconName = "github" | "x" | "mail" | "resume" | "rss"

export interface ContactLink {
  key: string
  label: string
  href: string
  icon: SiteIconName
  external?: boolean
}

export interface BlogPostSummary {
  slug: string
  title: string
  date: string
  readingTime: string
  excerpt: string
}

export interface FeaturedWork {
  key: string
  title: string
  href: string
  status: "active" | "published"
  description: string
  tags: string[]
  external?: boolean
}

const emailUser = "hi"
const emailHost = "ayingott.me"

function decodeEmail() {
  return `${emailUser}@${emailHost}`
}

export function useSiteContent() {
  const runtimeConfig = useRuntimeConfig()

  const identity = {
    displayName: "Lo",
    homeTagline: "A developer",
    aboutSubtitle: "Lo · Developer",
    aboutParagraphs: [
      "这是 Lo 的个人站。一处安静的自留地，用来放文章、项目和一些慢慢成形的记录。",
      "我喜欢把工具做得克制、可读、可维护。比起热闹的展示页，这里更接近一本持续更新的小册子。",
      "更具体的经历和项目会继续被替换和补全；现在这个版本先把阅读、作品入口和写作管线整理清楚。",
    ],
    interests: ["阅读", "语言", "ZZZ", "小工具"],
  }

  const nowText = computed(() =>
    String(runtimeConfig.public.nowText || "").trim(),
  )
  const resumePdfUrl = computed(() =>
    String(runtimeConfig.public.resumePdfUrl || "").trim(),
  )

  const navItems = [
    { label: "首页", to: "/" },
    { label: "关于", to: "/about" },
    { label: "作品", to: "/works" },
    { label: "文章", to: "/blog" },
  ]

  const posts = [] as BlogPostSummary[]
  const featuredWorks: FeaturedWork[] = [
    {
      key: "miru",
      title: "miru",
      href: "https://miru.ayingott.me",
      status: "active",
      description: "A quiet, reading-first reader.",
      tags: ["Reading"],
      external: true,
    },
    {
      key: "ayingott-theme",
      title: "Design system",
      href: "https://design.ayingott.me",
      status: "published",
      description: "The design system this very site runs on.",
      tags: ["Design · Tokens"],
      external: true,
    },
  ]

  const contactLinks = computed<ContactLink[]>(() => {
    const email = decodeEmail()
    const links: ContactLink[] = [
      {
        key: "github",
        label: "GitHub",
        href: "https://github.com/lotwt",
        icon: "github",
        external: true,
      },
      {
        key: "x",
        label: "X",
        href: "https://x.com/ayingott_lo",
        icon: "x",
        external: true,
      },
      {
        key: "email",
        label: "邮箱",
        href: `mailto:${email}`,
        icon: "mail",
      },
    ]

    if (resumePdfUrl.value) {
      links.push({
        key: "resume",
        label: "简历 PDF",
        href: resumePdfUrl.value,
        icon: "resume",
        external: true,
      })
    }

    if (posts.length > 0) {
      links.push({
        key: "rss",
        label: "RSS 订阅",
        href: "/feed.xml",
        icon: "rss",
      })
    }

    return links
  })

  return {
    identity,
    navItems,
    nowText,
    contactLinks,
    featuredWorks,
    posts,
  }
}
