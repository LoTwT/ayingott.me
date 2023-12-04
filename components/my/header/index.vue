<template>
  <header class="my-bg" fixed w-full flex items-center justify-end px-4 py-4>
    <LocaleChange mr-2 />
    <ThemeToggle mr-2 />
    <SocialGithub />
  </header>
</template>

<style scoped>
.my-bg {
  background-color: hsl(var(--b1) / var(--un-bg-opacity, 1));
}

.my-bg::before {
  --uno: absolute left-0 w-full h-8 bottom--8;

  content: "";
  background: linear-gradient(
    hsl(var(--b1) / var(--un-bg-opacity, 1)),
    transparent 70%
  );
}
</style>
