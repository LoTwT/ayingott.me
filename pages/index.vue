<script setup lang="ts">
definePageMeta({
  layout: "home",
})
</script>

<template>
  <div>
    <div text-xl transition-opacity>
      <span>Hi, I'm </span>
      <span font-bold>Lo</span>
      <span>, also</span>
      <span font-bold> Ayingott</span>
      <span>.</span>
    </div>
    <div mt-2 flex items-center justify-center gap-4>
      <NuxtLink to="https://twitter.com/ayingott319" target="_blank">
        <div i-line-md-twitter-x size-6 />
      </NuxtLink>

      <NuxtLink to="https://github.com/lotwt" target="_blank">
        <div i-line-md-github-loop size-6 />
      </NuxtLink>

      <NuxtLink to="mailto:l709937065@gmail.com">
        <div i-line-md-email size-6 />
      </NuxtLink>
    </div>
  </div>
</template>
