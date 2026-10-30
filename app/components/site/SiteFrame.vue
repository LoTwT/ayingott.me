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
    <header class="site-header relative h-(--site-header-height) shrink-0">
      <div
        class="mx-auto flex h-full w-full max-w-3xl items-center px-6 sm:px-10"
      >
        <SiteNavigation />
      </div>
      <!-- The icon ends 1.5rem (2.5rem from 640px) from the viewport edge; the 44px hit area extends evenly around it. -->
      <div class="absolute inset-y-0 right-3 flex items-center sm:right-7">
        <ThemeSwitcher />
      </div>
    </header>
    <div class="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 sm:px-10">
      <slot />
      <SiteFooter class="mt-auto" />
    </div>
  </div>
</template>
