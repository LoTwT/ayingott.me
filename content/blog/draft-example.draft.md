---
title: "草稿示例"
date: "2026-05-25"
description: "用于验证 draft:true 不进入公开列表和 feed。"
tags:
  - draft
draft: true
slug: "draft-example"
---

这篇文章只用于验证草稿流。它不应该出现在 `/blog`、`/feed.xml` 或 `/sitemap.xml`。本地需要预览草稿时，用 `NUXT_INCLUDE_DRAFTS=1 pnpm dev` 启动后访问 `/blog/draft-example`。
