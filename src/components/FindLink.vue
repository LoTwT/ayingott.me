<script setup lang="ts">
const { title, href } = defineProps<{ title: string; href: string }>()
</script>

<template>
  <!-- <NuxtLink :href="href" target="_blank">
    <span
      relative
      text-3xl
      before="content-none w-2 h-1 absolute bg-black -bottom-1 left-0 transition-all duration-500 dark:bg-white"
      hover:before="w-100%"
    >
      {{ title }}
    </span>
  </NuxtLink> -->
  <a
    :href="href"
    target="_blank"
    relative
    text-3xl
    hover:before="w-100%"
  >
    {{ title }}
  </a>
</template>

<style scoped>
a::before {
  --at-apply: content-none w-2 h-1 absolute bg-black -bottom-1 left-0 transition-all duration-500 dark:bg-white;
}
</style>

