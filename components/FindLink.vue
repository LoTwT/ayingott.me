<script setup lang="ts">
const { title, href } = defineProps<{ title: string; href: string }>()
</script>

<template>
  <NuxtLink :href="href" target="_blank">
    <span
      relative
      text-3xl
      before="content-none w-2 h-1 absolute bg-black -bottom-1 left-0 transition-all duration-500 dark:bg-white"
      hover:before="w-100%"
    >
      {{ title }}
    </span>
  </NuxtLink>
</template>

<style scoped></style>
