<script setup lang="ts">
import type { ContactLink } from "~/composables/useSiteContent"
import ContactLinkList from "~/components/site/ContactLinkList.vue"

defineProps<{
  links: ContactLink[]
}>()
</script>

<template>
  <ContactLinkList :links="links" />
</template>
