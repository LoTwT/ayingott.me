<script setup lang="ts">
import PostMermaidDiagram from "~/components/posts/PostMermaidDiagram.vue"

// Same props as Content's default ProsePre; mermaid blocks render as diagrams on the client.
defineProps<{
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
  class?: string | null
}>()
</script>

<template>
  <PostMermaidDiagram v-if="language === 'mermaid'" :source="code ?? ''" />
  <pre v-else :class="$props.class"><slot /></pre>
</template>

<style>
pre code .line {
  display: block;
}
</style>
