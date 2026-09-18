import { copyFile, glob, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { addTemplate, defineNuxtModule } from "nuxt/kit"
import subsetFont from "subset-font"

export default defineNuxtModule({
  meta: { name: "theme-font-subsets" },
  setup(_options, nuxt) {
    // 开发时沿用完整字体，新增文案无需等待字库重新生成。
    if (nuxt.options.dev) return

    const fontDirectory = join(nuxt.options.buildDir, "theme-font-subsets")
    const themeCssPath = fileURLToPath(
      import.meta.resolve("@ayingott/theme/fonts.css"),
    )

    nuxt.hook("nitro:build:public-assets", async (nitro) => {
      const licenseDirectory = join(
        nitro.options.output.publicDir,
        "font-licenses",
      )
      await mkdir(licenseDirectory, { recursive: true })
      await copyFile(
        join(dirname(themeCssPath), "../THIRD_PARTY_NOTICES.md"),
        join(licenseDirectory, "THIRD_PARTY_NOTICES.txt"),
      )
    })

    const stylesheet = addTemplate({
      filename: "theme-font-subsets.css",
      write: true,
      async getContents() {
        await mkdir(fontDirectory, { recursive: true })
        const characters = new Set<string>()
        for await (const file of glob("**/*.{vue,ts,json}", {
          cwd: nuxt.options.srcDir,
        })) {
          const source = await readFile(join(nuxt.options.srcDir, file), "utf8")
          for (const character of source.match(
            /[\p{Script=Han}\u3000-\u303f\uff01-\uff60\uffe0-\uffe6]/gu,
          ) ?? []) {
            characters.add(character)
          }
        }
        const text = [...characters].toSorted().join("")
        if (!text) return ""

        const unicodeRange = [...text]
          .map((character) => `U+${character.codePointAt(0)!.toString(16)}`)
          .join(",")
        const faces: string[] = []
        for (const weight of [400, 500]) {
          const filename = `lxgw-wenkai-${weight}-site.woff2`
          const original = await readFile(
            join(
              dirname(themeCssPath),
              `fonts/lxgw-wenkai-${weight}-normal.woff2`,
            ),
          )
          const subset = await subsetFont(original, text, {
            targetFormat: "woff2",
            preserveNameIds: [0, 13, 14],
          })
          await writeFile(join(fontDirectory, filename), subset)
          faces.push(`@font-face {
  font-family: "LXGW WenKai";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url("${join(fontDirectory, filename)}") format("woff2");
  unicode-range: ${unicodeRange};
}`)
        }
        return faces.join("\n")
      },
    })

    // 同名字体中，后声明的小字库覆盖已收录字符，其余字符继续使用主题原字库。
    nuxt.options.css.push(stylesheet.dst)
  },
})
