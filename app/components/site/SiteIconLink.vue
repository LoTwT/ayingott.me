<script setup lang="ts">
import SiteIcon from "~/components/site/SiteIcon.vue"

defineProps<{
  href: string
  label: string
  icon: "github" | "x" | "mail" | "resume" | "rss"
  external?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="href"
    :aria-label="label"
    class="site-icon-link touch-target focus-ring"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <SiteIcon :name="icon" />
  </NuxtLink>
</template>

<style scoped>
.site-icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition-interactive);
}

.site-icon-link:hover {
  color: var(--text-accent);
  transform: scale(1.1);
}
</style>
