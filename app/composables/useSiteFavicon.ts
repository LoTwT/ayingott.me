const lightFaviconHref = "/lo.svg"
const darkFaviconHref = "/lo-white.svg"

export function useSiteFavicon() {
  useHead({
    link: [
      {
        key: "site-favicon-light",
        rel: "icon",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
        href: lightFaviconHref,
      },
      {
        key: "site-favicon-dark",
        rel: "icon",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
        href: darkFaviconHref,
      },
    ],
  })
}
