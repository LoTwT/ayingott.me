<script setup lang="ts">
import { Monitor, Moon, Sun } from "@lucide/vue"
import { computed, nextTick, onBeforeUnmount, watchEffect } from "vue"
import { useColorMode } from "#imports"

const themeOptions = [
  { value: "system", label: "跟随系统", icon: Monitor },
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
] as const

const colorMode = useColorMode()
// Long enough for the icon swap; the page reveal ends with its view transition.
const iconTransitionDuration = 560
let iconTransitionTimeout: number | undefined
let themeViewTransition: ViewTransition | undefined

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

onBeforeUnmount(finishThemeTransition)

function finishThemeTransition() {
  window.clearTimeout(iconTransitionTimeout)
  themeViewTransition?.skipTransition()
  themeViewTransition = undefined
  delete document.documentElement.dataset.themeTransition
}

function cycleTheme(event: MouseEvent) {
  const root = document.documentElement
  const preference = nextTheme.value.value
  const resolvedTheme =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference

  finishThemeTransition()

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    colorMode.preference = preference
    return
  }

  // Only the icon changes when the page stays light or dark, or the browser cannot reveal it.
  if (resolvedTheme === colorMode.value || !document.startViewTransition) {
    root.dataset.themeTransition = "icon"
    colorMode.preference = preference
    iconTransitionTimeout = window.setTimeout(
      finishThemeTransition,
      iconTransitionDuration,
    )
    return
  }

  // The new theme spreads out from the button like ink until it covers the farthest corner.
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const originX = bounds.left + bounds.width / 2
  const originY = bounds.top + bounds.height / 2
  const radius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY),
  )
  root.style.setProperty("--theme-reveal-x", `${originX}px`)
  root.style.setProperty("--theme-reveal-y", `${originY}px`)
  root.style.setProperty("--theme-reveal-radius", `${radius}px`)
  root.dataset.themeTransition = "page"

  const transition = document.startViewTransition(async () => {
    colorMode.preference = preference
    await nextTick()
  })
  themeViewTransition = transition
  transition.finished.finally(() => {
    if (themeViewTransition === transition) finishThemeTransition()
  })
}
</script>

<template>
  <button
    type="button"
    :disabled="colorMode.unknown"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    class="wobble-on-hover grid size-11 cursor-pointer place-items-center rounded-(--radius-control) text-(--text-secondary) focus-ring hover:text-(--text-primary)"
    @click="cycleTheme"
  >
    <span class="wobble-target grid" aria-hidden="true">
      <component
        :is="option.icon"
        v-for="option in themeOptions"
        :key="option.value"
        :data-theme-icon="option.value"
        :size="20"
        class="theme-icon"
      />
    </span>
  </button>
</template>

<style scoped>
.theme-icon {
  grid-area: 1 / 1;
  opacity: 0;
  rotate: -90deg;
  scale: 0.4;
  pointer-events: none;
}

html:not([data-theme-preference="light"]):not([data-theme-preference="dark"])
  .theme-icon[data-theme-icon="system"],
html[data-theme-preference="light"] .theme-icon[data-theme-icon="light"],
html[data-theme-preference="dark"] .theme-icon[data-theme-icon="dark"] {
  opacity: 1;
  rotate: 0deg;
  scale: 1;
}

@media (prefers-reduced-motion: no-preference) {
  html[data-theme-transition] .theme-icon {
    transition:
      opacity 180ms ease-out,
      rotate 520ms var(--ease-sticker),
      scale 520ms var(--ease-sticker);
  }
}
</style>
