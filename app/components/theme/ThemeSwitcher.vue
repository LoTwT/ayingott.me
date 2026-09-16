<script setup lang="ts">
import { Monitor, Moon, Sun } from "@lucide/vue"
import { computed } from "vue"
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
const buttonLabel = computed(
  () =>
    `切换主题，当前：${currentTheme.value.label}；点击切换为${nextTheme.value.label}`,
)

function cycleTheme() {
  colorMode.preference = nextTheme.value.value
}
</script>

<template>
  <ColorScheme tag="div" class="size-11">
    <template #placeholder>
      <button
        type="button"
        disabled
        aria-label="主题正在加载"
        class="flex size-11 items-center justify-center text-(--text-secondary)"
      >
        <Monitor :size="20" aria-hidden="true" />
      </button>
    </template>
    <button
      type="button"
      :aria-label="buttonLabel"
      :title="buttonLabel"
      class="flex size-11 cursor-pointer items-center justify-center rounded-(--radius-control) text-(--text-secondary) focus-ring hover:text-(--text-primary)"
      @click="cycleTheme"
    >
      <component :is="currentTheme.icon" :size="20" aria-hidden="true" />
    </button>
  </ColorScheme>
</template>
