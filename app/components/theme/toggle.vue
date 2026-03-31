<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === "dark")
const toggleLabel = computed(() =>
  isDark.value ? "Switch to light mode" : "Switch to dark mode",
)

function toggleDark() {
  const payload = isDark.value ? "light" : "dark"
  colorMode.preference = payload
}
</script>

<template>
  <button
    type="button"
    cursor-pointer
    border-none
    bg-transparent
    p-0
    :aria-label="toggleLabel"
    :title="toggleLabel"
    @click="toggleDark"
  >
    <div
      aria-hidden="true"
      dark="i-line-md-moon-filled-loop bg-yellow"
      class="size-12!"
      i-line-md-sunny-filled-loop
      bg-orange
    />
  </button>
</template>
