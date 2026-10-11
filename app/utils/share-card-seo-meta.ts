// Open Graph and Twitter fields for a 1200 × 630 share card generated at build time.
export function shareCardSeoMeta(imageUrl: string, imageAlt: string) {
  return {
    ogImage: imageUrl,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: "image/png",
    ogImageAlt: imageAlt,
    twitterCard: "summary_large_image",
    twitterImage: imageUrl,
    twitterImageAlt: imageAlt,
  } as const
}
