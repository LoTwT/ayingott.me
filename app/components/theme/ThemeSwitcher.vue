<script setup lang="ts">
import { Monitor, Moon, Sun } from "@lucide/vue"
import { computed, watchEffect } from "vue"
import { useColorMode } from "#imports"

const themeOptions = [
  { value: "system", label: "跟随系统", icon: Monitor },
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
] as const

const colorMode = useColorMode()
const currentTheme = computed(
  () =>
    themeOptions.find((option) => option.value === colorMode.preference) ??
    themeOptions[0],
)
const nextTheme = computed(
  () =>
    themeOptions[themeOptions.indexOf(currentTheme.value) + 1] ??
    themeOptions[0],
)
const buttonLabel = computed(() =>
  colorMode.unknown
    ? "主题正在加载"
    : `切换主题，当前：${currentTheme.value.label}；点击切换为${nextTheme.value.label}`,
)

if (import.meta.client) {
  watchEffect(() => {
    if (!colorMode.unknown) {
      document.documentElement.dataset.themePreference = colorMode.preference
    }
  })
}

function cycleTheme() {
  colorMode.preference = nextTheme.value.value
}
</script>

<template>
  <button
    type="button"
    :disabled="colorMode.unknown"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    class="flex size-11 cursor-pointer items-center justify-center rounded-(--radius-control) text-(--text-secondary) focus-ring hover:text-(--text-primary)"
    @click="cycleTheme"
  >
    <component
      :is="option.icon"
      v-for="option in themeOptions"
      :key="option.value"
      :data-theme-icon="option.value"
      :size="20"
      class="theme-icon"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.theme-icon {
  display: none;
}

html:not([data-theme-preference="light"]):not([data-theme-preference="dark"])
  .theme-icon[data-theme-icon="system"],
html[data-theme-preference="light"] .theme-icon[data-theme-icon="light"],
html[data-theme-preference="dark"] .theme-icon[data-theme-icon="dark"] {
  display: block;
}
</style>
