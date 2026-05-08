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
    posts,
  }
}
