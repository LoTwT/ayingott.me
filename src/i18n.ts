import { createI18n } from "vue-i18n"

export const LOCALES_MAP: Record<string, string> = {
  zh: "简体中文",
  en: "English",
}

export const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  availableLocales: Object.keys(LOCALES_MAP),
  messages: {
    zh: {},
    en: {},
  },
})
