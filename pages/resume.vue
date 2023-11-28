<script setup lang="ts">
const { data } = await useAsyncData("resume", () =>
  queryContent("/resume").findOne(),
)
</script>

<template>
  <div max-w-none prose prose-gray>
    <ContentRenderer :value="data ?? {}" />
  </div>
</template>
