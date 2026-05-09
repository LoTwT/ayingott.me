<script setup lang="ts">
import ContactStrip from "~/components/site/ContactStrip.vue"

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
      <p class="home-page__eyebrow">ayingott.me</p>
      <h1 id="home-title" class="home-page__title">
        Hi, I'm {{ identity.displayName }}.
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
  justify-content: center;
  gap: var(--spacing-8);
}

.home-page__copy {
  position: relative;
  max-width: 640px;
}

.home-page__eyebrow {
  margin: 0 0 var(--spacing-5);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.home-page__title {
  max-width: 12ch;
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  line-height: var(--text-5xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-tight);
}

.home-page__tagline {
  max-width: 28rem;
  margin: var(--spacing-6) 0 0;
  color: var(--text-secondary);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
}

.home-page__interests {
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
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
    max-width: 10ch;
    font-size: var(--text-4xl);
    line-height: var(--text-4xl--line-height);
  }
}
</style>
