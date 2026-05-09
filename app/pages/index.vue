<script setup lang="ts">
import ContactStrip from "~/components/site/ContactStrip.vue"
import LoSignatureMark from "~/components/site/LoSignatureMark.vue"

definePageMeta({
  layout: "home",
})

const { identity, nowText } = useSiteContent()

useSiteSeo({
  title: "ayingott.me",
  ogTitle: "ayingott.me",
  description: "Lo 是开发者。",
  path: "/",
})
</script>

<template>
  <section class="home-page" aria-labelledby="home-title">
    <div class="home-page__copy">
      <h1 id="home-title" class="home-page__title" aria-label="Hi, I'm Lo.">
        <span class="home-page__title-text">Hi, I'm</span>
        <span class="home-page__signature" aria-hidden="true"
          ><LoSignatureMark /></span
        ><span class="home-page__signature-period" aria-hidden="true">.</span>
        <span class="home-page__emoji" aria-hidden="true">👋</span>
      </h1>
      <p class="home-page__tagline">{{ identity.homeTagline }}</p>
    </div>

    <ul
      v-if="identity.interests.length"
      class="home-page__interests"
      aria-label="兴趣"
    >
      <li v-for="interest in identity.interests" :key="interest">
        {{ interest }}
      </li>
    </ul>

    <p v-if="nowText" class="home-page__now">{{ nowText }}</p>

    <ContactStrip />
  </section>
</template>

<style scoped>
.home-page {
  width: min(100%, var(--container-reading));
  min-height: calc(100svh - 160px);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-8);
  padding-block: clamp(var(--spacing-16), 18svh, 11rem) var(--spacing-12);
  text-align: center;
}

.home-page__copy {
  max-width: 640px;
  margin-inline: auto;
}

.home-page__title {
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

.home-page__signature {
  display: inline-flex;
  flex: 0 0 auto;
  margin-inline: 0.5rem;
  --lo-signature-width: 4.8rem;
  --lo-signature-height: 3.2rem;
  --lo-signature-stroke-width: 0.35;
}

.home-page__signature-period {
  display: inline-block;
  flex: 0 0 auto;
  margin-inline-end: 0;
}

.home-page__emoji {
  display: inline-block;
  flex: 0 0 auto;
  margin-inline-start: 0;
  transform-origin: 70% 70%;
  animation: home-emoji-wave 2.8s ease-in-out infinite;
}

.home-page__title-text {
  flex: 0 0 auto;
}

.home-page__tagline {
  max-width: 28rem;
  margin: var(--spacing-6) auto 0;
  color: var(--text-secondary);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
}

.home-page__interests {
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-3);
  list-style: none;
}

.home-page__interests li {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-control);
  padding: var(--spacing-2) var(--spacing-3);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}

.home-page__now {
  max-width: 40rem;
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

@media (max-width: 720px) {
  .home-page {
    min-height: auto;
    padding-block: var(--spacing-8);
  }

  .home-page__title {
    max-width: 100%;
    font-size: var(--text-4xl);
    line-height: 1.5;
  }

  .home-page__signature {
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
  .home-page__emoji {
    animation: none;
  }
}
</style>
