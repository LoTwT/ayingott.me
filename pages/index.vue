<script setup lang="ts">
const { data } = useFetch("/api/home")
const status = useStatus()
</script>

<template>
  <div text-10>{{ data }} {{ status }}</div>
</template>
