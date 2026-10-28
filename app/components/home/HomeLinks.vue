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
    openInNewTab: false,
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
    <ul class="flex items-center gap-2">
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
          class="contact-link wobble-on-hover relative flex size-9 items-center justify-center rounded-(--radius-control) text-(--text-muted) focus-ring hover:text-(--text-secondary)"
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
.contact-link-ring {
  inset: -4px;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  /* Inherits the link color, so the ring matches the icon in every state. */
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
