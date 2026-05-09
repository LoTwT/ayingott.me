<script setup lang="ts">
import PageTitle from "~/components/site/PageTitle.vue"

const { identity } = useSiteContent()

useSiteSeo({
  title: "关于 · ayingott.me",
  ogTitle: "关于",
  description: "Lo 是开发者。",
  path: "/about",
})
</script>

<template>
  <section class="about-page" aria-labelledby="about-title">
    <PageTitle
      heading-id="about-title"
      title="关于"
      :subtitle="identity.aboutSubtitle"
    />

    <div class="about-page__prose">
      <p v-for="paragraph in identity.aboutParagraphs" :key="paragraph">
        {{ paragraph }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.about-page {
  width: min(100%, var(--container-wide));
  margin-inline: auto;
  display: grid;
  gap: var(--spacing-12);
  justify-items: center;
  text-align: center;
}

.about-page__prose {
  max-width: var(--container-reading);
  color: var(--text-primary);
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
}

.about-page__prose p {
  margin: 0;
}

.about-page__prose p + p {
  margin-top: var(--spacing-6);
}
</style>
