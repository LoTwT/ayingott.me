<script setup lang="ts">
useHead({
  title: "ayingott",
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/mea.jpg",
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #222;
  color: white;
}
</style>
