// @ts-check

import { defineConfig } from "@ayingott/eslint-config"

export default defineConfig({
  typescript: true,
  vue: true,
}).append({
  name: "ayingott/theme-scoped-css",
  rules: {
    "better-tailwindcss/no-unknown-classes": "off",
  },
})
