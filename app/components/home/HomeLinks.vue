<script setup lang="ts">
import { FileText, Mail } from "@lucide/vue"
import githubMark from "~/assets/icons/github.svg?no-inline"

const links = [
  {
    label: "GitHub：LoTwT",
    href: "https://github.com/LoTwT",
    icon: "github",
    openInNewTab: false,
  },
  {
    label: "邮箱：hi@ayingott.me",
    href: "mailto:hi@ayingott.me",
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
      <li v-for="link in links" :key="link.href">
        <a
          :href="link.href"
          :target="link.openInNewTab ? '_blank' : undefined"
          :rel="link.openInNewTab ? 'noopener noreferrer' : undefined"
          :aria-label="
            link.openInNewTab ? `${link.label}，在新标签页打开` : link.label
          "
          :title="link.label"
          class="flex size-9 items-center justify-center rounded-(--radius-control) text-(--text-muted) focus-ring hover:text-(--text-secondary)"
        >
          <span
            v-if="link.icon === 'github'"
            aria-hidden="true"
            class="size-5.5 bg-current mask-contain mask-center mask-no-repeat"
            :style="{ maskImage: `url(${githubMark})` }"
          />
          <Mail
            v-else-if="link.icon === 'mail'"
            class="size-6"
            :stroke-width="2"
            aria-hidden="true"
          />
          <FileText
            v-else
            class="size-6"
            :stroke-width="2"
            aria-hidden="true"
          />
        </a>
      </li>
    </ul>
  </nav>
</template>
