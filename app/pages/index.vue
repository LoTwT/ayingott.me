<script setup lang="ts">
import { useHead } from "#imports"
import HomeIntroduction from "~/components/home/HomeIntroduction.vue"
import HomeContentExamples from "~/components/home/HomeContentExamples.vue"

useHead({ link: [{ rel: "canonical", href: "https://ayingott.me/" }] })
</script>

<template>
  <main id="main-content" tabindex="-1">
    <HomeIntroduction />
    <HomeContentExamples />
  </main>
</template>
