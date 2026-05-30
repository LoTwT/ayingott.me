<script setup lang="ts">
import WorksProjectList from "~/components/works/WorksProjectList.vue"

const { featuredWorks } = useSiteContent()

const activeWorks = computed(() =>
  featuredWorks.filter((item) => item.status === "active"),
)
const publishedWorks = computed(() =>
  featuredWorks.filter((item) => item.status === "published"),
)

useSiteSeo({
  title: "作品 · ayingott.me",
  ogTitle: "作品",
  description: "Lo 正在做和已经发布的项目索引。",
  path: "/works",
})
</script>

<template>
  <section class="works-page" aria-labelledby="works-title">
    <header class="works-page__header">
      <p class="works-page__kicker">作品 · Works</p>
      <h1 id="works-title" class="works-page__title">作品</h1>
      <p class="works-page__intro">
        一些正在打磨或已经发布的项目。这里像索引一样保留入口，方便回到真实作品本身。
      </p>
    </header>

    <div class="works-page__sections">
      <section
        v-if="activeWorks.length"
        class="works-page__section"
        aria-labelledby="active-works-title"
      >
        <h2 id="active-works-title" class="works-page__section-title">
          在做的
        </h2>
        <WorksProjectList :items="activeWorks" />
      </section>

      <section
        v-if="publishedWorks.length"
        class="works-page__section"
        aria-labelledby="published-works-title"
      >
        <h2 id="published-works-title" class="works-page__section-title">
          已发布
        </h2>
        <WorksProjectList :items="publishedWorks" />
      </section>
    </div>
  </section>
</template>

<style scoped>
.works-page {
  width: min(100%, 52rem);
  margin-inline: auto;
  display: grid;
  gap: var(--spacing-10);
}

.works-page__header {
  display: grid;
}

.works-page__kicker {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-3);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.works-page__kicker::before {
  content: "";
  width: 1.4rem;
  height: 2px;
  flex: 0 0 auto;
  background: var(--text-accent);
  opacity: 0.85;
}

.works-page__title {
  margin: var(--spacing-4) 0 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--text-4xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-normal);
}

.works-page__intro {
  max-width: var(--container-reading);
  margin: var(--spacing-5) 0 0;
  color: var(--text-muted);
  font-size: var(--text-lg);
  line-height: 1.8;
}

.works-page__sections {
  display: grid;
  gap: var(--spacing-10);
}

.works-page__section {
  display: grid;
  gap: var(--spacing-4);
}

.works-page__section-title {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-normal);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 520px) {
  .works-page {
    gap: var(--spacing-8);
  }

  .works-page__title {
    font-size: var(--text-3xl);
    line-height: var(--text-3xl--line-height);
  }

  .works-page__intro {
    font-size: var(--text-base);
  }
}
</style>
