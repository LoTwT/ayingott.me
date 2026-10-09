<script setup lang="ts">
import type { NuxtError } from "#app"
import { ArrowLeft } from "@lucide/vue"
import { computed } from "vue"
import { useSeoMeta } from "#imports"
import SiteFrame from "~/components/site/SiteFrame.vue"
import { ownerName } from "~/utils/profile"

const props = defineProps<{ error: NuxtError }>()
const message = computed(() =>
  props.error.status === 404 ? "这里还没有页面" : "页面暂时无法打开",
)

useSeoMeta({
  title: () => `${message.value} · ${ownerName}`,
  robots: "noindex, nofollow",
})
</script>

<template>
  <SiteFrame>
    <main
      id="main-content"
      tabindex="-1"
      class="mb-24 flex flex-1 items-center py-20 focus:outline-none"
    >
      <div>
        <p class="theme-color-transition font-mono text-sm text-(--text-muted)">
          {{ error.status }}
        </p>
        <h1
          class="theme-color-transition mt-2 font-display text-3xl leading-tight font-medium sm:text-4xl"
        >
          {{ message }}
        </h1>
        <a
          href="/"
          class="return-home-link mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-control) text-(--text-muted) no-underline focus-ring hover:text-(--text-secondary)"
        >
          <ArrowLeft
            class="return-home-arrow size-4"
            :stroke-width="2"
            aria-hidden="true"
          />
          回到首页
        </a>
      </div>
    </main>
  </SiteFrame>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .return-home-arrow {
    transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .return-home-link:hover .return-home-arrow,
  .return-home-link:focus-visible .return-home-arrow {
    transform: translateX(-2px);
  }
}
</style>
