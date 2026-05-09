const faviconId = "site-favicon"
const lightFaviconHref = "/lo.svg?v=light"
const darkFaviconHref = "/lo-white.svg?v=dark"

function createFaviconLink(href: string) {
  const link = document.createElement("link")
  link.id = faviconId
  link.rel = "icon"
  link.type = "image/svg+xml"
  link.href = href
  return link
}

function findFaviconLink() {
  return (
    document.querySelector<HTMLLinkElement>(`#${faviconId}`) ??
    document.querySelector<HTMLLinkElement>(
      'link[rel="icon"][type="image/svg+xml"]',
    )
  )
}

export function useSiteFavicon() {
  const { isDark } = useAppliedColorMode()
  const faviconHref = computed(() =>
    isDark.value ? darkFaviconHref : lightFaviconHref,
  )

  useHead({
    link: [
      {
        key: faviconId,
        id: faviconId,
        rel: "icon",
        type: "image/svg+xml",
        href: () => faviconHref.value,
      },
    ],
  })

  function syncFaviconLink() {
    if (!import.meta.client) {
      return
    }

    const href = faviconHref.value
    const absoluteHref = new URL(href, window.location.href).href
    const current = findFaviconLink()

    if (!current) {
      document.head.append(createFaviconLink(href))
      return
    }

    if (current.href === absoluteHref && current.id === faviconId) {
      return
    }

    const next = createFaviconLink(href)
    current.replaceWith(next)
  }

  if (import.meta.client) {
    watch(faviconHref, syncFaviconLink, {
      flush: "post",
      immediate: true,
    })

    onMounted(syncFaviconLink)
  }
}
