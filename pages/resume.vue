<script setup lang="ts">
const { data } = await useAsyncData("resume", () =>
  queryContent("/resume").findOne(),
)
</script>

<template>
  <div max-w-none prose>
    <ContentRenderer :value="data ?? {}" />
  </div>
</template>
