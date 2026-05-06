<script setup lang="ts">
const colorMode = useColorMode()
const runtimeConfig = useRuntimeConfig()

const isDark = computed(
  () =>
    colorMode.preference === "dark" ||
    (colorMode.preference === "system" && colorMode.value === "dark"),
)
const faviconHref = computed(() => (isDark.value ? "/lo-white.svg" : "/lo.svg"))
const ogImageUrl = computed(() =>
  new URL("/lo.svg", runtimeConfig.public.siteUrl).toString(),
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
