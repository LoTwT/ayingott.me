interface SiteSeoInput {
  title: string
  ogTitle: string
  description: string
  path: string
}

export function useSiteSeo(input: SiteSeoInput) {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = String(runtimeConfig.public.siteUrl)
  const canonicalUrl = computed(() => new URL(input.path, siteUrl).toString())
  const ogImageUrl = computed(() => new URL("/lo.svg", siteUrl).toString())

  useHead({
    title: input.title,
    meta: [
      {
        name: "author",
        content: "Lo",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: () => canonicalUrl.value,
      },
    ],
  })

  useSeoMeta({
    title: input.title,
    ogTitle: input.ogTitle,
    description: input.description,
    ogDescription: input.description,
    ogImage: () => ogImageUrl.value,
    ogUrl: () => canonicalUrl.value,
  })
}
