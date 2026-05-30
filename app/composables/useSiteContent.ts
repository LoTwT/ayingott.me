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
      year: "2026",
      status: "active",
      description: "一个安静的 Markdown 阅读器，把排版和阅读状态放在第一位。",
      tags: ["reading", "pwa"],
      external: true,
    },
    {
      key: "yomu",
      title: "yomu",
      href: "https://yomu.ayingott.me",
      year: "2026",
      status: "active",
      description: "每日发声阅读练习，用文章、领读和对照翻译建立语言节奏。",
      tags: ["read aloud", "language"],
      external: true,
    },
    {
      key: "ayingott-theme",
      title: "@ayingott/theme",
      href: "https://design.ayingott.me",
      year: "2026",
      status: "published",
      description:
        "一套偏阅读体验的设计系统，把颜色、排版和交互 token 收束成可复用的基础。",
      tags: ["design system", "tokens"],
      external: true,
    },
    {
      key: "fairy",
      title: "fairy",
      href: "https://github.com/LoTwT/fairy",
      year: "2025",
      status: "published",
      description:
        "ZZZ 伤害计算器与 AI plugin 实验，把角色面板、计算和验证流程整理成工具。",
      tags: ["zzz", "calculator"],
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
