<script setup lang="ts">
import ThemeSwitcher from "~/components/theme/ThemeSwitcher.vue"
</script>

<template>
  <div class="flex min-h-dvh flex-col [--site-header-height:6rem]">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-10 focus:bg-(--surface-canvas) focus:p-3"
    >
      跳到正文
    </a>
    <header
      class="flex h-(--site-header-height) shrink-0 items-center justify-end px-6 sm:px-10"
    >
      <ThemeSwitcher />
    </header>
    <div class="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 sm:px-10">
      <slot />
    </div>
  </div>
</template>
