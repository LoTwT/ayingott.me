import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss"

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno({
      dark: {
        dark: ".dark-mode",
      },
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: {
          name: "Noto Sans SC",
          weights: [400, 700],
        },
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
