<script setup lang="ts">
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"
import PlacedText from "~/components/doodle/PlacedText.vue"
import HomeLinks from "~/components/home/HomeLinks.vue"
import { ownerName } from "~/utils/profile"
</script>

<template>
  <section
    aria-labelledby="introduction-title"
    class="home-introduction flex items-center"
  >
    <div>
      <h1
        id="introduction-title"
        class="font-display text-4xl leading-tight font-medium sm:text-5xl"
      >
        <PlacedText text="你好，我是 " />
        <!-- The name is the signature: a highlighter stroke underneath and a small sparkle, drawn once the greeting has landed. -->
        <span class="introduction-name wobble-on-hover">
          <DoodleStroke shape="marker" class="introduction-name-marker" />
          <span class="wobble-target inline-block">{{ ownerName }}</span>
          <DoodleStroke shape="sparkle" class="introduction-name-sparkle" />
        </span>
      </h1>
      <HomeLinks class="mt-1.5" />
    </div>
  </section>
</template>

<style scoped>
.home-introduction {
  min-block-size: calc(
    100dvh - var(--site-header-height) - var(--site-footer-height)
  );
  padding-block: 3rem calc(9rem + 8dvh - var(--site-footer-height));
}

@media (max-height: 28rem) {
  .home-introduction {
    align-items: flex-start;
    padding-block: 1.5rem;
  }
}

.introduction-name {
  position: relative;
  display: inline-block;
  isolation: isolate;
}

.introduction-name-marker {
  --doodle-offset: 0;
  bottom: 0.02em;
  left: -0.12em;
  z-index: -1;
  width: calc(100% + 0.24em);
  height: 0.6em;
  stroke: var(--brutal-yellow);
  stroke-width: 11;
  opacity: 0.85;
  mix-blend-mode: multiply;
}

.introduction-name-sparkle {
  --doodle-offset: 0;
  top: -0.12em;
  right: -0.62em;
  width: 0.5em;
  height: 0.42em;
  stroke-width: 2.2;
  color: var(--brutal-pink);
}

html.dark .introduction-name-marker {
  opacity: 0.32;
  mix-blend-mode: normal;
}

@media (prefers-reduced-motion: no-preference) {
  .introduction-name-marker :deep(path) {
    animation: doodle-draw 560ms var(--ease-draw) 600ms both;
  }

  .introduction-name-sparkle :deep(path) {
    animation: doodle-draw 300ms var(--ease-draw) 960ms both;
  }
}
</style>
