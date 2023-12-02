import { resolve } from "node:path"
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
import { presetDaisy } from "unocss-preset-daisy"

export const AvailableThemes = ["light", "dark"]

export default defineConfig({
  content: {
    filesystem: [resolve(__dirname, "content/**/*.md")],
  },
  safelist: ["i-icon-park-outline-chinese", "i-icon-park-outline-english"],
  shortcuts: [],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      // fonts: {
      //   sans: "DM Sans",
      //   serif: "DM Serif Display",
      //   mono: "DM Mono",
      // },
    }),
    presetDaisy({
      styled: false,
      themes: ["light", "dark"],
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
