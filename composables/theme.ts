const ThemeKey = "ayingott_theme"

export const useTheme = () => {
  const {
    public: { availableThemes },
  } = useRuntimeConfig()

  const theme = useCookie(ThemeKey, { default: () => "light" })

  const color = useColorMode({
    modes: availableThemes.reduce<Record<string, string>>((res, cur) => {
      res.cur = cur
      return res
    }, {}),
  })

  watch(theme, (newTheme) => {
    if (availableThemes.includes(newTheme)) {
      color.value = newTheme
    }
  })

  return theme
}
