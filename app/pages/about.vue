<script setup lang="ts">
import ContactLinkList from "~/components/site/ContactLinkList.vue"

const { identity, nowText, contactLinks } = useSiteContent()

const currentFocus = computed(
  () => nowText.value || "打磨 miru / yomu / ayingott.me",
)

const colophonGroups = computed(() => [
  {
    title: "现在在做",
    items: [currentFocus.value],
  },
  {
    title: "兴趣",
    items: identity.interests,
  },
  {
    title: "站点构建",
    items: ["Nuxt", "@ayingott/theme", "Cloudflare Pages"],
  },
])

useSiteSeo({
  title: "关于 · ayingott.me",
  ogTitle: "关于",
  description: "Lo 的个人说明和站点构建记录。",
  path: "/about",
})
</script>

<template>
  <section class="about-page" aria-labelledby="about-title">
    <header class="about-page__header">
      <p class="about-page__kicker">关于 · About</p>
      <h1 id="about-title" class="about-page__title">关于</h1>
      <p class="about-page__subtitle">{{ identity.aboutSubtitle }}</p>
    </header>

    <div class="about-page__layout">
      <article class="about-page__prose" aria-label="关于 Lo">
        <p v-for="paragraph in identity.aboutParagraphs" :key="paragraph">
          {{ paragraph }}
        </p>
      </article>

      <aside class="about-page__colophon" aria-label="Colophon">
        <div
          v-for="group in colophonGroups"
          :key="group.title"
          class="about-page__meta-group"
        >
          <h2 class="about-page__meta-title">{{ group.title }}</h2>
          <ul class="about-page__meta-list">
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="about-page__meta-group">
          <h2 class="about-page__meta-title">联系</h2>
          <ContactLinkList :links="contactLinks" />
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.about-page {
  width: min(100%, var(--container-wide));
  margin-inline: auto;
  display: grid;
  gap: var(--spacing-10);
}

.about-page__header {
  width: min(100%, var(--container-reading));
}

.about-page__kicker {
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

.about-page__kicker::before {
  content: "";
  width: 1.4rem;
  height: 2px;
  flex: 0 0 auto;
  background: var(--text-accent);
  opacity: 0.85;
}

.about-page__title {
  margin: var(--spacing-4) 0 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--text-4xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-normal);
}

.about-page__subtitle {
  margin: var(--spacing-3) 0 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.about-page__layout {
  display: grid;
  grid-template-columns: minmax(0, var(--container-reading)) minmax(
      13rem,
      16rem
    );
  gap: clamp(var(--spacing-8), 7vw, var(--spacing-16));
  align-items: start;
}

.about-page__prose {
  min-width: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  line-height: 1.8;
}

.about-page__prose p {
  margin: 0;
}

.about-page__prose p + p {
  margin-top: var(--spacing-6);
}

.about-page__colophon {
  display: grid;
  gap: var(--spacing-7);
  border-top: 1px solid var(--border-subtle);
  padding-top: var(--spacing-5);
}

.about-page__meta-group {
  display: grid;
  gap: var(--spacing-3);
}

.about-page__meta-title {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-normal);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.about-page__meta-list {
  display: grid;
  gap: var(--spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
  color: var(--text-primary);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

@media (max-width: 720px) {
  .about-page {
    gap: var(--spacing-8);
  }

  .about-page__layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-9);
  }

  .about-page__colophon {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-6);
  }
}

@media (max-width: 520px) {
  .about-page__title {
    font-size: var(--text-3xl);
    line-height: var(--text-3xl--line-height);
  }

  .about-page__prose {
    font-size: var(--text-base);
  }

  .about-page__colophon {
    grid-template-columns: 1fr;
  }
}
</style>
