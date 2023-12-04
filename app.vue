<script setup lang="ts">
const theme = useTheme()
const { locale } = useI18n()
</script>

<template>
  <Html :data-theme="theme" :lang="locale" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  --uno: font-sans;
}
</style>
