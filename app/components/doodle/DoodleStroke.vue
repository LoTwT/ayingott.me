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
  rays: {
    viewBox: "0 0 48 48",
    stretch: false,
    path: "M23.4 7.5 L23.2 2.0 M36.6 12.6 L41.1 8.6 M40.0 23.4 L45.5 23.2 M35.7 37.0 L39.7 41.5 M24.6 40.5 L24.8 46.0 M11.4 35.4 L6.9 39.4 M8.0 24.6 L2.5 24.8 M12.6 11.4 L8.9 7.3",
  },
  stars: {
    viewBox: "0 0 48 48",
    stretch: false,
    path: "M38 2 L39.6 7.6 L45 9 L39.6 10.6 L38 16 L36.4 10.6 L31 9 L36.4 7.4 Z M9 33 L10.1 36.9 L14 38 L10.1 39.1 L9 43 L7.9 39.1 L4 38 L7.9 36.9 Z M43 30 L43.8 32.2 L46 33 L43.8 33.8 L43 36 L42.2 33.8 L40 33 L42.2 32.2 Z",
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
