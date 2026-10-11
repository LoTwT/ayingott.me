<script setup lang="ts">
// Overrides Content's default image: keeps the size written by nuxt-content-assets
// and shows the Markdown image title as a caption.
defineProps<{
  src: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}>()
</script>

<template>
  <span class="article-figure block">
    <img :src="src" :alt="alt ?? ''" :width="width" :height="height" />
    <span v-if="title" class="article-figure-caption">{{ title }}</span>
  </span>
</template>
