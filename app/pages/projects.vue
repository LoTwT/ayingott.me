<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue"
import { useHead, useSeoMeta } from "#imports"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"
import PlacedText from "~/components/doodle/PlacedText.vue"
import ProjectList from "~/components/projects/ProjectList.vue"
import { projects } from "~/data/projects"
import { githubProfileUrl, ownerName, siteOrigin } from "~/utils/profile"
import { projectsPage } from "~/utils/projects-page"
import { shareCardSeoMeta } from "~/utils/share-card-seo-meta"
import { contentLinkColor } from "~/utils/content-link-color"

const pageTitle = `${projectsPage.title} · ${ownerName}`
const canonicalUrl = `${siteOrigin}${projectsPage.path}`

useHead({ link: [{ rel: "canonical", href: canonicalUrl }] })
useSeoMeta({
  title: pageTitle,
  description: projectsPage.description,
  ogType: "website",
  ogSiteName: ownerName,
  ogTitle: pageTitle,
  ogDescription: projectsPage.description,
  ogUrl: canonicalUrl,
  ogLocale: "zh_CN",
  twitterTitle: pageTitle,
  twitterDescription: projectsPage.description,
  ...shareCardSeoMeta(`${siteOrigin}${projectsPage.shareImagePath}`, pageTitle),
})
</script>

<template>
  <main
    id="main-content"
    tabindex="-1"
    class="projects-page focus:outline-none"
  >
    <h1 class="font-display text-3xl leading-tight font-medium sm:text-4xl">
      <PlacedText :text="projectsPage.title" :delay="0" />
    </h1>
    <p class="projects-intro">{{ projectsPage.description }}</p>
    <ProjectList :projects="projects" class="projects-content" />
    <p class="projects-ending">
      更多项目，在
      <a
        :href="githubProfileUrl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Lo 的 GitHub（新标签页打开）"
        class="ending-link focus-ring"
        :style="{ '--content-link-color': contentLinkColor('profile:github') }"
      >
        GitHub <ArrowUpRight :size="16" aria-hidden="true" />
        <DoodleStroke shape="wave" class="ending-underline" />
      </a>
    </p>
  </main>
</template>

<style scoped>
.projects-page {
  padding-block: 2rem 4rem;
}

.projects-intro {
  margin-top: 0.75rem;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-muted);
}

.projects-content {
  margin-top: 3rem;
}

.projects-ending {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3.5rem;
  font-size: 0.9375rem;
  color: var(--text-muted);
}

.ending-link {
  position: relative;
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: var(--radius-control);
  color: var(--text-muted);
}

.ending-underline {
  bottom: 0.4375rem;
  left: 0;
  width: 100%;
  height: 0.375rem;
  stroke-width: 1.8;
  color: var(--content-link-color);
}

.ending-link:hover .ending-underline,
.ending-link:focus-visible .ending-underline {
  --doodle-offset: 0;
}

@media (min-width: 40rem) {
  .projects-page {
    padding-top: 3rem;
  }
}
</style>
