<script setup lang="ts">
import type { ContactLink } from "~/composables/useSiteContent"
import SiteIcon from "~/components/site/SiteIcon.vue"

withDefaults(
  defineProps<{
    links: ContactLink[]
    ariaLabel?: string
    variant?: "inline" | "stacked"
  }>(),
  {
    ariaLabel: "联系方式",
    variant: "inline",
  },
)
</script>

<template>
  <nav
    class="contact-link-list"
    :class="`contact-link-list--${variant}`"
    :aria-label="ariaLabel"
  >
    <template v-for="(link, index) in links" :key="link.key">
      <span
        v-if="variant === 'inline' && index > 0"
        class="contact-link-list__separator"
        aria-hidden="true"
      >
        ·
      </span>
      <NuxtLink
        class="contact-link-list__link"
        :to="link.href"
        :external="link.external"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
      >
        <SiteIcon class="contact-link-list__icon" :name="link.icon" />
        <span>{{ link.label }}</span>
      </NuxtLink>
    </template>
  </nav>
</template>

<style scoped>
.contact-link-list {
  display: grid;
  justify-items: start;
}

.contact-link-list--inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
}

.contact-link-list--stacked {
  gap: var(--spacing-2);
}

.contact-link-list__link {
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
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

.contact-link-list__separator {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.contact-link-list__link .contact-link-list__icon {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: var(--text-muted);
  transition: var(--transition-interactive);
}

.contact-link-list__link:hover {
  color: var(--text-accent);
  text-decoration-color: var(--text-accent);
}

.contact-link-list__link:hover .contact-link-list__icon {
  color: var(--text-accent);
}

.contact-link-list__link:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: var(--focus-ring-shadow);
}
</style>
