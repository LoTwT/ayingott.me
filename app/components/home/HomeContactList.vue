<script setup lang="ts">
import type { ContactLink } from "~/composables/useSiteContent"

defineProps<{
  links: ContactLink[]
}>()
</script>

<template>
  <nav class="home-contact-list" aria-label="联系方式">
    <NuxtLink
      v-for="link in links"
      :key="link.key"
      class="home-contact-list__link"
      :to="link.href"
      :external="link.external"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noreferrer' : undefined"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.home-contact-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3) var(--spacing-5);
}

.home-contact-list__link {
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-control);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  text-decoration-color: color-mix(
    in srgb,
    var(--text-accent) 45%,
    transparent
  );
  text-underline-offset: 0.28em;
  transition: var(--transition-interactive);
}

.home-contact-list__link:hover {
  color: var(--text-accent);
  text-decoration-color: var(--text-accent);
}

.home-contact-list__link:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: var(--focus-ring-shadow);
}
</style>
