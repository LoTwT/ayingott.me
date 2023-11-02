<script setup lang="ts">
const lStorage = useLStorage()
const isZh = computed(() => lStorage.value.locale === "zh")
</script>

<template>
  <template v-if="isZh">
    <ZhResume />
  </template>
  <template v-else>
    <EnResume />
  </template>
</template>
