<script setup lang="ts">
defineProps<{
  name: "github" | "x" | "mail" | "resume" | "rss"
}>()
</script>

<template>
  <svg
    v-if="name === 'github'"
    aria-hidden="true"
    class="site-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 19c-4 .8-4-2-5.5-2.5M15 22v-3.9c0-1-.4-1.7-.9-2.1c3-.3 6.1-1.5 6.1-6.6c0-1.5-.5-2.7-1.4-3.7c.1-.4.6-1.9-.1-3.7c0 0-1.2-.4-3.8 1.4a13 13 0 0 0-6.8 0C5.5 1.6 4.3 2 4.3 2c-.7 1.8-.2 3.3-.1 3.7a5.3 5.3 0 0 0-1.4 3.7c0 5.1 3.1 6.3 6.1 6.6c-.4.4-.8 1-.9 1.9V22"
    />
  </svg>

  <svg
    v-else-if="name === 'x'"
    aria-hidden="true"
    class="site-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 4l16 16M20 4L4 20" />
    <path d="M6 4h3.2L20 20h-3.2L6 4Z" />
  </svg>

  <svg
    v-else-if="name === 'mail'"
    aria-hidden="true"
    class="site-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.5 6.5h15v11h-15v-11Z" />
    <path d="M5 7l7 5l7-5" />
  </svg>

  <svg
    v-else-if="name === 'resume'"
    aria-hidden="true"
    class="site-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 3.5h7l3 3v14H7v-17Z" />
    <path d="M14 3.5v3h3" />
    <path d="M9.5 11h5M9.5 14h5M9.5 17h3" />
  </svg>

  <svg
    v-else
    aria-hidden="true"
    class="site-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 5c7.7 0 14 6.3 14 14" />
    <path d="M5 11c4.4 0 8 3.6 8 8" />
    <path d="M5.5 18.5h.01" />
  </svg>
</template>

<style scoped>
.site-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
