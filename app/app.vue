<script setup lang="ts">
useSiteFavicon()

useHead({
  htmlAttrs: {
    lang: "zh-CN",
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
