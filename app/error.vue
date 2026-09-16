<script setup lang="ts">
import type { NuxtError } from "#app"
import { computed } from "vue"
import { useSeoMeta } from "#imports"
import SiteFrame from "~/components/site/SiteFrame.vue"

const props = defineProps<{ error: NuxtError }>()
const message = computed(() =>
  props.error.statusCode === 404 ? "这里还没有页面。" : "页面暂时无法打开。",
)

useSeoMeta({
  title: () => `${message.value} · Lo`,
  robots: "noindex, nofollow",
})
</script>

<template>
  <SiteFrame>
    <main id="main-content" class="mb-24 flex flex-1 items-center py-20">
      <div class="space-y-5">
        <p class="font-mono text-sm text-(--text-muted)">
          {{ error.statusCode }}
        </p>
        <h1 class="font-display text-3xl font-medium">{{ message }}</h1>
        <a
          href="/"
          class="inline-flex min-h-11 items-center underline underline-offset-4"
        >
          回到首页
        </a>
      </div>
    </main>
  </SiteFrame>
</template>
