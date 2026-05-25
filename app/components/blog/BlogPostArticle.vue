<script setup lang="ts">
import type { BlogPostLike } from "~/utils/blog"
import { computed } from "vue"
import BlogTags from "~/components/blog/BlogTags.vue"
import { estimateReadingTime, formatBlogDate } from "~/utils/blog"

const props = defineProps<{
  post: BlogPostLike
}>()

const displayDate = computed(() => formatBlogDate(props.post.date))
const updatedDate = computed(() =>
  props.post.updated ? formatBlogDate(props.post.updated) : "",
)
const readingTime = computed(() => estimateReadingTime(props.post.body))
const tags = computed(() => props.post.tags ?? [])
</script>

<template>
  <article class="blog-article">
    <NuxtLink class="blog-article__back" to="/blog">← 文章</NuxtLink>

    <header class="blog-article__header">
      <div class="blog-article__meta-row">
        <p class="blog-article__meta">{{ displayDate }} · {{ readingTime }}</p>
        <BlogTags v-if="tags.length" :tags="tags" />
      </div>
      <h1 class="blog-article__title">{{ post.title }}</h1>
      <p class="blog-article__description">{{ post.description }}</p>
    </header>

    <ContentRenderer :value="post" class="blog-article__prose" />

    <footer class="blog-article__footer">
      <p v-if="updatedDate" class="blog-article__updated">
        上次更新：{{ updatedDate }}
      </p>
      <NuxtLink
        class="blog-article__back blog-article__back--footer"
        to="/blog"
      >
        ← 文章
      </NuxtLink>
    </footer>
  </article>
</template>

<style scoped>
.blog-article {
  width: min(100%, var(--container-reading));
  margin-inline: auto;
  display: grid;
  gap: var(--spacing-10);
}

.blog-article__back {
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

.blog-article__back:hover {
  color: var(--text-accent);
}

.blog-article__back:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: var(--focus-ring-shadow);
}

.blog-article__header {
  display: grid;
  gap: var(--spacing-5);
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: var(--spacing-8);
}

.blog-article__meta-row {
  display: grid;
  gap: var(--spacing-3);
}

.blog-article__meta {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.blog-article__title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--text-4xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-normal);
}

.blog-article__description {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
}

.blog-article__prose {
  color: var(--text-primary);
  font-size: var(--text-md);
  line-height: var(--leading-loose);
}

.blog-article__prose :deep(*) {
  overflow-wrap: anywhere;
}

.blog-article__prose :deep(p) {
  margin: 0 0 1.35em;
}

.blog-article__prose :deep(h2),
.blog-article__prose :deep(h3) {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--tracking-normal);
}

.blog-article__prose :deep(h2) {
  margin: 2.4em 0 0.7em;
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
}

.blog-article__prose :deep(h3) {
  margin: 2em 0 0.7em;
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
}

.blog-article__prose :deep(a) {
  border-radius: 0.125rem;
  color: var(--text-accent);
  text-decoration: underline;
  text-decoration-color: color-mix(
    in srgb,
    var(--text-accent) 42%,
    transparent
  );
  text-underline-offset: 0.18em;
  transition: var(--transition-interactive);
}

.blog-article__prose :deep(a:hover) {
  text-decoration-color: var(--text-accent);
}

.blog-article__prose :deep(a:focus-visible) {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: var(--focus-ring-shadow);
}

.blog-article__prose :deep(strong) {
  font-weight: var(--font-weight-semibold);
}

.blog-article__prose :deep(ul),
.blog-article__prose :deep(ol) {
  margin: 0 0 1.35em;
  padding-left: 1.4em;
}

.blog-article__prose :deep(li) {
  margin: 0.4em 0;
}

.blog-article__prose :deep(code) {
  border: 1px solid var(--border-subtle);
  border-radius: 0.3125rem;
  padding: 0.1em 0.35em;
  background: var(--surface-subtle);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.86em;
}

.blog-article__prose :deep(pre) {
  overflow: auto;
  margin: 1.7em 0;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 1.1rem;
  background: var(--surface-subtle);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.7;
}

.blog-article__prose :deep(pre code) {
  border: 0;
  border-radius: 0;
  padding: 0;
  background: transparent;
  font-size: inherit;
}

.blog-article__prose :deep(blockquote) {
  margin: 1.7em 0;
  border-left: 3px solid var(--color-lavender-500);
  padding-left: 1.1em;
  color: var(--text-secondary);
  font-style: normal;
}

.blog-article__prose :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

.blog-article__prose :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1.6em 0;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
}

.blog-article__prose :deep(hr) {
  width: 42%;
  height: 1px;
  margin: 2.4em auto;
  border: 0;
  background: var(--border-subtle);
}

.blog-article__prose :deep(table) {
  width: 100%;
  margin: 1.7em 0;
  border-collapse: collapse;
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.blog-article__prose :deep(th),
.blog-article__prose :deep(td) {
  border: 1px solid var(--border-subtle);
  padding: 0.65rem 0.75rem;
  text-align: left;
  vertical-align: top;
}

.blog-article__prose :deep(th) {
  background: var(--surface-subtle);
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

.blog-article__footer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-subtle);
  padding-top: var(--spacing-6);
}

.blog-article__updated {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.blog-article__back--footer {
  margin-left: auto;
}

@media (max-width: 640px) {
  .blog-article {
    gap: var(--spacing-8);
  }

  .blog-article__title {
    font-size: var(--text-3xl);
    line-height: var(--text-3xl--line-height);
  }

  .blog-article__prose {
    font-size: var(--text-base);
  }
}
</style>
