<script setup lang="ts">
import { computed } from "vue"
import { useError, useRoute } from "#imports"

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
          class="inline-flex min-h-11 items-center rounded-(--radius-control) text-base text-(--text-muted) focus-ring hover:text-(--text-secondary) aria-[current=page]:text-(--text-primary)"
        >
          {{ link.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
