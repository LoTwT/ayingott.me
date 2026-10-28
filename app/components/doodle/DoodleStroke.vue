<script setup lang="ts">
import { computed } from "vue"

// Hand-drawn strokes. Each path is slightly uneven and overshoots its end on purpose.
// "stretch" shapes fill their box; the others keep their aspect ratio.
const doodleShapes = {
  underline: {
    viewBox: "0 0 100 9",
    stretch: true,
    path: "M2 5 C 20 2.5, 45 6.5, 70 4 S 92 3, 98 4.5",
  },
  wave: {
    viewBox: "0 0 100 7",
    stretch: true,
    path: "M1 4 C 12 1.5, 22 6, 35 3.5 S 58 1.5, 72 4 S 90 5.5, 99 3",
  },
  marker: {
    viewBox: "0 0 100 20",
    stretch: true,
    path: "M2 12 C 25 9, 60 14, 98 10",
  },
  bracket: {
    viewBox: "0 0 10 100",
    stretch: true,
    path: "M6 2 C 3 25, 7 50, 4 75 S 5 95, 6 98",
  },
  ring: {
    viewBox: "0 0 48 48",
    stretch: false,
    path: "M26 4 C 39 4, 45 14, 44 25 C 43 38, 31 45, 20 43 C 8 41, 3 30, 5 19 C 7 9, 16 4, 30 6",
  },
  sparkle: {
    viewBox: "0 0 22 18",
    stretch: false,
    path: "M5 12 L2 5 M11 9 L12.5 1.5 M15 14 L21 11.5",
  },
} as const

export type DoodleShape = keyof typeof doodleShapes

const props = defineProps<{ shape: DoodleShape }>()
const doodleShape = computed(() => doodleShapes[props.shape])
</script>

<template>
  <svg
    class="doodle"
    :viewBox="doodleShape.viewBox"
    :preserveAspectRatio="doodleShape.stretch ? 'none' : undefined"
    aria-hidden="true"
    focusable="false"
  >
    <path pathLength="1" :d="doodleShape.path" />
  </svg>
</template>
