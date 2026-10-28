<script setup lang="ts">
import type { NuxtError } from "#app"
import { computed } from "vue"
import { useSeoMeta } from "#imports"
import SiteBackLink from "~/components/site/SiteBackLink.vue"
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
        <p class="font-mono text-sm text-(--text-muted)">
          {{ error.status }}
        </p>
        <h1
          class="mt-2 font-display text-3xl leading-tight font-medium sm:text-4xl"
        >
          {{ message }}
        </h1>
        <SiteBackLink to="/" external class="mt-1">回到首页</SiteBackLink>
      </div>
    </main>
  </SiteFrame>
</template>
