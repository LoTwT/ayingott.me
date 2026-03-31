<script setup lang="ts">
const colorMode = useColorMode()
const requestUrl = useRequestURL()

const faviconHref = computed(() =>
  colorMode.value === "dark" ? "/lo-white.svg" : "/lo.svg",
)
const ogImageUrl = computed(() =>
  new URL("/lo.svg", requestUrl.origin).toString(),
)

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
      href: () => faviconHref.value,
    },
  ],
})

useSeoMeta({
  title: "Ayingott",
  ogTitle: "Ayingott's website",
  description: "Ayingott's website",
  ogDescription: "Ayingott's website",
  ogImage: () => ogImageUrl.value,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
