<script setup lang="ts">
useHead({
  title: "ayingott",
  link: [
    {
      rel: "icon",
      type: "image/jpg",
      href: "/mea.jpg",
    },
  ],
})
</script>

<template>
  <div w-full h-full text-center flex justify-center items-center>
    <DarkToggle absolute right-4 top-4 text-2xl />

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
