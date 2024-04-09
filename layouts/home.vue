<template>
  <header flex items-center justify-between px-4 py-2>
    <Signature h-12 />
    <ThemeToggle />
  </header>
  <main flex flex-1 items-center justify-center>
    <slot />
  </main>
</template>
