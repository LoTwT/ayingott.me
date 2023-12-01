<script setup lang="ts">
const theme = useTheme()

const changeTheme = () =>
  (theme.value = theme.value === "light" ? "dark" : "light")

const isLight = computed(() => theme.value === "light")
</script>

<template>
  <div
    h-8
    w-8
    cursor-pointer
    :class="[isLight ? 'i-carbon-moon' : 'i-carbon-light']"
    @click="changeTheme"
  />
</template>
