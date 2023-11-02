import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Pages from "vite-plugin-pages"
import Markdown from "unplugin-vue-markdown/vite"
import VueComponents from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import UnoCSS from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Pages({
      dirs: "pages",
    }),
    Markdown({
      headEnabled: true,
    }),
    VueComponents({
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      extensions: ["vue", "md"],
      dirs: ["src/components", "content"],
      directoryAsNamespace: true,
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/head",
        "@vueuse/core",
      ],
      dirs: ["src/composables"],
      vueTemplate: true,
    }),
    UnoCSS(),
  ],
})
