<script setup lang="ts">
import type { BlogPostLike } from "~/utils/blog"
import { computed } from "vue"
import BlogTags from "~/components/blog/BlogTags.vue"
import {
  estimateReadingTime,
  formatBlogDate,
  getBlogPostHref,
} from "~/utils/blog"

const props = defineProps<{
  post: BlogPostLike
}>()

const href = computed(() => getBlogPostHref(props.post))
const displayDate = computed(() => formatBlogDate(props.post.date))
const readingTime = computed(() => estimateReadingTime(props.post.body))
const tags = computed(() => props.post.tags ?? [])
</script>

<template>
  <article class="blog-card">
    <NuxtLink class="blog-card__link" :to="href">
      <span class="blog-card__meta">
        {{ displayDate }} · {{ readingTime }}
      </span>
      <h2 class="blog-card__title">{{ post.title }}</h2>
      <p class="blog-card__excerpt">{{ post.description }}</p>
      <BlogTags v-if="tags.length" class="blog-card__tags" :tags="tags" />
    </NuxtLink>
  </article>
</template>

<style scoped>
.blog-card {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  background: var(--surface-elevated);
  box-shadow: var(--shadow-card);
  transition: var(--transition-interactive);
}

.blog-card__link {
  display: grid;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  color: inherit;
  text-align: left;
  text-decoration: none;
}

.blog-card__link:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 3px;
  box-shadow: var(--focus-ring-shadow);
}

.blog-card__meta {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}

.blog-card__title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-normal);
  transition: var(--transition-interactive);
}

.blog-card__excerpt {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

.blog-card__tags {
  margin-top: var(--spacing-1);
}

.blog-card__link:hover .blog-card__title {
  color: var(--text-accent);
}

.blog-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .blog-card {
    transition: none;
  }

  .blog-card:hover {
    transform: none;
  }
}
</style>
