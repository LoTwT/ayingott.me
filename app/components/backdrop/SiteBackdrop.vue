<script setup lang="ts">
import CrayonWallpaper from "./CrayonWallpaper.vue"
import DoodleBuddy from "./DoodleBuddy.vue"
</script>

<template>
  <div class="site-backdrop">
    <CrayonWallpaper />
  </div>
  <!-- The buddy takes clicks, so it lives in a layer above the page instead of beneath it. -->
  <div class="site-foreground">
    <DoodleBuddy />
  </div>
</template>

<style scoped>
.site-backdrop,
.site-foreground {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.site-backdrop {
  z-index: -1;
}

.site-foreground {
  z-index: 30;
}

@media print {
  .site-backdrop,
  .site-foreground {
    display: none;
  }
}
</style>
