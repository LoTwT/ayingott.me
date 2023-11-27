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

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      // scale: 1.2,
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
      themes: ["light", "dracula"],
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
