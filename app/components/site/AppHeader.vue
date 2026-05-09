<script setup lang="ts">
import LoSignatureMark from "~/components/site/LoSignatureMark.vue"
import ThemeToggle from "~/components/theme/toggle.vue"

const route = useRoute()
const { navItems } = useSiteContent()
const showHeaderMark = computed(() => route.path !== "/")

function isActive(to: string) {
  if (to === "/") {
    return route.path === "/"
  }

  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <header class="site-header">
    <div
      class="site-header__inner"
      :class="{ 'site-header__inner--markless': !showHeaderMark }"
    >
      <NuxtLink
        v-if="showHeaderMark"
        to="/"
        class="site-header__mark"
        aria-label="Lo"
      >
        <LoSignatureMark :animated="false" />
      </NuxtLink>

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
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  min-height: 64px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface-canvas);
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

.site-header__inner--markless {
  justify-content: flex-end;
}

.site-header__mark {
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition-interactive);
  --lo-signature-width: 54px;
  --lo-signature-height: 36px;
  --lo-signature-stroke-width: 0.32;
}

.site-header__mark:hover {
  color: var(--text-accent);
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
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
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
