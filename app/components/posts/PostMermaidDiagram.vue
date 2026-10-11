<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from "vue"
import { useColorMode } from "#imports"

const props = defineProps<{ source: string }>()

const colorMode = useColorMode()
const diagramContainer = useTemplateRef<HTMLDivElement>("diagramContainer")
const diagramId = `mermaid-${useId()}`
let renderSequence = 0
const hasRenderError = shallowRef(false)

// Rendered on the client because build-time rendering would need a headless browser.
async function renderDiagram() {
  const currentRender = ++renderSequence
  const renderId = `${diagramId}-${currentRender}`
  const { default: mermaid } = await import("mermaid")
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: colorMode.value === "dark" ? "dark" : "default",
  })
  try {
    const { svg } = await mermaid.render(renderId, props.source)
    if (currentRender === renderSequence && diagramContainer.value) {
      hasRenderError.value = false
      diagramContainer.value.innerHTML = svg
    }
  } catch (error) {
    // A failed render leaves mermaid's temporary nodes at the end of <body>.
    document.getElementById(`d${renderId}`)?.remove()
    document.getElementById(renderId)?.remove()
    if (currentRender === renderSequence) hasRenderError.value = true
    console.error("Mermaid diagram failed to render", error)
  }
}

// Download mermaid only when the diagram nears the viewport, so it does not compete
// with the first screen for bandwidth.
let visibilityObserver: IntersectionObserver | undefined
let hasEnteredViewport = false

watch(
  () => colorMode.value,
  () => {
    if (hasEnteredViewport && !hasRenderError.value) void renderDiagram()
  },
)

onMounted(() => {
  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      visibilityObserver?.disconnect()
      hasEnteredViewport = true
      void renderDiagram()
    },
    { rootMargin: "200px" },
  )
  visibilityObserver.observe(diagramContainer.value!)
})

onBeforeUnmount(() => visibilityObserver?.disconnect())
</script>

<template>
  <!-- Fixed height: the diagram scales inside it, so rendering causes no layout shift. -->
  <div class="mermaid-diagram">
    <!-- On a syntax error, show the source as a code block within the same box. -->
    <pre
      v-if="hasRenderError"
      class="mermaid-diagram-source"
    ><code>{{ source }}</code></pre>
    <div
      v-else
      ref="diagramContainer"
      class="mermaid-diagram-canvas"
      role="img"
      aria-label="图表"
    />
  </div>
</template>

<style scoped>
.mermaid-diagram {
  display: flex;
  justify-content: center;
  block-size: 20rem;
}

.mermaid-diagram-canvas {
  display: flex;
  justify-content: center;
  inline-size: 100%;
  block-size: 100%;
}

.mermaid-diagram-canvas :deep(svg) {
  width: 100%;
  height: 100%;
}

.mermaid-diagram-source {
  inline-size: 100%;
  block-size: 100%;
  overflow: auto;
}
</style>
