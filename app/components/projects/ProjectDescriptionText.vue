<script setup lang="ts">
defineProps<{ phrases: readonly string[] }>()
</script>

<template>
  <template v-for="(phrase, index) in phrases" :key="index">
    <span v-if="phrase.trim()" class="description-phrase">{{ phrase }}</span>
    <template v-else>{{ phrase }}</template>
  </template>
</template>

<style scoped>
.description-phrase {
  display: inline-block;
  inline-size: max-content;
  max-inline-size: 100%;
  vertical-align: top;
  overflow-wrap: anywhere;
}
</style>
