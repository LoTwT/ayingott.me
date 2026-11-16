const contentLinkColors = [
  "var(--content-link-coral)",
  "var(--content-link-berry)",
  "var(--content-link-violet)",
] as const

// FNV-1a over the content key keeps the slot independent of list order and runtime.
export function contentLinkColor(key: string): string {
  let hash = 2166136261
  for (let index = 0; index < key.length; index++) {
    hash = Math.imul(hash ^ key.charCodeAt(index), 16777619) >>> 0
  }
  return contentLinkColors[hash % contentLinkColors.length]!
}
