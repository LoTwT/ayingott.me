<template>
  <div class="nicole-preview" aria-hidden="true">
    <img
      src="/projects/nicole-cover-light.webp"
      alt=""
      width="1280"
      height="800"
      loading="lazy"
      decoding="async"
      class="nicole-preview-light"
    />
    <img
      src="/projects/nicole-cover-dark.webp"
      alt=""
      width="1280"
      height="800"
      loading="lazy"
      decoding="async"
      class="nicole-preview-dark"
    />
  </div>
</template>

<style scoped>
.nicole-preview {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.nicole-preview img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nicole-preview-dark {
  opacity: 0;
}

:global(.dark .nicole-preview-light) {
  opacity: 0;
}

:global(.dark .nicole-preview-dark) {
  opacity: 1;
}
</style>
