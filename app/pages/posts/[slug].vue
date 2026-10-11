<script setup lang="ts">
import "#build/theme-font-content-subsets.css"
import "~/assets/article-content.css"
import spaceMonoFontUrl from "@ayingott/theme/fonts/space-mono-latin-400-normal.woff2?url"
import { defineAsyncComponent, useTemplateRef } from "vue"
import {
  createError,
  queryCollection,
  useAsyncData,
  useHead,
  useRoute,
  useSeoMeta,
} from "#imports"
import PostBackToTop from "~/components/posts/PostBackToTop.vue"
import PostTagLinks from "~/components/posts/PostTagLinks.vue"
import SiteBackLink from "~/components/site/SiteBackLink.vue"
import { ownerName, siteOrigin } from "~/utils/profile"
import { shareCardSeoMeta } from "~/utils/share-card-seo-meta"

const PostKatexStylesheet = defineAsyncComponent(
  () => import("~/components/posts/PostKatexStylesheet.vue"),
)

const slug = String(useRoute().params.slug)
const postTitle = useTemplateRef<HTMLHeadingElement>("postTitle")

const { data: post } = await useAsyncData(`post:${slug}`, () =>
  queryCollection("posts").path(`/posts/${slug}`).first(),
)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  })
}

const article = post.value
const articleTags = article.tags ?? []
// rehype-katex emits nodes with the katex class; only articles with math load KaTeX styles.
const containsMath = JSON.stringify(article.body).includes('"katex"')
const pageTitle = `${article.title} · ${ownerName}`
const canonicalUrl = `${siteOrigin}${article.path}`
const homeUrl = `${siteOrigin}/`
// Generated at build time by modules/content-posts.ts.
const socialImageUrl = `${siteOrigin}/og/posts/${slug}.png`
const socialImageAlt = pageTitle

const blogPostingStructuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: article.title,
  description: article.description,
  datePublished: article.date,
  dateModified: article.updated ?? article.date,
  inLanguage: "zh-CN",
  url: canonicalUrl,
  mainEntityOfPage: canonicalUrl,
  image: socialImageUrl,
  keywords: articleTags,
  author: { "@type": "Person", name: ownerName, url: homeUrl },
}

useHead({
  link: [
    { rel: "canonical", href: canonicalUrl },
    // Inline code gets slightly wider once Space Mono loads, which can rewrap a paragraph;
    // preloading avoids that layout shift. Only the prerendered HTML carries the link,
    // because inserting it again on the client fetches the font twice.
    ...(import.meta.server
      ? [
          {
            rel: "preload",
            as: "font",
            type: "font/woff2",
            href: spaceMonoFontUrl,
            crossorigin: "anonymous",
          } as const,
        ]
      : []),
  ],
  script: [
    {
      key: "blog-posting-structured-data",
      type: "application/ld+json",
      innerHTML: JSON.stringify(blogPostingStructuredData),
    },
  ],
})

useSeoMeta({
  title: pageTitle,
  description: article.description,
  ogType: "article",
  ogSiteName: ownerName,
  ogTitle: article.title,
  ogDescription: article.description,
  ogUrl: canonicalUrl,
  ogLocale: "zh_CN",
  articlePublishedTime: article.date,
  articleModifiedTime: article.updated ?? article.date,
  articleAuthor: [homeUrl],
  articleTag: articleTags,
  twitterTitle: article.title,
  twitterDescription: article.description,
  ...shareCardSeoMeta(socialImageUrl, socialImageAlt),
})
</script>

<template>
  <main
    id="main-content"
    tabindex="-1"
    class="flex flex-1 flex-col pt-8 focus:outline-none sm:pt-12"
  >
    <article>
      <header>
        <p class="theme-color-transition font-mono text-sm text-(--text-muted)">
          <time :datetime="article.date">{{ article.date }}</time>
          <template v-if="article.updated">
            · 更新于
            <time :datetime="article.updated">{{ article.updated }}</time>
          </template>
        </p>
        <h1
          ref="postTitle"
          class="theme-color-transition mt-2 font-display text-3xl leading-tight font-medium sm:text-4xl"
        >
          {{ article.title }}
        </h1>
        <PostTagLinks :tags="articleTags" size="regular" class="mt-3" />
      </header>
      <ContentRenderer
        :value="article"
        class="article-content theme-color-transition-blocks mt-10"
      />
    </article>
    <!-- Kept next to the footer: pushed to the bottom on short posts, at least 4rem below the body. -->
    <div class="mt-auto pt-16">
      <SiteBackLink to="/posts">全部文章</SiteBackLink>
    </div>
    <PostKatexStylesheet v-if="containsMath" />
    <PostBackToTop :observed-title="postTitle" />
  </main>
</template>
