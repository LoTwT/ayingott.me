# Blog Post Template

Use this template when adding a new article under `content/blog/`.

```md
---
title: "文章标题"
date: "2026-05-25"
description: "一句话摘要，会用于列表、SEO 和 RSS。"
tags:
  - tag
draft: true
slug: "article-slug"
---

正文从这里开始。详情页已经有 `<h1>`，正文里从 `##` 开始写小节。
```

## Frontmatter

| Field         | Required | Notes                                                              |
| ------------- | -------- | ------------------------------------------------------------------ |
| `title`       | yes      | Article title.                                                     |
| `date`        | yes      | Quote the value and use `YYYY-MM-DD`.                              |
| `description` | yes      | One-sentence summary for list cards, SEO, and RSS.                 |
| `tags`        | no       | String array, shown as lavender chips.                             |
| `draft`       | no       | Defaults to `false`; set `true` before publishing.                 |
| `updated`     | no       | Quote the value and use `YYYY-MM-DD`; shown in the article footer. |
| `slug`        | no       | Overrides the URL segment when needed.                             |
| `cover`       | no       | Reserved for future cover images.                                  |

## Publishing Flow

1. Create the article as `content/blog/<slug>.md`.
2. While drafting, use `content/blog/<slug>.draft.md` plus `draft: true`. Production builds exclude `*.draft.md` files before Nuxt Content creates the public content dump.
3. Preview drafts locally with `NUXT_INCLUDE_DRAFTS=1 pnpm dev`, then visit `/blog/<slug>`.
4. When publishing, rename the file to `content/blog/<slug>.md` and flip `draft: false`.
5. Run `pnpm generate` before merge; public articles should appear in `/blog`, `/feed.xml`, and `/sitemap.xml`.
