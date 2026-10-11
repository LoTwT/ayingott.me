<script setup lang="ts">
import { ArrowLeft } from "@lucide/vue"

defineProps<{
  to: string
  // A full page load, e.g. to leave the error state on the error page.
  external?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    :external="external"
    :prefetch="external ? false : undefined"
    class="back-link inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-control) text-(--text-muted) no-underline focus-ring hover:text-(--text-secondary)"
  >
    <ArrowLeft
      class="back-link-arrow size-4"
      :stroke-width="2"
      aria-hidden="true"
    />
    <slot />
  </NuxtLink>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .back-link-arrow {
    transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .back-link:hover .back-link-arrow,
  .back-link:focus-visible .back-link-arrow {
    transform: translateX(-2px);
  }
}
</style>
