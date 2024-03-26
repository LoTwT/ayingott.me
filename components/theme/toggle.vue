<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.preference === "dark")

const cookieTheme = useCookie("ayin-theme")

watch(
  () => colorMode.preference,
  (value) => {
    cookieTheme.value = value
  },
)

watch(
  () => cookieTheme.value,
  (value) => {
    if (value) colorMode.preference = value
  },
  {
    immediate: true,
  },
)

// https://github.com/antfu/antfu.me/blob/df45fd9faf7121bb75f3d290eecdc930116f6ef3/src/logics/index.ts#L10-L52
// https://github.com/antfu/antfu.me/blob/df45fd9faf7121bb75f3d290eecdc930116f6ef3/src/styles/main.css#L134
function toggleDark(event: MouseEvent) {
  if (colorMode.value === "system") return

  const payload = colorMode.value === "dark" ? "light" : "dark"

  const isAppearanceTransition =
    document.startViewTransition &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (!isAppearanceTransition) {
    colorMode.preference = payload
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    colorMode.preference = payload
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: "ease-out",
        pseudoElement: isDark.value
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      },
    )
  })
}
</script>

<template>
  <div cursor-pointer @click="toggleDark">
    <div v-if="isDark" i-line-md-moon-filled-loop size-12 bg-yellow />
    <div v-else i-line-md-sunny-filled-loop size-12 bg-orange />
  </div>
</template>
