<script setup lang="ts">
import DecorativePrimitive from "~/components/site/DecorativePrimitive.vue"

withDefaults(
  defineProps<{
    title: string
    headingId?: string
    subtitle?: string
    decoration?: "circle" | "square" | "none"
  }>(),
  {
    decoration: "circle",
  },
)
</script>

<template>
  <header class="page-title">
    <div>
      <h1 :id="headingId" class="page-title__heading">{{ title }}</h1>
      <p v-if="subtitle" class="page-title__subtitle">{{ subtitle }}</p>
    </div>

    <DecorativePrimitive
      v-if="decoration !== 'none'"
      class="page-title__decoration"
      :kind="decoration"
    />
  </header>
</template>

<style scoped>
.page-title {
  position: relative;
  max-width: var(--container-reading);
}

.page-title__heading {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--text-4xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-normal);
}

.page-title__subtitle {
  margin: var(--spacing-3) 0 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.page-title__decoration {
  position: absolute;
  top: var(--spacing-1);
  right: 0;
}
</style>
