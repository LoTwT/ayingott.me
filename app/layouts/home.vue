<template>
  <header class="flex items-center justify-between px-4 py-2">
    <Signature class="h-12" />
    <ThemeToggle />
  </header>
  <main class="flex flex-1 items-center justify-center">
    <slot />
  </main>
</template>
