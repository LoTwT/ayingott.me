<script setup lang="ts">
import { Monitor, Moon, Sun } from "@lucide/vue"
import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  useTemplateRef,
  watchEffect,
} from "vue"
import { useColorMode } from "#imports"

const themeOptions = [
  { value: "system", label: "跟随系统", icon: Monitor },
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
] as const

const colorMode = useColorMode()
const themeTransitionDuration = 600
const themeCurtainEdgeWidth = 0.308
const themeTransitionTiming = {
  duration: themeTransitionDuration,
  easing: "cubic-bezier(0.45, 0, 0.55, 1)",
  fill: "both",
} as const
const curtainVeil = useTemplateRef<HTMLDivElement>("curtainVeil")
const reducedMotionPreference = import.meta.client
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : undefined
let themeTransitionTimeout: number | undefined
let themeAnimations: Animation[] = []
let themeCurtainId = 0
const themeCurtain = shallowRef<{
  id: number
  color: string
  direction: "left" | "right"
}>()
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
  reducedMotionPreference?.addEventListener("change", finishThemeTransition)
  watchEffect(() => {
    if (!colorMode.unknown) {
      document.documentElement.dataset.themePreference = colorMode.preference
    }
  })
}

onBeforeUnmount(() => {
  reducedMotionPreference?.removeEventListener("change", finishThemeTransition)
  finishThemeTransition()
})

function finishThemeTransition() {
  window.clearTimeout(themeTransitionTimeout)
  for (const animation of themeAnimations) animation.cancel()
  themeAnimations = []
  themeCurtain.value = undefined
  delete document.documentElement.dataset.themeTransition
}

async function cycleTheme() {
  window.clearTimeout(themeTransitionTimeout)
  const root = document.documentElement
  const preference = nextTheme.value.value
  const resolvedTheme =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference

  if (reducedMotionPreference?.matches) {
    finishThemeTransition()
    colorMode.preference = preference
    return
  }

  if (resolvedTheme === colorMode.value) {
    root.dataset.themeTransition ??= "preference"
    colorMode.preference = preference
    themeTransitionTimeout = window.setTimeout(
      finishThemeTransition,
      themeTransitionDuration + 40,
    )
    return
  }

  finishThemeTransition()
  const direction = resolvedTheme === "dark" ? "left" : "right"
  const curtainId = ++themeCurtainId
  const previousColors = Array.from(
    document.querySelectorAll<HTMLElement>(
      "a, button, .theme-color-transition",
    ),
    (element) => {
      const bounds = element.getBoundingClientRect()
      const horizontalPosition = Math.min(
        1,
        Math.max(0, (bounds.left + bounds.width / 2) / window.innerWidth),
      )
      return {
        element,
        left: bounds.left,
        color: getComputedStyle(element).color,
        distance:
          direction === "left" ? 1 - horizontalPosition : horizontalPosition,
      }
    },
  )
  root.dataset.themeTransition = "page"
  themeCurtain.value = {
    id: curtainId,
    color: getComputedStyle(document.body).backgroundColor,
    direction,
  }
  colorMode.preference = preference
  await nextTick()

  if (themeCurtain.value?.id !== curtainId || !curtainVeil.value) return

  const travelDirection = direction === "left" ? -1 : 1
  themeAnimations = [
    curtainVeil.value.animate(
      [
        {
          transform: `translate3d(${-travelDirection * themeCurtainEdgeWidth * 100}vw, 0, 0)`,
        },
        { transform: `translate3d(${travelDirection * 100}vw, 0, 0)` },
      ],
      themeTransitionTiming,
    ),
    ...previousColors.map(({ element, left, color, distance }) => {
      const nextColor = getComputedStyle(element).color
      const totalTravel = 1 + themeCurtainEdgeWidth
      if (element.matches(".theme-color-transition")) {
        const viewportWidth = window.innerWidth
        const gradientWidth = viewportWidth * themeCurtainEdgeWidth
        const textGradient = {
          color: "transparent",
          backgroundColor: nextColor,
          backgroundImage: `linear-gradient(to ${direction === "left" ? "right" : "left"}, ${color} calc(100% - ${gradientWidth}px), ${nextColor} 100%)`,
          backgroundSize: `${viewportWidth * totalTravel}px 100%`,
          backgroundRepeat: "no-repeat",
          backgroundClip: "text",
        }
        const start = (direction === "left" ? 0 : -gradientWidth) - left
        const end =
          (direction === "left"
            ? -viewportWidth * totalTravel
            : viewportWidth) - left
        return element.animate(
          [
            { ...textGradient, backgroundPositionX: `${start}px` },
            { ...textGradient, backgroundPositionX: `${end}px` },
          ],
          themeTransitionTiming,
        )
      }
      return element.animate(
        [
          { color, offset: 0 },
          { color, offset: distance / totalTravel },
          {
            color: nextColor,
            offset: (distance + themeCurtainEdgeWidth) / totalTravel,
          },
          { color: nextColor, offset: 1 },
        ],
        themeTransitionTiming,
      )
    }),
  ]
  themeTransitionTimeout = window.setTimeout(
    finishThemeTransition,
    themeTransitionDuration + 40,
  )
}
</script>

<template>
  <button
    type="button"
    :disabled="colorMode.unknown"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    class="grid size-11 cursor-pointer place-items-center rounded-(--radius-control) text-(--text-secondary) focus-ring hover:text-(--text-primary)"
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
  <Teleport v-if="themeCurtain" to="body">
    <div
      :key="themeCurtain.id"
      :data-direction="themeCurtain.direction"
      :style="{
        '--theme-curtain-color': themeCurtain.color,
        '--theme-curtain-edge-width': `${themeCurtainEdgeWidth * 100}vw`,
        '--theme-curtain-start': `${(themeCurtain.direction === 'left' ? 1 : -1) * themeCurtainEdgeWidth * 100}vw`,
      }"
      class="theme-curtain"
      aria-hidden="true"
    >
      <div ref="curtainVeil" class="theme-curtain-veil" />
    </div>
  </Teleport>
</template>

<style scoped>
.theme-curtain {
  position: fixed;
  z-index: -1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.theme-curtain-veil {
  --theme-curtain-gradient-direction: to right;
  position: absolute;
  inset: 0 0 0 -40%;
  transform: translate3d(var(--theme-curtain-start), 0, 0);
  background: linear-gradient(
    var(--theme-curtain-gradient-direction),
    var(--theme-curtain-color) calc(100% - var(--theme-curtain-edge-width)),
    transparent 100%
  );
}

.theme-curtain[data-direction="right"] .theme-curtain-veil {
  --theme-curtain-gradient-direction: to left;
  inset: 0 -40% 0 0;
}

.theme-icon {
  grid-area: 1 / 1;
  opacity: 0;
  pointer-events: none;
}

html:not([data-theme-preference="light"]):not([data-theme-preference="dark"])
  .theme-icon[data-theme-icon="system"],
html[data-theme-preference="light"] .theme-icon[data-theme-icon="light"],
html[data-theme-preference="dark"] .theme-icon[data-theme-icon="dark"] {
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  html[data-theme-transition] .theme-icon {
    transition: opacity 180ms ease-out;
  }
}
</style>
