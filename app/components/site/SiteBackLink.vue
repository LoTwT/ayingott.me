<script setup lang="ts">
import { ArrowLeft } from "@lucide/vue"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"

defineProps<{
  to: string
  // A full page load, e.g. to leave the error state on the error page.
  external?: boolean
  decorated?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    :external="external"
    :prefetch="external ? false : undefined"
    :class="{ 'back-link--decorated': decorated }"
    class="back-link inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-control) text-(--text-muted) no-underline focus-ring hover:text-(--text-secondary)"
  >
    <ArrowLeft
      class="back-link-arrow size-4"
      :stroke-width="2"
      aria-hidden="true"
    />
    <span v-if="decorated" class="back-link-label">
      <slot />
      <DoodleStroke shape="wave" class="back-link-underline" />
    </span>
    <slot v-else />
  </NuxtLink>
</template>

<style scoped>
.back-link-label {
  position: relative;
}

.back-link-underline {
  bottom: -0.1875rem;
  left: 0;
  width: 100%;
  height: 0.375rem;
  stroke-width: 1.8;
  color: var(--content-link-coral);
}

.back-link:hover .back-link-underline,
.back-link:focus-visible .back-link-underline {
  --doodle-offset: 0;
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .back-link-arrow {
    transition: transform 260ms var(--ease-sticker);
  }

  .back-link:hover .back-link-arrow,
  .back-link:focus-visible .back-link-arrow {
    transform: translateX(-3px);
  }
}
</style>
