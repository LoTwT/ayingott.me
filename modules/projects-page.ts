import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { defineNuxtModule } from "nuxt/kit"
import { ownerName, siteOrigin } from "../app/utils/profile"
import { projectsPage } from "../app/utils/projects-page"
import { renderShareCard } from "./share-cards/render-share-card"

export default defineNuxtModule({
  meta: { name: "projects-page" },
  setup(_options, nuxt) {
    nuxt.options.nitro.prerender ??= {}
    nuxt.options.nitro.prerender.routes = [
      ...(nuxt.options.nitro.prerender.routes ?? []),
      projectsPage.path,
    ]

    if (nuxt.options.dev) return
    nuxt.hook("nitro:build:public-assets", async (nitro) => {
      const imagePath = join(
        nitro.options.output.publicDir,
        projectsPage.shareImagePath,
      )
      await mkdir(dirname(imagePath), { recursive: true })
      await writeFile(
        imagePath,
        await renderShareCard({
          byline: `${ownerName} · ${new URL(siteOrigin).host}`,
          title: projectsPage.title,
          footnote: projectsPage.description,
          footnoteKind: "text",
        }),
      )
    })
  },
})
