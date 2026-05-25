import process from "node:process"
import { defineCollection, defineContentConfig, z } from "@nuxt/content"

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
const includeDrafts = process.env.NUXT_INCLUDE_DRAFTS === "1"

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: {
        include: "blog/**/*.md",
        exclude: includeDrafts ? [] : ["blog/**/*.draft.md"],
      },
      schema: z.object({
        title: z.string(),
        date: isoDateSchema,
        description: z.string(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        updated: isoDateSchema.optional(),
        slug: z.string().optional(),
        cover: z.string().optional(),
      }),
    }),
  },
})
