export const useLStorage = () =>
  useStorage(
    "ayingott",
    {
      locale: useI18n().locale.value,
    },
    localStorage,
    {
      mergeDefaults: true,
    },
  )
