<script setup lang="ts">
defineProps<{
  tags: string[]
}>()
</script>

<template>
  <ul v-if="tags.length" class="blog-tags" aria-label="标签">
    <li v-for="tag in tags" :key="tag" class="blog-tags__item">
      {{ tag }}
    </li>
  </ul>
</template>

<style scoped>
.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.blog-tags__item {
  border-radius: var(--radius-control);
  padding: 0.25rem 0.55rem;
  background: var(--accent-soft);
  color: var(--text-accent);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}
</style>
