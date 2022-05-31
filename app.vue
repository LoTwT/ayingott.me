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
  <div w-full h-full text-center flex justify-center items-center>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
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
