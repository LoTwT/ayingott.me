import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Pages from "vite-plugin-pages"
import Markdown from "unplugin-vue-markdown/vite"
import VueComponents from "unplugin-vue-components/vite"

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
      extensions: ["vue", "md"],
      dirs: ["src/components", "content"],
    }),
  ],
})
