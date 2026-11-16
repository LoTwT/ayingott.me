<script setup lang="ts">
import SiteBackdrop from "~/components/backdrop/SiteBackdrop.vue"
import SiteFooter from "~/components/site/SiteFooter.vue"
import SiteNavigation from "~/components/site/SiteNavigation.vue"
import ThemeSwitcher from "~/components/theme/ThemeSwitcher.vue"
</script>

<template>
  <div
    class="relative flex min-h-dvh flex-col [--site-footer-height:5rem] [--site-header-height:6rem]"
  >
    <SiteBackdrop />
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-10 focus:bg-(--surface-canvas) focus:p-3"
    >
      跳到正文
    </a>
    <!-- Keep the rotating theme marks from widening the mobile viewport. -->
    <header class="site-header relative shrink-0 overflow-x-clip">
      <div class="site-header-navigation">
        <SiteNavigation />
      </div>
      <!-- The icon ends 1.5rem (2.5rem from 640px) from the viewport edge; the 44px hit area extends evenly around it. -->
      <div class="site-theme-control">
        <ThemeSwitcher />
      </div>
    </header>
    <div class="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 sm:px-10">
      <slot />
      <SiteFooter class="mt-auto" />
    </div>
  </div>
</template>

<style scoped>
.site-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 0.75rem;
  min-height: var(--site-header-height);
  container-type: inline-size;
}

.site-header-navigation {
  min-width: 0;
  margin-inline-start: max(0px, calc((100cqi - 48rem) / 2));
  padding-inline-start: 1.5rem;
}

.site-theme-control {
  margin-inline-end: 0.75rem;
}

@media (min-width: 40rem) {
  .site-header-navigation {
    padding-inline-start: 2.5rem;
  }

  .site-theme-control {
    margin-inline-end: 1.75rem;
  }
}
</style>
