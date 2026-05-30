<script setup lang="ts">
import type { FeaturedWork } from "~/composables/useSiteContent"

defineProps<{
  items: FeaturedWork[]
}>()
</script>

<template>
  <div class="works-project-list">
    <NuxtLink
      v-for="item in items"
      :key="item.key"
      class="works-project-row"
      :to="item.href"
      :external="item.external"
      :target="item.external ? '_blank' : undefined"
      :rel="item.external ? 'noopener noreferrer' : undefined"
    >
      <span class="works-project-row__main">
        <span class="works-project-row__name">
          {{ item.title }}
          <span class="works-project-row__arrow" aria-hidden="true">↗</span>
        </span>
        <span class="works-project-row__description">
          {{ item.description }}
        </span>
      </span>

      <span class="works-project-row__side">
        <span class="works-project-row__year">{{ item.year }}</span>
        <span class="works-project-row__tags" aria-label="标签">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="works-project-row__tag"
          >
            {{ tag }}
          </span>
        </span>
      </span>
    </NuxtLink>
  </div>
</template>

<style scoped>
.works-project-list {
  display: grid;
}

.works-project-row {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--spacing-5);
  border-top: 1px solid var(--border-subtle);
  padding-block: var(--spacing-5);
  color: inherit;
  text-align: left;
  text-decoration: none;
  transition: var(--transition-interactive);
}

.works-project-row:last-child {
  border-bottom: 1px solid var(--border-subtle);
}

.works-project-row__main {
  min-width: 0;
  display: grid;
  gap: var(--spacing-2);
}

.works-project-row__name {
  min-width: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  font-weight: var(--font-weight-medium);
  overflow-wrap: anywhere;
  transition: var(--transition-interactive);
}

.works-project-row__arrow {
  display: inline-block;
  margin-inline-start: var(--spacing-1);
  color: var(--text-muted);
  transition: var(--transition-interactive);
}

.works-project-row__description {
  max-width: 46ch;
  color: var(--text-muted);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

.works-project-row__side {
  display: grid;
  justify-items: end;
  gap: var(--spacing-3);
}

.works-project-row__year {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}

.works-project-row__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--spacing-2);
}

.works-project-row__tag {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-control);
  padding: 0.125rem var(--spacing-2);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}

.works-project-row:hover {
  padding-inline-start: var(--spacing-2);
}

.works-project-row:hover .works-project-row__name {
  color: var(--text-accent);
}

.works-project-row:hover .works-project-row__arrow {
  color: var(--text-accent);
  transform: translateX(4px);
}

.works-project-row:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 3px;
  box-shadow: var(--focus-ring-shadow);
}

@media (max-width: 640px) {
  .works-project-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
  }

  .works-project-row__side {
    justify-items: start;
  }

  .works-project-row__tags {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .works-project-row,
  .works-project-row__name,
  .works-project-row__arrow {
    transition: none;
  }

  .works-project-row:hover {
    padding-inline-start: 0;
  }

  .works-project-row:hover .works-project-row__arrow {
    transform: none;
  }
}
</style>
