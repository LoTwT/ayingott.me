<script setup lang="ts">
const { data } = await useAsyncData("resume", () =>
  queryContent("/resume").findOne(),
)
</script>

<template>
  <div max-w-none px-8 prose lg="max-w-80ch px-0">
    <ContentRenderer :value="data ?? {}" />
  </div>
</template>
