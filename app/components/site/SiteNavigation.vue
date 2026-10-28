<script setup lang="ts">
import { computed } from "vue"
import { useError, useRoute } from "#imports"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"

const route = useRoute()
const error = useError()

const navigationLinks = [
  { label: "首页", href: "/", section: "home" },
  { label: "文章", href: "/posts", section: "posts" },
] as const

// Post and tag pages belong to the posts section; error pages have no current section.
const currentSection = computed(() => {
  if (error.value) return undefined
  if (route.path === "/") return "home"
  if (/^\/(?:posts|tags)(?:\/|$)/.test(route.path)) return "posts"
  return undefined
})
</script>

<template>
  <nav aria-label="站点导航">
    <ul class="flex items-center gap-6">
      <li v-for="link in navigationLinks" :key="link.href">
        <NuxtLink
          :to="link.href"
          :aria-current="currentSection === link.section ? 'page' : undefined"
          class="navigation-link relative inline-flex min-h-11 items-center rounded-(--radius-control) text-base text-(--text-muted) focus-ring hover:text-(--text-secondary) aria-[current=page]:text-(--text-primary)"
        >
          {{ link.label }}
          <DoodleStroke shape="underline" class="navigation-underline" />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navigation-underline {
  bottom: 6px;
  left: -4px;
  width: calc(100% + 8px);
  height: 9px;
  stroke-width: 2.2;
  color: var(--brutal-orange);
}

/* Hovering another section previews about half of its stroke. */
.navigation-link:not([aria-current="page"]):hover .navigation-underline {
  --doodle-offset: 0.55;
}

/* The current section is drawn on load and whenever it becomes current; the previous one is wiped out by the transition. */
.navigation-link[aria-current="page"] .navigation-underline {
  --doodle-offset: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .navigation-link[aria-current="page"] .navigation-underline :deep(path) {
    animation: doodle-draw 420ms var(--ease-draw) 80ms both;
  }
}
</style>
