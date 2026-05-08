<script setup lang="ts">
defineProps<{
  kind: "dot" | "line" | "circle" | "square"
}>()
</script>

<template>
  <span
    class="decorative-primitive"
    :class="`decorative-primitive--${kind}`"
    aria-hidden="true"
  />
</template>

<style scoped>
.decorative-primitive {
  display: inline-block;
  color: var(--accent-primary);
  pointer-events: none;
}

.decorative-primitive--dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: currentColor;
}

.decorative-primitive--line {
  width: 40px;
  height: 2px;
  background: currentColor;
}

.decorative-primitive--circle {
  width: 24px;
  height: 24px;
  border: 1.5px solid currentColor;
  border-radius: var(--radius-full);
}

.decorative-primitive--square {
  width: 16px;
  height: 16px;
  border: 1.5px solid currentColor;
  transform: rotate(45deg);
}
</style>
