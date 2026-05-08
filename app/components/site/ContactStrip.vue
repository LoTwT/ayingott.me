<script setup lang="ts">
import SiteIconLink from "~/components/site/SiteIconLink.vue"

const { contactLinks } = useSiteContent()
</script>

<template>
  <nav class="contact-strip" aria-label="联系方式">
    <SiteIconLink
      v-for="link in contactLinks"
      :key="link.key"
      :href="link.href"
      :label="link.label"
      :icon="link.icon"
      :external="link.external"
    />
  </nav>
</template>

<style scoped>
.contact-strip {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}
</style>
