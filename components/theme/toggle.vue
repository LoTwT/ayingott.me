<script setup lang="ts">
// const theme = useTheme()

// const isLight = ref(theme.value === "light")

// watch(isLight, (value) => {
//   theme.value = value ? "light" : "dark"
// })
</script>

<template>
  <label class="swap" cursor-pointer>
    <!-- <input v-model="isLight" type="checkbox" /> -->
    <input type="checkbox" />
    <div class="swap-off" i-carbon-light h-8 w-8 />
    <div class="swap-on" i-carbon-moon h-8 w-8 />
  </label>
</template>
