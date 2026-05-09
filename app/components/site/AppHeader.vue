<script setup lang="ts">
import ThemeToggle from "~/components/theme/toggle.vue"

const route = useRoute()
const { navItems } = useSiteContent()

function isActive(to: string) {
  if (to === "/") {
    return route.path === "/"
  }

  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <span class="site-header__mark">ayingott.me</span>

      <div class="site-header__actions">
        <nav class="site-header__nav" aria-label="主导航">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="site-header__link"
            :class="{ 'site-header__link--active': isActive(item.to) }"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  min-height: 64px;
  padding-inline: var(--layout-page-gutter);
}

.site-header__inner {
  max-width: var(--container-wide);
  min-height: 64px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.site-header__mark {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  cursor: default;
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.site-header__link {
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  padding-inline: var(--spacing-3);
  border-radius: var(--radius-control);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  text-decoration: none;
  transition: var(--transition-interactive);
}

.site-header__link:hover,
.site-header__link--active {
  color: var(--text-accent);
}

@media (max-width: 520px) {
  .site-header__inner {
    min-height: auto;
    padding-block: var(--spacing-4);
    flex-direction: column;
    align-items: flex-start;
  }

  .site-header__actions {
    width: 100%;
    justify-content: space-between;
  }

  .site-header__nav {
    margin-inline: calc(var(--spacing-3) * -1);
  }
}
</style>
