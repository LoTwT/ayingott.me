<script setup lang="ts">
import AppFooter from "~/components/site/AppFooter.vue"
import AppHeader from "~/components/site/AppHeader.vue"
</script>

<template>
  <AppHeader />
  <main class="site-main">
    <slot />
  </main>
  <AppFooter />
</template>

<style scoped>
.site-main {
  flex: 1;
  width: 100%;
  padding: var(--spacing-16) var(--layout-page-gutter) var(--spacing-8);
}
</style>
