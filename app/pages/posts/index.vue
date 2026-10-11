<script setup lang="ts">
import "#build/theme-font-content-subsets.css"
import { Rss } from "@lucide/vue"
import { queryCollection, useAsyncData, useHead, useSeoMeta } from "#imports"
import PostList from "~/components/posts/PostList.vue"
import { ownerName, siteOrigin } from "~/utils/profile"

const { data: posts } = await useAsyncData("posts", () =>
  queryCollection("posts")
    .select("path", "title", "date", "tags")
    .order("date", "DESC")
    .all(),
)

const pageTitle = `文章 · ${ownerName}`
const pageDescription = `${ownerName} 写的文章。`
const canonicalUrl = `${siteOrigin}/posts`

useHead({ link: [{ rel: "canonical", href: canonicalUrl }] })
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogType: "website",
  ogSiteName: ownerName,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: canonicalUrl,
  ogLocale: "zh_CN",
})
</script>

<template>
  <main
    id="main-content"
    tabindex="-1"
    class="pt-8 pb-16 focus:outline-none sm:pt-12"
  >
    <div class="flex items-center justify-between gap-6">
      <h1
        class="theme-color-transition font-display text-3xl leading-tight font-medium sm:text-4xl"
      >
        文章
      </h1>
      <a
        href="/feed.xml"
        aria-label="RSS 订阅"
        title="RSS 订阅"
        class="-mr-3 grid size-11 shrink-0 place-items-center rounded-(--radius-control) text-(--text-muted) focus-ring hover:text-(--text-secondary)"
      >
        <Rss :size="20" :stroke-width="2" aria-hidden="true" />
      </a>
    </div>
    <PostList v-if="posts?.length" :posts="posts" class="mt-12" />
    <p v-else class="theme-color-transition mt-12 text-(--text-muted)">
      还没有文章
    </p>
  </main>
</template>
