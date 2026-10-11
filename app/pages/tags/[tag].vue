<script setup lang="ts">
import "#build/theme-font-content-subsets.css"
import {
  createError,
  queryCollection,
  useAsyncData,
  useHead,
  useRoute,
  useSeoMeta,
} from "#imports"
import PostList from "~/components/posts/PostList.vue"
import { ownerName, siteOrigin } from "~/utils/profile"

const tag = String(useRoute().params.tag)

// Only the filtered posts end up in the prerendered page data.
const { data: posts } = await useAsyncData(`tag:${tag}`, async () => {
  const allPosts = await queryCollection("posts")
    .select("path", "title", "date", "tags")
    .order("date", "DESC")
    .all()
  return allPosts.filter((post) => post.tags?.includes(tag))
})

if (!posts.value?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: "Tag not found",
    fatal: true,
  })
}

const pageTitle = `#${tag} · ${ownerName}`
const pageDescription = `${ownerName} 写的带有 #${tag} 标签的文章。`
const canonicalUrl = `${siteOrigin}/tags/${tag}`

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
    <h1
      class="theme-color-transition font-display text-3xl leading-tight font-medium sm:text-4xl"
    >
      #{{ tag }}
    </h1>
    <PostList :posts="posts ?? []" class="mt-12" />
  </main>
</template>
