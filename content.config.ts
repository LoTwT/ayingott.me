import { defineCollection, defineContentConfig, z } from "@nuxt/content"

// 只写声明：nuxt-content-assets 会用 shim 单独加载本文件，字段校验由 modules/content-posts.ts 负责。
export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: "page",
      source: { include: "posts/*/index.md", prefix: "/posts" },
      schema: z.object({
        date: z.string(),
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
      }),
    }),
  },
})
