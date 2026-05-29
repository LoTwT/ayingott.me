<script setup lang="ts">
import { computed } from "vue"
import HomeContactList from "~/components/home/HomeContactList.vue"
import HomeHero from "~/components/home/HomeHero.vue"
import HomeSection from "~/components/home/HomeSection.vue"
import HomeWorkList from "~/components/home/HomeWorkList.vue"
import HomeWritingList from "~/components/home/HomeWritingList.vue"

definePageMeta({
  layout: "home",
})

async function queryRecentPosts() {
  return queryCollection("blog")
    .where("draft", "<>", true)
    .order("date", "DESC")
    .all()
}

const { data } = await useAsyncData("home-recent-posts", queryRecentPosts)
const { identity, nowText, contactLinks, featuredWorks } = useSiteContent()

const recentPosts = computed(() => (data.value ?? []).slice(0, 3))
const highlightedWorks = computed(() => featuredWorks.slice(0, 2))

useSiteSeo({
  title: "ayingott.me",
  ogTitle: "ayingott.me",
  description: "Lo 是开发者。",
  path: "/",
})
</script>

<template>
  <section class="home-page" aria-labelledby="home-title">
    <HomeHero :tagline="identity.homeTagline" :now-text="nowText" />

    <div class="home-page__sections">
      <HomeSection
        section-id="writing"
        label="最近写的 · Writing"
        title="最近写的"
        action-label="全部文章"
        action-to="/blog"
      >
        <HomeWritingList :posts="recentPosts" />
      </HomeSection>

      <HomeSection
        section-id="works-preview"
        label="在做的 · Works"
        title="在做的"
      >
        <HomeWorkList :items="highlightedWorks" />
      </HomeSection>

      <HomeSection section-id="elsewhere" label="联系 · Elsewhere" title="联系">
        <HomeContactList :links="contactLinks" />
      </HomeSection>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  width: min(100%, 52rem);
  min-height: calc(100svh - 160px);
  margin-inline: auto;
  display: grid;
  gap: clamp(var(--spacing-12), 9vw, var(--spacing-20));
  padding-block: clamp(var(--spacing-14), 14svh, 9rem) var(--spacing-12);
}

.home-page__sections {
  display: grid;
  gap: var(--spacing-12);
}

@media (max-width: 720px) {
  .home-page {
    min-height: auto;
    padding-block: var(--spacing-8);
  }
}
</style>
