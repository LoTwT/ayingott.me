<template>
  <header flex items-center justify-between px-4 py-2>
    <Signature h-12 />
    <ThemeToggle />
  </header>
  <main h-screen w-screen flex items-center justify-center>
    <slot />
  </main>
</template>
