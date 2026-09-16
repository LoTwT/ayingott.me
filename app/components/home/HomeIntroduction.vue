<template>
  <section
    aria-labelledby="introduction-title"
    class="home-introduction flex items-center"
  >
    <div class="space-y-5">
      <h1
        id="introduction-title"
        class="font-display text-4xl leading-tight font-medium sm:text-5xl"
      >
        你好，我是 Lo。
      </h1>
      <p class="text-base leading-relaxed text-(--text-secondary)">
        在这里，记录一些想法与尝试。
      </p>
    </div>
  </section>
</template>

<style scoped>
.home-introduction {
  min-block-size: calc(100dvh - var(--site-header-height));
  padding-block: 3rem calc(9rem + 8dvh);
}
</style>
