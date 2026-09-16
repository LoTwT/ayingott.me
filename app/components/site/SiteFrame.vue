<script setup lang="ts">
import ThemeSwitcher from "~/components/theme/ThemeSwitcher.vue"
</script>

<template>
  <div
    class="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 pb-24 sm:px-10"
  >
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-10 focus:bg-(--surface-canvas) focus:p-3"
    >
      跳到正文
    </a>
    <header class="flex min-h-24 shrink-0 items-center justify-end">
      <ThemeSwitcher />
    </header>
    <slot />
  </div>
</template>
