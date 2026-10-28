<script setup lang="ts">
import { ArrowUp } from "@lucide/vue"
import { onBeforeUnmount, shallowRef, watch } from "vue"

const props = defineProps<{ observedTitle: HTMLElement | null }>()

const isTitleOutOfView = shallowRef(false)
let titleObserver: IntersectionObserver | undefined

watch(
  () => props.observedTitle,
  (title) => {
    titleObserver?.disconnect()
    if (!title) return
    titleObserver = new IntersectionObserver(([entry]) => {
      isTitleOutOfView.value = !entry!.isIntersecting
    })
    titleObserver.observe(title)
  },
  { flush: "post" },
)

onBeforeUnmount(() => titleObserver?.disconnect())

function scrollToTop() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  })
  document.getElementById("main-content")?.focus({ preventScroll: true })
}
</script>

<template>
  <button
    type="button"
    aria-label="回到顶部"
    title="回到顶部"
    :data-visible="isTitleOutOfView"
    class="back-to-top fixed right-6 bottom-6 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-(--surface-elevated) text-(--text-secondary) shadow-(--shadow-md) focus-ring hover:text-(--text-primary) sm:right-10 sm:bottom-10"
    @click="scrollToTop"
  >
    <ArrowUp
      :size="20"
      :stroke-width="2"
      class="back-to-top-arrow"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.back-to-top {
  border: 1px solid color-mix(in srgb, var(--text-primary) 14%, transparent);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 180ms ease-out,
    visibility 0s linear 180ms;
}

.back-to-top[data-visible="true"] {
  opacity: 1;
  visibility: visible;
  transition:
    opacity 180ms ease-out,
    visibility 0s;
}

/* The arrow hops up once, as if about to fly back to the top. */
@media (prefers-reduced-motion: no-preference) {
  .back-to-top:hover .back-to-top-arrow {
    animation: hop 520ms var(--ease-out-soft);
  }
}

@keyframes hop {
  30% {
    translate: 0 -5px;
    rotate: -6deg;
  }

  60% {
    translate: 0 1px;
    rotate: 3deg;
  }
}
</style>
