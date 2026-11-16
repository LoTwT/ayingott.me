<script setup lang="ts">
import type { ProjectPreviewContent } from "~/data/projects"

defineProps<{ name: string; preview?: ProjectPreviewContent }>()
</script>

<template>
  <div class="preview-content">
    <img
      v-if="preview?.kind === 'image'"
      :src="preview.src"
      :alt="preview.alt"
      width="800"
      height="500"
      loading="lazy"
      decoding="async"
      class="preview-image"
    />
    <div
      v-else-if="preview?.kind === 'component'"
      role="img"
      :aria-label="preview.label"
      class="preview-content"
    >
      <component :is="preview.component" />
    </div>
    <div
      v-else
      class="preview-wordmark font-display"
      role="img"
      :aria-label="name"
    >
      <span aria-hidden="true">{{ name }}</span>
    </div>
  </div>
</template>

<style scoped>
.preview-content {
  width: 100%;
  height: 100%;
  min-width: 0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-wordmark {
  display: grid;
  height: 100%;
  place-items: center;
  padding: 1.5rem;
  overflow-wrap: anywhere;
  font-size: 2rem;
}
</style>
