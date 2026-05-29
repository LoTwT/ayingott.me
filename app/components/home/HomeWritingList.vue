<script setup lang="ts">
import type { BlogPostLike } from "~/utils/blog"
import { computed } from "vue"
import { formatBlogDate, getBlogPostHref } from "~/utils/blog"

const props = defineProps<{
  posts: BlogPostLike[]
}>()

const rows = computed(() =>
  props.posts.map((post) => ({
    key: post.path,
    title: post.title,
    href: getBlogPostHref(post),
    date: formatBlogDate(post.date),
    description: post.description,
  })),
)
</script>

<template>
  <div v-if="rows.length" class="home-writing-list" aria-label="最近文章">
    <NuxtLink
      v-for="row in rows"
      :key="row.key"
      class="home-writing-row"
      :to="row.href"
    >
      <span class="home-writing-row__meta">{{ row.date }}</span>
      <span class="home-writing-row__body">
        <span class="home-writing-row__title">{{ row.title }}</span>
        <span class="home-writing-row__description">
          {{ row.description }}
        </span>
      </span>
    </NuxtLink>
  </div>

  <p v-else class="home-writing-empty">
    第一篇真实文章准备好后,这里会变成最近写作的入口。
  </p>
</template>

<style scoped>
.home-writing-list {
  display: grid;
}

.home-writing-row {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(5.5rem, 7rem) minmax(0, 1fr);
  gap: var(--spacing-5);
  border-top: 1px solid var(--border-subtle);
  padding-block: var(--spacing-5);
  color: inherit;
  text-align: left;
  text-decoration: none;
  transition: var(--transition-interactive);
}

.home-writing-row:last-child {
  border-bottom: 1px solid var(--border-subtle);
}

.home-writing-row__meta {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}

.home-writing-row__body {
  min-width: 0;
  display: grid;
  gap: var(--spacing-2);
}

.home-writing-row__title {
  min-width: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  font-weight: var(--font-weight-medium);
  overflow-wrap: anywhere;
  transition: var(--transition-interactive);
}

.home-writing-row__description {
  max-width: 46ch;
  color: var(--text-muted);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

.home-writing-row:hover {
  padding-inline-start: var(--spacing-2);
}

.home-writing-row:hover .home-writing-row__title {
  color: var(--text-accent);
}

.home-writing-row:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 3px;
  box-shadow: var(--focus-ring-shadow);
}

.home-writing-empty {
  margin: 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  padding-block: var(--spacing-5);
  color: var(--text-muted);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

@media (max-width: 560px) {
  .home-writing-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-writing-row,
  .home-writing-row__title {
    transition: none;
  }

  .home-writing-row:hover {
    padding-inline-start: 0;
  }
}
</style>
