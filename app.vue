<script setup lang="ts">
useHead({
  title: "Ayingott",
  meta: [
    {
      name: "description",
      content: "Ayingott's website",
    },
  ],
})

useSeoMeta({
  title: "Ayingott",
  ogTitle: "Ayingott's website",
  description: "Ayingott's website",
  ogDescription: "Ayingott's website",
  // ogImage: "",
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
