<script setup lang="ts">
import { useTemplateRef } from "vue"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"
import { useDrawOnView } from "~/composables/useDrawOnView"

// Replaces Content's default blockquote: a hand-drawn line runs down the left edge.
const quote = useTemplateRef<HTMLElement>("quote")
const isDrawn = useDrawOnView(quote)
</script>

<template>
  <blockquote ref="quote" :class="{ 'is-drawn': isDrawn }">
    <DoodleStroke shape="bracket" class="quote-stroke" />
    <slot />
  </blockquote>
</template>

<style scoped>
blockquote {
  position: relative;
}

.quote-stroke {
  top: 0;
  left: 0;
  width: 10px;
  height: 100%;
  stroke-width: 2.6;
  color: var(--brutal-blue);
}

.is-drawn > .quote-stroke {
  --doodle-offset: 0;
}
</style>
