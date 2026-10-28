<script setup lang="ts">
withDefaults(
  defineProps<{ tags: readonly string[]; size?: "small" | "regular" }>(),
  { size: "small" },
)
</script>

<template>
  <ul
    v-if="tags.length > 0"
    aria-label="标签"
    class="flex flex-wrap gap-x-3 font-mono"
    :class="size === 'small' ? 'text-xs' : 'text-sm'"
  >
    <li v-for="tag in tags" :key="tag" class="post-tag-item">
      <NuxtLink
        :to="`/tags/${tag}`"
        class="post-tag-link rounded-(--radius-control) text-(--text-muted) focus-ring hover:text-(--text-secondary)"
      >
        <span class="post-tag-sticker">#{{ tag }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
/* Hovering peels a tag up as a sticker. The padding is cancelled by negative margins
   and the edge is drawn with box-shadow, so the layout never moves. Only the inner
   sticker tilts and lifts: the link keeps its place as the hover area, otherwise a
   pointer at the edge would fall off the moving tag and make it flicker. */
.post-tag-link {
  --sticker-color: var(--brutal-yellow);
  --sticker-tilt: -3deg;
  --sticker-edge: 0 0 0 1.5px var(--brutal-sticker-ink);
  --sticker-shadow: 2px 2px 0 1.5px var(--brutal-sticker-ink);
  display: inline-block;
  margin: -1px -6px;
}

.post-tag-sticker {
  display: block;
  padding: 1px 6px;
  border-radius: inherit;
}

.post-tag-item:nth-child(3n + 2) .post-tag-link {
  --sticker-color: var(--brutal-pink);
  --sticker-tilt: 2.5deg;
}

.post-tag-item:nth-child(3n) .post-tag-link {
  --sticker-color: var(--brutal-purple);
  --sticker-tilt: -1.5deg;
}

/* On the dark canvas a 2px ink shadow disappears; a deeper, wider one still lifts the sticker. */
html.dark .post-tag-link {
  --sticker-shadow: 3px 4px 0 3px rgb(0 0 0 / 0.55);
}

.post-tag-link:hover .post-tag-sticker {
  color: var(--brutal-sticker-ink);
  background-color: var(--sticker-color);
  box-shadow: var(--sticker-edge), var(--sticker-shadow);
  rotate: var(--sticker-tilt);
  translate: 0 -2px;
}

@media (prefers-reduced-motion: no-preference) {
  .post-tag-sticker {
    transition:
      color 120ms,
      background-color 120ms,
      box-shadow 220ms var(--ease-sticker),
      rotate 220ms var(--ease-sticker),
      translate 220ms var(--ease-sticker);
  }
}
</style>
