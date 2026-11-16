<script setup lang="ts">
import { FileText, Mail } from "@lucide/vue"
import githubMarkUrl from "~/assets/icons/github.svg?inline"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"
import { burstAround } from "~/utils/doodle-burst"
import {
  contactEmailAddress,
  githubProfileUrl,
  githubUsername,
} from "~/utils/profile"

const githubMaskImage = `url("${githubMarkUrl}")`

const links = [
  {
    label: `GitHub：${githubUsername}`,
    href: githubProfileUrl,
    icon: "github",
    openInNewTab: true,
  },
  {
    label: `邮箱：${contactEmailAddress}`,
    href: `mailto:${contactEmailAddress}`,
    icon: "mail",
    openInNewTab: false,
  },
  {
    label: "简历（PDF）",
    href: "/resume.pdf",
    icon: "resume",
    openInNewTab: true,
  },
] as const
</script>

<template>
  <nav aria-label="联系方式与简历">
    <ul class="flex flex-wrap items-center gap-2">
      <li
        v-for="(link, index) in links"
        :key="link.href"
        class="contact-link-item"
        :style="{ '--motion-order': index }"
      >
        <a
          :href="link.href"
          :target="link.openInNewTab ? '_blank' : undefined"
          :rel="link.openInNewTab ? 'noopener noreferrer' : undefined"
          :aria-label="
            link.openInNewTab ? `${link.label}，在新标签页打开` : link.label
          "
          :title="link.label"
          class="contact-link wobble-on-hover relative flex size-11 items-center justify-center rounded-(--radius-control) focus-ring"
          :class="`contact-link--${link.icon}`"
          @click="burstAround($event.currentTarget as Element)"
        >
          <span
            class="wobble-target grid place-items-center"
            aria-hidden="true"
          >
            <span
              v-if="link.icon === 'github'"
              class="size-5.5 bg-current mask-contain mask-center mask-no-repeat"
              :style="{ maskImage: githubMaskImage }"
            />
            <Mail
              v-else-if="link.icon === 'mail'"
              class="size-6"
              :stroke-width="2"
            />
            <FileText v-else class="size-6" :stroke-width="2" />
          </span>
          <!-- Each ring starts at a different angle, so the three do not look stamped. -->
          <DoodleStroke
            shape="ring"
            class="contact-link-ring"
            :style="{ rotate: `${index * 120}deg` }"
          />
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.contact-link {
  color: var(--text-muted);
}

.contact-link:hover,
.contact-link:focus-visible {
  color: var(--text-secondary);
}

.contact-link--github {
  --contact-ring-color: var(--content-link-coral);
}

.contact-link--mail {
  --contact-ring-color: var(--content-link-berry);
}

.contact-link--resume {
  --contact-ring-color: var(--content-link-violet);
}

.contact-link-ring {
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--contact-ring-color);
  stroke-width: 1.6;
}

.contact-link:hover .contact-link-ring,
.contact-link:focus-visible .contact-link-ring {
  --doodle-offset: 0;
}

/* The icons land after the greeting. */
@media (prefers-reduced-motion: no-preference) {
  .contact-link-item {
    --placed-rotation: 8deg;
    animation: placed 480ms var(--ease-sticker) both;
    animation-delay: calc(var(--motion-order) * 70ms + 720ms);
  }
}
</style>
