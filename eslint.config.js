// @ts-check

import { defineFlatConfig } from "@ayingott/eslint-config"

export default defineFlatConfig(
  [
    {
      rules: {
        "no-undef": "off",
      },
    },
  ],
  {
    vue: true,
    prettier: true,
    unocss: true,
    react: false,
  },
)
