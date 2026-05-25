---
title: "第一篇占位文章"
date: "2026-05-25"
description: "用于验证 ayingott.me 博客管线的占位文章。"
tags:
  - site
  - blog
draft: false
---

这是一篇用于验证博客管线的占位文章。它会出现在文章列表、详情页、RSS 和 sitemap 里，等真正的第一篇文章写好后可以替换或删除。

## 为什么先放占位

Phase A 的目标不是把内容一次性写完，而是确认写作路径已经可用：

- Markdown 能被 `@nuxt/content` 读取。
- 文章列表能按日期倒序显示。
- 详情页能渲染正文、链接、引用和代码块。
- `draft: true` 的文章不会进入公开列表、RSS 或 sitemap。

> 一个长期自留地先要有可持续的写作入口，再慢慢长出内容。

## 一小段代码

```ts
export const site = "ayingott.me"
```

如果你能看到这篇文章，说明 Phase A 的基础内容管线已经跑通。
