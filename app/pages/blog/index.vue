<script setup lang="ts">
import { computed } from "vue"
import BlogPostCard from "~/components/blog/BlogPostCard.vue"
import PageTitle from "~/components/site/PageTitle.vue"

async function queryPublishedPosts() {
  return queryCollection("blog")
    .where("draft", "<>", true)
    .order("date", "DESC")
    .all()
}

const { data } = await useAsyncData("blog-posts", queryPublishedPosts)

const posts = computed(() => data.value ?? [])

useSiteSeo({
  title: "文章 · ayingott.me",
  ogTitle: "文章",
  description: "Lo 的笔记。",
  path: "/blog",
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
  <section class="blog-page" aria-labelledby="blog-title">
    <PageTitle heading-id="blog-title" title="文章" subtitle="笔记 · 归档" />
    <a v-if="posts.length" class="blog-page__feed" href="/feed.xml">
      RSS 订阅
    </a>

    <div v-if="posts.length" class="blog-page__list" aria-label="文章">
      <BlogPostCard v-for="post in posts" :key="post.path" :post="post" />
    </div>

    <div v-else class="blog-empty" role="status">
      <h2 class="blog-empty__title">还没有文章。</h2>
      <p class="blog-empty__copy">
        第一篇文章准备好后会出现在这里。订阅暂未开放，V1 阶段偶尔来看就行。
      </p>
    </div>
  </section>
</template>

<style scoped>
.blog-page {
  width: min(100%, var(--container-wide));
  margin-inline: auto;
  display: grid;
  gap: var(--spacing-12);
  justify-items: center;
  text-align: center;
}

.blog-page__list {
  max-width: var(--container-reading);
  width: 100%;
  display: grid;
  gap: var(--spacing-4);
}

.blog-page__feed {
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

.blog-page__feed:hover {
  color: var(--text-accent);
}

.blog-page__feed:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: var(--focus-ring-shadow);
}

.blog-empty {
  position: relative;
  width: min(100%, var(--container-reading));
  max-width: var(--container-reading);
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-card);
  padding: var(--spacing-10);
  background: var(--surface-elevated);
  box-shadow: var(--shadow-card);
}

.blog-empty__title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-normal);
}

.blog-empty__copy {
  max-width: 28rem;
  margin: var(--spacing-4) 0 0;
  color: var(--text-muted);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

@media (max-width: 640px) {
  .blog-empty {
    min-height: 220px;
    padding: var(--spacing-8);
  }
}
</style>
