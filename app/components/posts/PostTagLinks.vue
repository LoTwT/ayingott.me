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
    <li v-for="tag in tags" :key="tag">
      <NuxtLink
        :to="`/tags/${tag}`"
        class="rounded-(--radius-control) text-(--text-muted) focus-ring hover:text-(--text-secondary)"
      >
        #{{ tag }}
      </NuxtLink>
    </li>
  </ul>
</template>
