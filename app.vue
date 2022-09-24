<script setup lang="ts">
useHead({
  title: "Nuxt3 starter",
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/nuxt.png",
    },
  ],
})
</script>

<template>
  <main class="py-20 px-10 text-center">
    <NuxtPage />
    <Footer />
  </main>
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
