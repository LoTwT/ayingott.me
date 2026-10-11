import { copyFile, glob, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { addTemplate, defineNuxtModule, useLogger } from "nuxt/kit"
import subsetFont from "subset-font"

const chineseCharacterPattern =
  /[\p{Script=Han}\u3000-\u303f\uff01-\uff60\uffe0-\uffe6]/gu
// 内容子集任一字重超过该体积时，需改为按页面生成子集，见 docs/specs/articles.md 的字体预算。
const contentSubsetBudgetBytes = 400 * 1024

async function collectChineseCharacters(directory: string, pattern: string) {
  const characters = new Set<string>()
  for await (const file of glob(pattern, { cwd: directory })) {
    const source = await readFile(join(directory, file), "utf8")
    for (const character of source.match(chineseCharacterPattern) ?? []) {
      characters.add(character)
    }
  }
  return characters
}

export default defineNuxtModule({
  meta: { name: "theme-font-subsets" },
  setup(_options, nuxt) {
    const logger = useLogger("theme-font-subsets")
    const fontDirectory = join(nuxt.options.buildDir, "theme-font-subsets")
    const themeCssPath = fileURLToPath(
      import.meta.resolve("@ayingott/theme/fonts.css"),
    )
    const collectSiteCharacters = () =>
      collectChineseCharacters(nuxt.options.srcDir, "**/*.{vue,ts,json}")

    async function createSubsetFaces(
      characters: Iterable<string>,
      subsetName: "site" | "content",
    ) {
      const text = [...characters].toSorted().join("")
      if (!text) return ""

      await mkdir(fontDirectory, { recursive: true })
      const unicodeRange = [...text]
        .map((character) => `U+${character.codePointAt(0)!.toString(16)}`)
        .join(",")
      const faces: string[] = []
      for (const weight of [400, 500]) {
        const filename = `lxgw-wenkai-${weight}-${subsetName}.woff2`
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
        const sizeDescription = `LXGW WenKai ${weight} ${subsetName} subset: ${[...text].length} characters, ${(subset.byteLength / 1024).toFixed(1)}KB`
        if (
          subsetName === "content" &&
          subset.byteLength > contentSubsetBudgetBytes
        ) {
          logger.warn(
            `${sizeDescription} exceeds the 400KB budget; switch to per-page subsets`,
          )
        } else {
          logger.info(sizeDescription)
        }
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
    }

    // 文章、列表与标签页导入此样式；开发时为空，页面沿用完整字体。
    addTemplate({
      filename: "theme-font-content-subsets.css",
      write: true,
      async getContents() {
        if (nuxt.options.dev) return ""
        const siteCharacters = await collectSiteCharacters()
        const contentCharacters = await collectChineseCharacters(
          join(nuxt.options.rootDir, "content", "posts"),
          "*/index.md",
        )
        // 只收录站点子集没有的字，两组子集的 unicode-range 互不重叠。
        return createSubsetFaces(
          [...contentCharacters].filter(
            (character) => !siteCharacters.has(character),
          ),
          "content",
        )
      },
    })

    // 开发时沿用完整字体，新增文案无需等待字库重新生成。
    if (nuxt.options.dev) return

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
        return createSubsetFaces(await collectSiteCharacters(), "site")
      },
    })

    // 同名字体中，后声明的小字库覆盖已收录字符，其余字符继续使用主题原字库。
    nuxt.options.css.push(stylesheet.dst)
  },
})
