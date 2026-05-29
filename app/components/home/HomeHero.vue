<script setup lang="ts">
import LoSignatureMark from "~/components/site/LoSignatureMark.vue"

defineProps<{
  tagline: string
  nowText?: string
}>()
</script>

<template>
  <header class="home-hero">
    <h1 id="home-title" class="home-hero__title" aria-label="Hi, I'm Lo.">
      <span class="home-hero__title-text" aria-hidden="true">Hi, I'm</span>
      <span class="home-hero__signature" aria-hidden="true">
        <LoSignatureMark />
      </span>
      <span class="home-hero__signature-period" aria-hidden="true">.</span>
      <span class="home-hero__emoji" aria-hidden="true">👋</span>
    </h1>

    <p class="home-hero__tagline">{{ tagline }}</p>
    <p v-if="nowText" class="home-hero__now">
      <span class="home-hero__now-label">现在</span>
      <span aria-hidden="true"> · </span>
      {{ nowText }}
    </p>
  </header>
</template>

<style scoped>
.home-hero {
  display: grid;
  justify-items: center;
  gap: var(--spacing-5);
  text-align: center;
}

.home-hero__title {
  max-width: 18ch;
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  line-height: 1.5;
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-tight);
}

.home-hero__title-text,
.home-hero__signature,
.home-hero__signature-period,
.home-hero__emoji {
  flex: 0 0 auto;
}

.home-hero__signature {
  display: inline-flex;
  margin-inline: 0.5rem;
  --lo-signature-width: 4.8rem;
  --lo-signature-height: 3.2rem;
  --lo-signature-stroke-width: 0.35;
}

.home-hero__signature-period {
  display: inline-block;
  margin-inline-end: 0.25rem;
}

.home-hero__emoji {
  display: inline-block;
  margin-inline-start: 0;
  transform-origin: 70% 70%;
  animation: home-emoji-wave 2.8s ease-in-out infinite;
}

.home-hero__tagline {
  max-width: 30rem;
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
}

.home-hero__now {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.home-hero__now-label {
  color: var(--text-accent);
}

@media (max-width: 720px) {
  .home-hero__title {
    max-width: 100%;
    font-size: var(--text-4xl);
    line-height: 1.5;
  }

  .home-hero__signature {
    margin-inline: 0.375rem;
    --lo-signature-width: 4.8rem;
    --lo-signature-height: 3.2rem;
    --lo-signature-stroke-width: 0.35;
  }
}

@keyframes home-emoji-wave {
  0%,
  42%,
  100% {
    transform: rotate(0deg);
  }

  6% {
    transform: rotate(14deg);
  }

  12% {
    transform: rotate(-8deg);
  }

  18% {
    transform: rotate(12deg);
  }

  24% {
    transform: rotate(-4deg);
  }

  30% {
    transform: rotate(6deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero__emoji {
    animation: none;
  }
}
</style>
