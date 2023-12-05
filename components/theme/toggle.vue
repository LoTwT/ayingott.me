<script setup lang="ts">
const theme = useTheme()

const changeTheme = () =>
  (theme.value = theme.value === "light" ? "dark" : "light")

const isDark = computed(() => theme.value === "dark")

// https://github.com/antfu/antfu.me/blob/df45fd9faf7121bb75f3d290eecdc930116f6ef3/src/logics/index.ts#L10-L52
// https://github.com/antfu/antfu.me/blob/df45fd9faf7121bb75f3d290eecdc930116f6ef3/src/styles/main.css#L134
function startViewTransitionIfSupported(event: MouseEvent) {
  const isAppearanceTransition =
    // @ts-expect-error experimental API
    document.startViewTransition &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (!isAppearanceTransition) {
    changeTheme()
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
    changeTheme()
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
  <div
    header-icon
    cursor-pointer
    :class="[isDark ? 'i-carbon-light' : 'i-carbon-moon']"
    @click="startViewTransitionIfSupported"
  />
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 1;
}
::view-transition-new(root) {
  z-index: 9999;
}
[data-theme="dark"]::view-transition-old(root) {
  z-index: 9999;
}
[data-theme="dark"]::view-transition-new(root) {
  z-index: 1;
}
</style>
