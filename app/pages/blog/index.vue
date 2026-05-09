<script setup lang="ts">
import DecorativePrimitive from "~/components/site/DecorativePrimitive.vue"
import PageTitle from "~/components/site/PageTitle.vue"

const { posts } = useSiteContent()

useSiteSeo({
  title: "文章 · ayingott.me",
  ogTitle: "文章",
  description: "Lo 的笔记。",
  path: "/blog",
})
</script>

<template>
  <section class="blog-page" aria-labelledby="blog-title">
    <PageTitle
      heading-id="blog-title"
      title="文章"
      subtitle="笔记 · 归档"
      decoration="square"
    />

    <div v-if="posts.length" class="blog-page__list" aria-label="文章">
      <article v-for="post in posts" :key="post.slug" class="blog-card">
        <NuxtLink class="blog-card__link" :to="`/blog/${post.slug}`">
          <span class="blog-card__meta">
            {{ post.date }} · {{ post.readingTime }}
          </span>
          <h2 class="blog-card__title">{{ post.title }}</h2>
          <p class="blog-card__excerpt">{{ post.excerpt }}</p>
        </NuxtLink>
      </article>
    </div>

    <div v-else class="blog-empty" role="status">
      <DecorativePrimitive class="blog-empty__decoration" kind="square" />
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
}

.blog-page__list {
  max-width: var(--container-reading);
  display: grid;
  gap: var(--spacing-4);
}

.blog-card {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  background: var(--surface-elevated);
  box-shadow: var(--shadow-card);
  transition: var(--transition-interactive);
}

.blog-card__link {
  display: block;
  padding: var(--spacing-6);
  color: inherit;
  text-decoration: none;
}

.blog-card__meta {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}

.blog-card__title {
  margin: var(--spacing-3) 0 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-normal);
}

.blog-card__excerpt {
  margin: var(--spacing-3) 0 0;
  color: var(--text-muted);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

.blog-card__link:hover .blog-card__title {
  color: var(--text-accent);
}

.blog-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.blog-empty {
  position: relative;
  max-width: var(--container-reading);
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-card);
  padding: var(--spacing-10);
  background: var(--surface-elevated);
  box-shadow: var(--shadow-card);
}

.blog-empty__decoration {
  position: absolute;
  top: var(--spacing-8);
  right: var(--spacing-8);
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
