import { defineI18nConfig } from "#imports"

export default defineI18nConfig(async () => {
  const globs = import.meta.glob("./locales/*.json")

  const messages = (
    await Promise.all(
      Object.entries(globs).map(async ([p, i]) => ({
        [p.replace(/\.\/locales\/(.*)\.json$/, "$1")]: ((await i()) as any)
          .default,
      })),
    )
  ).reduce((res, cur) => ({ ...res, ...cur }), {})

  return {
    legacy: false,
    locale: "zh",
    fallbackLocale: "zh",
    availableLocales: ["zh", "en"],
    messages,
  }
})
