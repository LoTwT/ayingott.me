<script setup lang="ts">
const route = useRoute()
const { posts } = useSiteContent()

const slug = String(route.params.slug ?? "")
const selectedPost = posts.find((item) => item.slug === slug)

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
  description: post.excerpt,
  path: `/blog/${post.slug}`,
})
</script>

<template>
  <article class="blog-detail">
    <NuxtLink class="blog-detail__back" to="/blog">← 文章</NuxtLink>

    <header class="blog-detail__header">
      <p class="blog-detail__meta">{{ post.date }} · {{ post.readingTime }}</p>
      <h1 class="blog-detail__title">{{ post.title }}</h1>
    </header>

    <div class="blog-detail__prose">
      <p>{{ post.excerpt }}</p>
    </div>
  </article>
</template>

<style scoped>
.blog-detail {
  width: min(100%, var(--container-reading));
  margin-inline: auto;
  display: grid;
  gap: var(--spacing-10);
}

.blog-detail__back {
  width: fit-content;
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-control);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  text-decoration: none;
  transition: var(--transition-interactive);
}

.blog-detail__back:hover {
  color: var(--text-accent);
}

.blog-detail__header {
  display: grid;
  gap: var(--spacing-4);
}

.blog-detail__meta {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.blog-detail__title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--text-4xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-normal);
}

.blog-detail__prose {
  color: var(--text-primary);
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
}

.blog-detail__prose p {
  margin: 0;
}

@media (max-width: 640px) {
  .blog-detail__title {
    font-size: var(--text-3xl);
    line-height: var(--text-3xl--line-height);
  }
}
</style>
