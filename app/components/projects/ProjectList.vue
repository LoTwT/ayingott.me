<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue"
import type { Project } from "~/data/projects"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"
import ProjectDescriptionText from "~/components/projects/ProjectDescriptionText.vue"
import ProjectPreview from "~/components/projects/ProjectPreview.vue"
import { contentLinkColor } from "~/utils/content-link-color"

defineProps<{ projects: readonly Project[] }>()
</script>

<template>
  <ol v-if="projects.length" class="project-list" role="list">
    <li
      v-for="(project, index) in projects"
      :key="project.id"
      class="project-list-item"
      :style="{ '--motion-order': index }"
    >
      <article class="project-entry" :aria-labelledby="`project-${project.id}`">
        <div class="project-preview">
          <span class="preview-tape" aria-hidden="true"></span>
          <ProjectPreview :name="project.name" :preview="project.preview" />
        </div>
        <div class="project-info">
          <p class="project-category text-(--text-muted)">
            <span class="font-mono" aria-hidden="true">{{
              String(index + 1).padStart(2, "0")
            }}</span>
            <span v-if="project.category">{{ project.category }}</span>
          </p>
          <h2 :id="`project-${project.id}`" class="project-name font-display">
            {{ project.name }}
          </h2>
          <p v-if="project.description?.length" class="project-description">
            <ProjectDescriptionText :phrases="project.description" />
          </p>
          <dl v-if="project.facts?.length" class="project-facts">
            <div v-for="fact in project.facts" :key="fact.label">
              <dt>{{ fact.label }}</dt>
              <dd>{{ fact.value }}</dd>
            </div>
          </dl>
          <ul v-if="project.links?.length" class="project-links" role="list">
            <li v-for="link in project.links" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`${project.name} · ${link.label}（新标签页打开）`"
                class="project-link focus-ring"
                :style="{
                  '--content-link-color': contentLinkColor(
                    `project:${project.id}`,
                  ),
                }"
              >
                {{ link.label }}
                <ArrowUpRight :size="16" aria-hidden="true" />
                <DoodleStroke shape="wave" class="link-underline" />
              </a>
            </li>
          </ul>
        </div>
      </article>
    </li>
  </ol>
  <p v-else class="text-(--text-muted)">还没有作品</p>
</template>

<style scoped>
.project-list {
  container: project-list / inline-size;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.project-entry {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: 1.5rem;
}

.project-preview {
  position: relative;
  width: 100%;
  max-width: 26rem;
  min-width: 0;
  aspect-ratio: 8 / 5;
  border: 1.5px solid var(--border-default);
  background: var(--surface-panel);
  box-shadow: 4px 4px 0 var(--brutal-shadow);
  transform: rotate(-0.65deg);
}

.project-list-item:nth-child(even) .project-preview {
  transform: rotate(0.5deg);
}

.preview-tape {
  position: absolute;
  z-index: 1;
  top: -0.625rem;
  left: 1.75rem;
  width: 4.5rem;
  height: 1.25rem;
  background: color-mix(in srgb, var(--brutal-yellow) 55%, transparent);
  clip-path: polygon(3% 0, 100% 4%, 96% 92%, 0 100%);
  transform: rotate(-6deg);
  pointer-events: none;
}

.project-list-item:nth-child(even) .preview-tape {
  right: 1.75rem;
  left: auto;
  background: color-mix(in srgb, var(--brutal-purple) 55%, transparent);
  transform: rotate(5deg);
}

.project-info {
  min-width: 0;
}

.project-category {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
}

.project-category .font-mono {
  font-size: 0.75rem;
}

.project-name {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.project-description {
  margin-top: 0.75rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.project-facts {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-muted);
}

.project-facts > div {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.project-facts dt {
  flex-shrink: 0;
}

.project-facts dd {
  min-width: 0;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin-top: 1rem;
}

.project-link {
  position: relative;
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: var(--radius-control);
  color: var(--text-primary);
}

.link-underline {
  bottom: 0.4375rem;
  left: 0;
  width: 100%;
  height: 0.375rem;
  stroke-width: 1.8;
  color: var(--content-link-color);
}

.project-link:hover .link-underline,
.project-link:focus-visible .link-underline {
  --doodle-offset: 0;
}

@container project-list (min-width: 38em) {
  .project-entry {
    grid-template-columns: minmax(0, 4fr) minmax(0, 5fr);
    gap: 2rem;
  }

  .project-preview {
    max-width: none;
  }

  .project-name {
    font-size: 1.75rem;
  }

  .project-description {
    font-size: 1.0625rem;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .project-list-item {
    --placed-rotation: -0.65deg;
    animation: dropped 520ms var(--ease-sticker) both;
    animation-delay: calc(min(var(--motion-order), 4) * 70ms + 120ms);
  }

  .project-preview {
    transition:
      transform 240ms var(--ease-sticker),
      box-shadow 240ms var(--ease-sticker);
  }

  .project-entry:focus-within .project-preview {
    transform: rotate(0);
    box-shadow: 6px 6px 0 var(--brutal-shadow);
  }
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .project-entry:hover .project-preview {
    transform: rotate(0);
    box-shadow: 6px 6px 0 var(--brutal-shadow);
  }
}
</style>
