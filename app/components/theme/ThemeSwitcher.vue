<script setup lang="ts">
import { Monitor, Moon, Sun } from "@lucide/vue"
import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  watchEffect,
} from "vue"
import { useColorMode } from "#imports"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"

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

// After the page turns light or dark, a few hand-drawn marks appear around the button:
// sun rays for light, little stars for dark. They draw, linger, then fade.
const celebrationDuration = 1100
let celebrationId = 0
let celebrationTimeout: number | undefined
const themeCelebration = shallowRef<{ id: number; theme: "light" | "dark" }>()

// The new theme spreads out as an ink blot rather than a perfect circle. The radius of
// each point is fixed, so every blot has the same hand-cut edge; it turns slightly as it grows.
const inkBlotOffsets = [
  0.07, -0.05, 0.1, -0.08, 0.04, 0.09, -0.06, 0.05, -0.09, 0.03, 0.08, -0.04,
] as const

function formatPoint(x: number, y: number) {
  return `${x.toFixed(1)} ${y.toFixed(1)}`
}

function inkBlotPath(
  centerX: number,
  centerY: number,
  radius: number,
  rotation: number,
) {
  const points = inkBlotOffsets.map((offset, index) => {
    const angle = (index / inkBlotOffsets.length) * Math.PI * 2 + rotation
    const distance = radius * (1 + offset)
    return [
      centerX + Math.cos(angle) * distance,
      centerY + Math.sin(angle) * distance,
    ] as const
  })
  const pointAt = (index: number) =>
    points[(index + points.length) % points.length]!
  // Catmull-Rom through the points, written as cubic curves, closes into a smooth blot.
  let path = `M${formatPoint(...pointAt(0))}`
  for (let index = 0; index < points.length; index++) {
    const [x0, y0] = pointAt(index - 1)
    const [x1, y1] = pointAt(index)
    const [x2, y2] = pointAt(index + 1)
    const [x3, y3] = pointAt(index + 2)
    path += ` C${formatPoint(x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6)} ${formatPoint(x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6)} ${formatPoint(x2, y2)}`
  }
  return `path("${path} Z")`
}

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

onBeforeUnmount(() => {
  finishThemeTransition()
  window.clearTimeout(celebrationTimeout)
})

function celebrateTheme(theme: "light" | "dark") {
  window.clearTimeout(celebrationTimeout)
  themeCelebration.value = { id: ++celebrationId, theme }
  celebrationTimeout = window.setTimeout(() => {
    themeCelebration.value = undefined
  }, celebrationDuration)
}

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

  const themeChanges = resolvedTheme !== colorMode.value

  // Only the icon changes when the page stays light or dark, or the browser cannot reveal it.
  if (!themeChanges || !document.startViewTransition) {
    root.dataset.themeTransition = "icon"
    colorMode.preference = preference
    if (themeChanges) celebrateTheme(resolvedTheme)
    iconTransitionTimeout = window.setTimeout(
      finishThemeTransition,
      iconTransitionDuration,
    )
    return
  }

  // The blot grows from the button until even its innermost dips cover the farthest corner.
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const originX = bounds.left + bounds.width / 2
  const originY = bounds.top + bounds.height / 2
  const farthestCorner = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY),
  )
  const smallestOffset = Math.min(...inkBlotOffsets)
  root.style.setProperty(
    "--theme-reveal-from",
    inkBlotPath(originX, originY, 4, -0.6),
  )
  root.style.setProperty(
    "--theme-reveal-to",
    inkBlotPath(
      originX,
      originY,
      (farthestCorner / (1 + smallestOffset)) * 1.1,
      0,
    ),
  )
  root.dataset.themeTransition = "page"

  const transition = document.startViewTransition(async () => {
    colorMode.preference = preference
    await nextTick()
  })
  themeViewTransition = transition
  transition.finished.finally(() => {
    if (themeViewTransition !== transition) return
    finishThemeTransition()
    celebrateTheme(resolvedTheme)
  })
}
</script>

<template>
  <button
    type="button"
    :disabled="colorMode.unknown"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    class="wobble-on-hover relative grid size-11 cursor-pointer place-items-center rounded-(--radius-control) text-(--text-secondary) focus-ring hover:text-(--text-primary)"
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
    <DoodleStroke
      v-if="themeCelebration"
      :key="themeCelebration.id"
      :shape="themeCelebration.theme === 'dark' ? 'stars' : 'rays'"
      :data-theme="themeCelebration.theme"
      class="theme-celebration"
    />
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

.theme-celebration {
  --doodle-offset: 0;
  inset: -8px;
  width: calc(100% + 16px);
  height: calc(100% + 16px);
  stroke-width: 1.8;
  color: var(--brutal-orange);
  animation: theme-celebration 1100ms ease-out both;
}

.theme-celebration[data-theme="dark"] {
  color: var(--brutal-yellow);
}

.theme-celebration :deep(path) {
  animation: doodle-draw 420ms var(--ease-draw) both;
}

@keyframes theme-celebration {
  from {
    rotate: -12deg;
  }

  60% {
    opacity: 1;
  }

  to {
    opacity: 0;
    rotate: 8deg;
    scale: 1.12;
  }
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
