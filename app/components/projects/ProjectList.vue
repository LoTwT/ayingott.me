<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue"
import type { Project } from "~/data/projects"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"
import ProjectDescriptionText from "~/components/projects/ProjectDescriptionText.vue"
import ProjectPreview from "~/components/projects/ProjectPreview.vue"
import { useTapedCardMotion } from "~/composables/useTapedCardMotion"
import { contentLinkColor } from "~/utils/content-link-color"

defineProps<{ projects: readonly Project[] }>()

const { trackCardPointer, resetCardPointer } = useTapedCardMotion()
</script>

<template>
  <ol v-if="projects.length" class="project-list" role="list">
    <li
      v-for="(project, index) in projects"
      :key="project.id"
      class="project-list-item"
      :style="{ '--motion-order': index }"
    >
      <article
        class="project-entry"
        :aria-labelledby="`project-${project.id}`"
        :style="{
          '--content-link-color': contentLinkColor(`project:${project.id}`),
        }"
      >
        <div
          class="project-preview"
          @pointerenter="trackCardPointer"
          @pointermove="trackCardPointer"
          @pointerleave="resetCardPointer"
          @pointercancel="resetCardPointer"
        >
          <div class="preview-paper">
            <ProjectPreview :name="project.name" :preview="project.preview" />
          </div>
          <span class="preview-tape" aria-hidden="true"></span>
        </div>
        <div class="project-info">
          <p class="project-category text-(--text-muted)">
            <span class="project-number font-mono" aria-hidden="true">{{
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
  --tape-color: var(--brutal-yellow);
  --tape-anchor: 4rem;
  --paper-hover-turn: 0.45deg;
  position: relative;
  width: 100%;
  max-width: 26rem;
  min-width: 0;
  aspect-ratio: 8 / 5;
  perspective: 850px;
  transform: rotate(-0.65deg);
}

.preview-paper {
  --paper-lift: 0;
  position: absolute;
  inset: 0;
  border: 1.5px solid var(--border-default);
  background: var(--surface-panel);
  /* Keep the item cue crisp, then soften the shadow as the card lifts. */
  box-shadow:
    calc(4px + 5px * var(--paper-lift)) calc(4px + 5px * var(--paper-lift))
      calc(3px * var(--paper-lift) * var(--paper-lift))
      color-mix(
        in srgb,
        var(--brutal-shadow)
          calc(100% - 40% * var(--paper-lift) * var(--paper-lift)),
        transparent
      ),
    0 calc(3px + 10px * var(--paper-lift))
      calc(6px + 14px * var(--paper-lift)) -4px
      color-mix(
        in srgb,
        var(--brutal-shadow) calc(var(--paper-lift) * 20%),
        transparent
      );
  transform-origin: var(--tape-anchor) 0;
}

.project-list-item:nth-child(even) .project-preview {
  --tape-color: var(--brutal-purple);
  --tape-anchor: calc(100% - 4rem);
  --paper-hover-turn: -0.35deg;
  transform: rotate(0.5deg);
}

.preview-tape {
  /* A warm paper base softens the denser pigment in both themes. */
  --tape-paper-color: color-mix(in srgb, var(--tape-color) 55%, #f5ecd9);
  position: absolute;
  z-index: 1;
  top: -0.625rem;
  left: 1.75rem;
  width: 4.5rem;
  height: 1.375rem;
  filter: drop-shadow(0 0.75px 0.5px rgb(34 25 16 / 16%));
  transform: rotate(-6deg);
  pointer-events: none;
}

.preview-tape::before {
  position: absolute;
  inset: 0;
  content: "";
  background-color: var(--tape-paper-color);
  background-image:
    url("/textures/paper-tape-grain.svg"),
    linear-gradient(
      174deg,
      rgb(255 255 255 / 12%),
      transparent 38%,
      rgb(52 35 18 / 5%) 62%,
      transparent 76%
    );
  background-size:
    8rem 2rem,
    100% 100%;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 20%),
    inset 0 -1px 0 rgb(52 35 18 / 8%);
  clip-path: polygon(
    2% 2%,
    19% 0,
    43% 3%,
    68% 1%,
    99% 4%,
    98% 11%,
    99% 17%,
    98% 24%,
    99% 31%,
    97% 43%,
    98% 50%,
    97% 61%,
    98% 69%,
    96% 81%,
    97% 88%,
    96% 98%,
    73% 96%,
    48% 100%,
    23% 97%,
    0 99%,
    2% 89%,
    1% 81%,
    2% 72%,
    1% 67%,
    3% 54%,
    2% 47%,
    3% 38%,
    2% 28%,
    4% 14%,
    2% 7%
  );
}

.project-list-item:nth-child(even) .preview-tape {
  right: 1.75rem;
  left: auto;
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

.project-number {
  position: relative;
  isolation: isolate;
  font-size: 0.75rem;
}

.project-number::before {
  position: absolute;
  z-index: -1;
  right: -0.25em;
  bottom: 0.05em;
  left: -0.25em;
  height: 0.65em;
  background: color-mix(in srgb, var(--content-link-color) 24%, transparent);
  clip-path: polygon(1% 12%, 98% 0, 100% 86%, 3% 100%);
  content: "";
  opacity: 0;
  transform: scaleX(0.3);
  transform-origin: left center;
}

.project-entry:focus-within .project-number {
  color: var(--text-primary);
}

.project-entry:focus-within .project-number::before {
  opacity: 1;
  transform: scaleX(1);
}

.project-entry:focus-within .preview-paper {
  --paper-lift: 0.35;
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

  .preview-paper {
    /* Both hover levels continue the same gesture instead of introducing a new tilt. */
    transform: rotateX(var(--paper-pitch, calc(var(--paper-lift) * 2.4deg)))
      rotateY(var(--paper-yaw, 0deg))
      rotateZ(
        var(--paper-turn, calc(var(--paper-lift) * var(--paper-hover-turn)))
      );
    transition:
      transform 380ms var(--ease-sticker),
      box-shadow 380ms var(--ease-sticker);
  }

  .project-entry:focus-within .preview-paper {
    transition-duration: 180ms;
    transition-timing-function: cubic-bezier(0.2, 0.65, 0.3, 1);
  }

  .project-name {
    transition: translate 180ms ease-out;
  }

  .project-number {
    transition: color 180ms ease-out;
  }

  .project-number::before {
    transition:
      opacity 180ms ease-out,
      transform 220ms var(--ease-sticker);
  }

  .project-entry:focus-within .project-name {
    translate: 2px 0;
  }
}

@media (hover: hover) and (pointer: fine) {
  .project-entry:hover .project-number {
    color: var(--text-primary);
  }

  .project-entry:hover .project-number::before {
    opacity: 1;
    transform: scaleX(1);
  }

  .project-entry:hover .preview-paper {
    --paper-lift: 0.35;
  }

  .project-preview:hover .preview-paper {
    --paper-lift: 1;
  }
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .project-entry:hover .project-name {
    translate: 2px 0;
  }

  .project-entry:hover .preview-paper {
    transition-duration: 180ms;
    transition-timing-function: cubic-bezier(0.2, 0.65, 0.3, 1);
  }

  .project-preview:hover .preview-paper {
    --paper-lift: var(--pointer-lift, 1);
    --paper-pitch: var(--pointer-pitch, 2.4deg);
    --paper-yaw: var(--pointer-yaw, 0deg);
    --paper-turn: var(
      --pointer-turn,
      calc(var(--paper-lift) * var(--paper-hover-turn))
    );
    transition-duration: 220ms;
  }

  .project-preview[data-pointer-following]:hover .preview-paper {
    transition-duration: 140ms;
  }
}
</style>
