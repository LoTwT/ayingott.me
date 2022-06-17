<script setup lang="ts">
const { duration = 1600 } = defineProps<{ duration?: number }>()

const initial = {
  opacity: 0,
}

const enter = {
  opacity: 1,
  transition: {
    opacity: {
      duration,
    },
  },
}
</script>

<template>
  <div v-motion :initial="initial" :enter="enter">
    <slot />
  </div>
</template>
