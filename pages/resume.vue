<script setup lang="ts">
const { locale } = useI18n()

const { data } = await useAsyncData(
  "resume",
  () => queryContent(`/${locale.value}/resume`).findOne(),
  {
    watch: [locale],
  },
)
</script>

<template>
  <div max-w-none px-8 prose lg="max-w-85ch px-0">
    <ContentRenderer :value="data ?? {}" />
  </div>
</template>
