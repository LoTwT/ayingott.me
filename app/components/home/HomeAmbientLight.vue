<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from "vue"

const isDocumentHidden = shallowRef(false)

function syncDocumentVisibility() {
  isDocumentHidden.value = document.hidden
}

onMounted(() => {
  syncDocumentVisibility()
  document.addEventListener("visibilitychange", syncDocumentVisibility)
})

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", syncDocumentVisibility)
})
</script>

<template>
  <div
    class="home-ambient-light"
    :class="{ 'is-paused': isDocumentHidden }"
    aria-hidden="true"
  >
    <div class="ambient-beam" />
  </div>
</template>

<style scoped>
.home-ambient-light {
  --ambient-beam-shadow: color-mix(
    in srgb,
    var(--color-neutral-600) 32%,
    transparent
  );
  position: fixed;
  z-index: -1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.ambient-beam {
  position: absolute;
  inset: -50%;
  opacity: 0.82;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    transparent 32%,
    var(--ambient-beam-shadow) 42%,
    var(--ambient-beam-shadow) 44%,
    var(--color-neutral-50) 49%,
    var(--color-neutral-50) 54%,
    transparent 66%
  );
}

html.dark .ambient-beam {
  opacity: 0.08;
}

@media (prefers-reduced-motion: no-preference) {
  .ambient-beam {
    animation: ambient-beam-drift 18s ease-in-out -6s infinite alternate;
  }

  html[data-theme-transition="page"] .ambient-beam {
    transition: opacity 600ms cubic-bezier(0.45, 0, 0.55, 1);
  }
}

.is-paused .ambient-beam {
  animation-play-state: paused;
}

@keyframes ambient-beam-drift {
  from {
    transform: translate3d(-10vw, -6vh, 0);
  }
  to {
    transform: translate3d(10vw, 6vh, 0);
  }
}
</style>
