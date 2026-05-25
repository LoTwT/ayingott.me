<script setup lang="ts">
import BlogPostArticle from "~/components/blog/BlogPostArticle.vue"
import { getBlogPostHref } from "~/utils/blog"

const route = useRoute()

const slug = String(route.params.slug ?? "")

async function queryPublishedPosts() {
  const query = queryCollection("blog")

  if (import.meta.dev) {
    return query.all()
  }

  return query.where("draft", "<>", true).all()
}

const { data: posts } = await useAsyncData(
  `blog-post-${slug}`,
  queryPublishedPosts,
)

const selectedPost =
  posts.value?.find((item) => getBlogPostHref(item) === `/blog/${slug}`) ?? null

if (!selectedPost) {
  throw createError({
    statusCode: 404,
    statusMessage: "文章未找到",
  })
}

const post = selectedPost

useSiteSeo({
  title: `${post.title} · ayingott.me`,
  ogTitle: post.title,
  description: post.description,
  path: getBlogPostHref(post),
})

useHead({
  link: [
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: "ayingott.me 文章",
      href: "/feed.xml",
    },
  ],
})
</script>

<template>
  <BlogPostArticle :post="post" />
</template>
