<script setup lang="ts">
const { isDark } = useAppliedColorMode()
const faviconHref = computed(() => (isDark.value ? "/lo-white.svg" : "/lo.svg"))

useHead({
  htmlAttrs: {
    lang: "zh-CN",
  },
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: () => faviconHref.value,
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
