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
        Hi, I'm
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
  display: inline-block;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  line-height: var(--text-5xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-tight);
}

.home-page__signature {
  display: inline-flex;
  margin-inline: 0.04em 0.01em;
  vertical-align: -0.42em;
  --lo-signature-width: 4.65rem;
  --lo-signature-height: 3.1rem;
  --lo-signature-stroke-width: 0.36;
}

.home-page__signature-period {
  display: inline-block;
  animation: home-signature-period 8s linear infinite;
}

.home-page__emoji {
  display: inline-block;
  margin-inline-start: 0.12em;
  transform-origin: 70% 70%;
  animation: home-emoji-wave 2.8s ease-in-out infinite;
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
    max-width: 16ch;
    font-size: var(--text-4xl);
    line-height: var(--text-4xl--line-height);
  }

  .home-page__signature {
    --lo-signature-width: 3.75rem;
    --lo-signature-height: 2.5rem;
    --lo-signature-stroke-width: 0.34;
  }
}

@keyframes home-signature-period {
  0%,
  28% {
    opacity: 0;
  }

  32%,
  82% {
    opacity: 1;
  }

  95%,
  100% {
    opacity: 0;
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
  .home-page__signature-period,
  .home-page__emoji {
    animation: none;
  }

  .home-page__signature-period {
    opacity: 1;
  }
}
</style>
