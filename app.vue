<script setup lang="ts">
useHead({
  title: "Ayingott",
  meta: [
    {
      name: "description",
      content: "Ayingott's website",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: () => (usePreferredDark().value ? "/lo-white.svg" : "/lo.svg"),
    },
  ],
})

useSeoMeta({
  title: "Ayingott",
  ogTitle: "Ayingott's website",
  description: "Ayingott's website",
  ogDescription: "Ayingott's website",
  ogImage: "/lo.svg",
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
