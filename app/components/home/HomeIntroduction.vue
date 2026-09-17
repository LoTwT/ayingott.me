<script setup lang="ts">
import HomeLinks from "~/components/home/HomeLinks.vue"
</script>

<template>
  <section
    aria-labelledby="introduction-title"
    class="home-introduction flex items-center"
  >
    <div>
      <h1
        id="introduction-title"
        class="font-display text-4xl leading-tight font-medium sm:text-5xl"
      >
        你好，我是 Lo
      </h1>
      <HomeLinks class="mt-1.5" />
    </div>
  </section>
</template>

<style scoped>
.home-introduction {
  min-block-size: calc(
    100dvh - var(--site-header-height) - var(--site-footer-height)
  );
  padding-block: 3rem calc(9rem + 8dvh - var(--site-footer-height));
}

@media (max-height: 28rem) {
  .home-introduction {
    align-items: flex-start;
    padding-block: 1.5rem;
  }
}
</style>
