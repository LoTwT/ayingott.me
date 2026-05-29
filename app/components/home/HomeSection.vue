<script setup lang="ts">
defineProps<{
  sectionId: string
  label: string
  title: string
  actionLabel?: string
  actionTo?: string
}>()
</script>

<template>
  <section class="home-section" :aria-labelledby="`${sectionId}-title`">
    <div class="home-section__header">
      <div>
        <p class="home-section__kicker">{{ label }}</p>
        <h2 :id="`${sectionId}-title`" class="home-section__title">
          {{ title }}
        </h2>
      </div>

      <NuxtLink
        v-if="actionLabel && actionTo"
        class="home-section__action"
        :to="actionTo"
      >
        {{ actionLabel }}
        <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>

    <slot />
  </section>
</template>

<style scoped>
.home-section {
  display: grid;
  gap: var(--spacing-5);
}

.home-section__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.home-section__kicker {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-3);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-section__kicker::before {
  content: "";
  width: 1.4rem;
  height: 2px;
  flex: 0 0 auto;
  background: var(--text-accent);
  opacity: 0.85;
}

.home-section__title {
  margin: var(--spacing-2) 0 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-normal);
}

.home-section__action {
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  border-radius: var(--radius-control);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  text-decoration: none;
  transition: var(--transition-interactive);
}

.home-section__action:hover {
  color: var(--text-accent);
}

.home-section__action:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: var(--focus-ring-shadow);
}

@media (max-width: 560px) {
  .home-section__header {
    align-items: start;
    flex-direction: column;
    gap: var(--spacing-3);
  }
}
</style>
