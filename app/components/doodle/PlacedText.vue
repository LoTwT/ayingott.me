<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{ text: string; delay?: number }>(), {
  delay: 80,
})

// Fixed angles rather than random ones, so prerendered HTML and hydration agree.
const placementRotations = [-7, 5, -4, 8, -6, 3, -2, 6]

const placedCharacters = computed(() =>
  Array.from(props.text, (character, index) => ({
    // Spaces would collapse between inline blocks.
    character: character === " " ? " " : character,
    style: {
      "--motion-order": index,
      "--placed-rotation": `${placementRotations[index % placementRotations.length]}deg`,
    },
  })),
)
</script>

<template>
  <span class="sr-only">{{ text }}</span>
  <span aria-hidden="true">
    <span
      v-for="(placedCharacter, index) in placedCharacters"
      :key="index"
      class="placed-character"
      :style="[placedCharacter.style, { '--placed-delay': `${delay}ms` }]"
      >{{ placedCharacter.character }}</span
    >
  </span>
</template>

<style scoped>
.placed-character {
  display: inline-block;
}

@media (prefers-reduced-motion: no-preference) {
  .placed-character {
    animation: placed 520ms var(--ease-sticker) both;
    animation-delay: calc(var(--motion-order) * 55ms + var(--placed-delay));
  }
}
</style>
