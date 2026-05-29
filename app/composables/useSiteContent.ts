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
  year: string
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
    aboutParagraphs: ["A person."],
    interests: [] as string[],
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
    { label: "文章", to: "/blog" },
  ]

  const posts = [] as BlogPostSummary[]
  const featuredWorks: FeaturedWork[] = [
    {
      key: "miru",
      title: "miru",
      href: "https://miru.ayingott.me",
      year: "2026",
      description: "一个安静的 Markdown 阅读器,把排版和阅读状态放在第一位。",
      tags: ["reading", "pwa"],
      external: true,
    },
    {
      key: "yomu",
      title: "yomu",
      href: "https://yomu.ayingott.me",
      year: "2026",
      description: "每日发声阅读练习,用文章、领读和对照翻译建立语言节奏。",
      tags: ["read aloud", "language"],
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
