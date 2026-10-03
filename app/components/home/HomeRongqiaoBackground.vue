<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from "vue"
import { useColorMode } from "#imports"

// Material shader from “融巧 V1 · 原版”. Only the final theme mix differs:
// it follows the theme curtain's live geometry instead of its own sweep.
const vertexShaderSource = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const fragmentShaderSource = `
  #extension GL_OES_standard_derivatives : enable
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  uniform float milk;
  uniform float softness;
  uniform float previousThemeDarkAmount;
  uniform float nextThemeDarkAmount;
  uniform float curtainLeadingEdge;
  uniform float curtainEdgeWidth;
  uniform float curtainCoverageDirection;
  uniform vec2 compositionAnchor;
  uniform float compositionZoom;
  uniform vec2 compositionOrigin;
  uniform float compositionRotation;

  mat2 rotation(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
  }

  vec2 curl(vec2 p, vec2 center, float spread, float angle) {
    vec2 d = p - center;
    float weight = exp(-dot(d, d) / spread);
    return center + rotation(angle * weight) * d;
  }

  // Two fixed curls bend a gently waving line into the Ω. The independent drift,
  // travelling wave, small ripples and curl wobble were removed: together they swayed
  // the shape without a direction and pinched the right shoulder into sharp turns.
  vec2 flow(vec2 p) {
    p = curl(p, vec2(0.50, 0.08), 0.42, 1.0);
    p = curl(p, vec2(-0.68, -0.16), 0.55, -0.88);
    return p;
  }

  void main() {
    vec2 uv = vec2(gl_FragCoord.x / resolution.x, 1.0 - gl_FragCoord.y / resolution.y);
    // Composition space is anchored to the introduction: its centre lands in the bay
    // under the arch, measured in short sides and scaled by the zoom.
    vec2 pixel = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
    // Lengths are measured in short sides, so portrait screens keep landscape proportions;
    // portrait layouts also turn the composition clockwise around the introduction.
    float shortSide = min(resolution.x, resolution.y);
    vec2 fromAnchor = pixel - compositionAnchor;
    float rotationCosine = cos(compositionRotation);
    float rotationSine = sin(compositionRotation);
    fromAnchor = vec2(
      rotationCosine * fromAnchor.x + rotationSine * fromAnchor.y,
      -rotationSine * fromAnchor.x + rotationCosine * fromAnchor.y
    );
    vec2 p = fromAnchor * compositionZoom / shortSide + compositionOrigin;
    // Breathing: once every 20 seconds the Ω opens out around the introduction by 3%
    // and settles back. It only expands from rest, so the band never nears the text.
    float breath = 0.5 - 0.5 * cos(time * 6.2831853 / 20.0);
    vec2 breathingP = compositionOrigin + (p - compositionOrigin) / (1.0 + 0.03 * breath);
    vec2 q = flow(breathingP);
    float centerOffset = q.y - 0.135 + 0.065 * sin(q.x * 2.8 - 0.3);
    // The curls stretch the band unevenly. Dividing by the offset's screen gradient
    // turns it into a distance in short sides, so the band keeps one thickness along
    // its whole length.
    #ifdef GL_OES_standard_derivatives
    float offsetStretch = length(vec2(dFdx(centerOffset), dFdy(centerOffset))) * shortSide;
    float lane = centerOffset / max(offsetStretch, 0.25);
    #else
    float lane = centerOffset;
    #endif
    float width = (0.072 + 0.006 * sin(q.x * 4.6)) * milk;
    float feather = 0.024 * softness;
    float envelope = 1.0 - smoothstep(width, width + feather, abs(lane));
    float layerPhase = lane / (width + 0.055) * 9.0 + 1.1 * sin(q.x * 3.9 - time * 0.06);
    float streak = pow(0.5 + 0.5 * sin(layerPhase), 3.0);
    float blended = 0.5 + 0.5 * sin(q.x * 2.4 + 0.8 * cos(lane * 8.0) - time * 0.035);
    float cream = envelope * (0.52 + 0.48 * streak) * (0.84 + 0.16 * blended);
    float halo = exp(-pow((lane + width * 0.45) / (width * 2.0 + 0.05), 2.0));
    // Keep the outer seam at a steady gap: a wobbling gap made the band read thinner
    // wherever the seam hugged it. Only the arch top (around q.x = -0.04) sits a little closer.
    float archTopWeight = exp(-pow((q.x + 0.04) / 0.35, 2.0));
    float seamGap = 0.032 - 0.0065 * archTopWeight;
    float seamPosition = lane + width + seamGap;
    float seam = exp(-pow(seamPosition / (0.012 + feather * 0.32), 2.0));
    float foldedMilk = exp(-pow((lane - width - 0.030) / (0.034 + feather * 0.30), 2.0));
    float variation = 0.5 + 0.5 * sin(q.x * 3.4 + lane * 7.0 - time * 0.04);
    float bodyTint = clamp(halo * (0.5 + 0.25 * variation) + foldedMilk * 0.20, 0.0, 1.0);

    vec3 whiteChocolate = vec3(252.0, 246.0, 234.0) / 255.0;
    vec3 almond = vec3(211.0, 185.0, 149.0) / 255.0;
    vec3 warmMilk = vec3(255.0, 250.0, 238.0) / 255.0;
    vec3 lightColor = mix(whiteChocolate, almond, bodyTint * 0.76);
    lightColor = mix(lightColor, warmMilk, cream * 0.92);
    lightColor = mix(lightColor, whiteChocolate, seam * 0.65);
    lightColor = mix(lightColor, warmMilk, foldedMilk * 0.18);

    vec3 darkChocolate = vec3(33.0, 26.0, 23.0) / 255.0;
    vec3 mixedChocolate = vec3(72.0, 51.0, 38.0) / 255.0;
    vec3 cocoaMilk = vec3(129.0, 98.0, 72.0) / 255.0;
    vec3 darkColor = mix(darkChocolate, mixedChocolate, bodyTint * 0.78);
    darkColor = mix(darkColor, cocoaMilk, cream * 0.76);
    darkColor = mix(darkColor, cocoaMilk, seam * 0.40);
    darkColor = mix(darkColor, cocoaMilk, foldedMilk * 0.15);

    float ridge = exp(-pow((abs(lane) - width) / 0.010, 2.0)) * 0.65;
    lightColor += ridge * vec3(0.004, 0.003, 0.002);
    darkColor += ridge * vec3(0.012, 0.010, 0.007);

    // Matches the curtain veil's soft leading edge: 1 where the previous theme is still covered.
    float previousThemeCoverage = clamp(
      curtainCoverageDirection * (curtainLeadingEdge - uv.x) / curtainEdgeWidth,
      0.0,
      1.0
    );
    float darkAmount = mix(nextThemeDarkAmount, previousThemeDarkAmount, previousThemeCoverage);
    gl_FragColor = vec4(mix(lightColor, darkColor, darkAmount), 1.0);
  }
`

const uniformNames = [
  "resolution",
  "time",
  "milk",
  "softness",
  "previousThemeDarkAmount",
  "nextThemeDarkAmount",
  "curtainLeadingEdge",
  "curtainEdgeWidth",
  "curtainCoverageDirection",
  "compositionAnchor",
  "compositionZoom",
  "compositionOrigin",
  "compositionRotation",
] as const
type UniformName = (typeof uniformNames)[number]

type ThemeCurtainFrame = {
  previousThemeIsDark: boolean
  nextThemeIsDark: boolean
  leadingEdge: number
  edgeWidth: number
  coverageDirection: 1 | -1
}

const milkAmount = 1
const edgeSoftness = 1
const initialElapsedSeconds = 7
const throttledFrameInterval = 1000 / 30
// Frame timestamps jitter around the display interval; without this slack,
// two 60Hz frames (≈33.3ms) often miss the 30fps interval and draws drop to 20fps.
const frameIntervalTolerance = 2
const maximumFrameDeltaSeconds = 0.1
const maximumRenderScale = 1.35
const maximumBufferEdge = 1350
const themeBackdropAttribute = "webgl"
// How the composition sits around the introduction for each screen shape. The origin is
// where the introduction's centre lands in composition space (the bay under the arch);
// wider text relative to the short side enlarges the composition so the bay fits it.
type CompositionLayout = {
  rotationDegrees: number
  origin: readonly [number, number]
  textWidthRatio: number
  minimumZoom: number
  maximumZoom: number
}

// Landscape 1024px wide and up: the band, outer seam included, keeps at least 1.33 times
// its reach from the introduction and stays inside the viewport at full breath.
const landscapeComposition: CompositionLayout = {
  rotationDegrees: 0,
  origin: [0.1, -0.01],
  textWidthRatio: 0.36,
  minimumZoom: 0.7,
  maximumZoom: 1,
}
// Portrait phones: a 65° turn runs the band down past the introduction's right side and
// out at the lower right, away from the theme button and the footer.
const phonePortraitComposition: CompositionLayout = {
  rotationDegrees: 65,
  origin: [0.08, 0.22],
  textWidthRatio: 0.6,
  minimumZoom: 0.6,
  maximumZoom: 1,
}
// Portrait tablets: a 70° turn keeps at least 1.5 times the reach from the introduction.
const tabletPortraitComposition: CompositionLayout = {
  rotationDegrees: 70,
  origin: [0.12, 0.38],
  textWidthRatio: 0.6,
  minimumZoom: 0.6,
  maximumZoom: 1.4,
}
const phonePortraitMaximumAspect = 0.65

function selectCompositionLayout(width: number, height: number) {
  const aspect = width / height
  if (aspect >= 1) return landscapeComposition
  return aspect <= phonePortraitMaximumAspect
    ? phonePortraitComposition
    : tabletPortraitComposition
}

const backgroundCanvas = useTemplateRef<HTMLCanvasElement>("backgroundCanvas")
const isBackgroundReady = shallowRef(false)
const colorMode = useColorMode()

let renderingContext: WebGLRenderingContext | undefined
let shaderProgram: WebGLProgram | undefined
let vertexBuffer: WebGLBuffer | undefined
let uniformLocations: Record<UniformName, WebGLUniformLocation | null>
let reducedMotionPreference: MediaQueryList | undefined
let canvasResizeObserver: ResizeObserver | undefined
let isRenderingUnavailable = false
let elapsedSeconds = initialElapsedSeconds
let previousFrameTime = 0
let lastDrawTime = 0
let animationFrameId = 0

function isDocumentDark() {
  return document.documentElement.classList.contains("dark")
}

function createShader(
  context: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = context.createShader(type)
  if (!shader) throw new Error("Shader allocation failed")
  context.shaderSource(shader, source)
  context.compileShader(shader)
  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    throw new Error(context.getShaderInfoLog(shader) ?? "Shader compile failed")
  }
  return shader
}

function initializeRenderingContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  })
  if (!context) throw new Error("WebGL unavailable")
  context.getExtension("OES_standard_derivatives")
  const program = context.createProgram()
  if (!program) throw new Error("Program allocation failed")
  const vertexShader = createShader(
    context,
    context.VERTEX_SHADER,
    vertexShaderSource,
  )
  const fragmentShader = createShader(
    context,
    context.FRAGMENT_SHADER,
    fragmentShaderSource,
  )
  context.attachShader(program, vertexShader)
  context.attachShader(program, fragmentShader)
  context.linkProgram(program)
  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    throw new Error(context.getProgramInfoLog(program) ?? "Program link failed")
  }
  context.deleteShader(vertexShader)
  context.deleteShader(fragmentShader)
  context.useProgram(program)
  const buffer = context.createBuffer()
  if (!buffer) throw new Error("Buffer allocation failed")
  context.bindBuffer(context.ARRAY_BUFFER, buffer)
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    context.STATIC_DRAW,
  )
  const position = context.getAttribLocation(program, "position")
  context.enableVertexAttribArray(position)
  context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0)

  renderingContext = context
  shaderProgram = program
  vertexBuffer = buffer
  uniformLocations = Object.fromEntries(
    uniformNames.map((name) => [
      name,
      context.getUniformLocation(program, name),
    ]),
  ) as Record<UniformName, WebGLUniformLocation | null>
}

// The theme switcher owns the transition timing. While its page curtain runs,
// the veil is hidden and this background redraws the same soft edge.
function readThemeCurtainFrame(
  canvas: HTMLCanvasElement,
): ThemeCurtainFrame | "pending" | undefined {
  if (document.documentElement.dataset.themeTransition !== "page") return
  const curtain = document.querySelector<HTMLElement>(".theme-curtain")
  const veil = curtain?.querySelector<HTMLElement>(".theme-curtain-veil")
  const canvasBounds = canvas.getBoundingClientRect()
  if (!curtain || !veil || !canvasBounds.width) return "pending"

  const veilBounds = veil.getBoundingClientRect()
  const coversFromLeft = curtain.dataset.direction === "left"
  const edgeWidthInViewportWidth =
    Number.parseFloat(
      curtain.style.getPropertyValue("--theme-curtain-edge-width"),
    ) / 100
  const nextThemeIsDark = isDocumentDark()
  return {
    previousThemeIsDark: !nextThemeIsDark,
    nextThemeIsDark,
    leadingEdge:
      ((coversFromLeft ? veilBounds.right : veilBounds.left) -
        canvasBounds.left) /
      canvasBounds.width,
    edgeWidth:
      (edgeWidthInViewportWidth * window.innerWidth) / canvasBounds.width,
    coverageDirection: coversFromLeft ? 1 : -1,
  }
}

// Anchor point (top-origin buffer pixels), zoom and origin for the composition.
type CompositionFrame = {
  anchor: readonly [number, number]
  zoom: number
  origin: readonly [number, number]
  rotation: number
}

function measureComposition(canvas: HTMLCanvasElement): CompositionFrame {
  const canvasBounds = canvas.getBoundingClientRect()
  const anchor = document.querySelector<HTMLElement>("[data-backdrop-anchor]")
  const bufferScale = canvasBounds.width ? canvas.width / canvasBounds.width : 1
  if (!anchor || !canvasBounds.height) {
    return {
      anchor: [canvas.width / 2, canvas.height / 2],
      zoom: 1,
      origin: [0, 0],
      rotation: 0,
    }
  }
  const layout = selectCompositionLayout(
    canvasBounds.width,
    canvasBounds.height,
  )
  const bounds = anchor.getBoundingClientRect()
  const textWidthRatio =
    bounds.width / Math.min(canvasBounds.width, canvasBounds.height)
  return {
    anchor: [
      (bounds.left + bounds.width / 2 - canvasBounds.left) * bufferScale,
      (bounds.top + bounds.height / 2 - canvasBounds.top) * bufferScale,
    ],
    zoom: Math.min(
      layout.maximumZoom,
      Math.max(layout.minimumZoom, layout.textWidthRatio / textWidthRatio),
    ),
    origin: layout.origin,
    rotation: (layout.rotationDegrees * Math.PI) / 180,
  }
}

function drawBackground(curtainFrame: ThemeCurtainFrame | undefined) {
  const canvas = backgroundCanvas.value
  const context = renderingContext
  if (!canvas || !context || isRenderingUnavailable) return

  const currentThemeIsDark = isDocumentDark()
  const previousThemeIsDark =
    curtainFrame?.previousThemeIsDark ?? currentThemeIsDark
  const nextThemeIsDark = curtainFrame?.nextThemeIsDark ?? currentThemeIsDark

  context.viewport(0, 0, canvas.width, canvas.height)
  context.uniform2f(uniformLocations.resolution, canvas.width, canvas.height)
  context.uniform1f(uniformLocations.time, elapsedSeconds)
  context.uniform1f(uniformLocations.milk, milkAmount)
  context.uniform1f(uniformLocations.softness, edgeSoftness)
  context.uniform1f(
    uniformLocations.previousThemeDarkAmount,
    previousThemeIsDark ? 1 : 0,
  )
  context.uniform1f(
    uniformLocations.nextThemeDarkAmount,
    nextThemeIsDark ? 1 : 0,
  )
  context.uniform1f(
    uniformLocations.curtainLeadingEdge,
    curtainFrame?.leadingEdge ?? 0,
  )
  context.uniform1f(
    uniformLocations.curtainEdgeWidth,
    curtainFrame?.edgeWidth ?? 1,
  )
  context.uniform1f(
    uniformLocations.curtainCoverageDirection,
    curtainFrame?.coverageDirection ?? 1,
  )
  const composition = measureComposition(canvas)
  context.uniform2f(
    uniformLocations.compositionAnchor,
    composition.anchor[0],
    composition.anchor[1],
  )
  context.uniform1f(uniformLocations.compositionZoom, composition.zoom)
  context.uniform2f(
    uniformLocations.compositionOrigin,
    composition.origin[0],
    composition.origin[1],
  )
  context.uniform1f(uniformLocations.compositionRotation, composition.rotation)
  context.drawArrays(context.TRIANGLES, 0, 6)
  isBackgroundReady.value = true
}

function drawCurrentFrame() {
  const canvas = backgroundCanvas.value
  if (!canvas) return
  const curtainFrame = readThemeCurtainFrame(canvas)
  if (curtainFrame === "pending") return
  drawBackground(curtainFrame)
}

function resizeBackground() {
  const canvas = backgroundCanvas.value
  if (!canvas) return
  const bounds = canvas.getBoundingClientRect()
  const renderScale = Math.min(
    window.devicePixelRatio || 1,
    maximumRenderScale,
    maximumBufferEdge / Math.max(bounds.width, bounds.height, 1),
  )
  canvas.width = Math.max(1, Math.round(bounds.width * renderScale))
  canvas.height = Math.max(1, Math.round(bounds.height * renderScale))
  drawCurrentFrame()
}

function renderFrame(now: number) {
  animationFrameId = 0
  const canvas = backgroundCanvas.value
  if (!canvas || document.hidden || isRenderingUnavailable) {
    previousFrameTime = 0
    return
  }
  const frameDeltaSeconds = previousFrameTime
    ? Math.min((now - previousFrameTime) / 1000, maximumFrameDeltaSeconds)
    : 0
  previousFrameTime = now

  const motionAllowed = !reducedMotionPreference?.matches
  if (motionAllowed) elapsedSeconds += frameDeltaSeconds

  const curtainFrame = readThemeCurtainFrame(canvas)
  const isThemeTransitionRunning = curtainFrame !== undefined
  const isThrottledFrameDue =
    now - lastDrawTime >= throttledFrameInterval - frameIntervalTolerance
  if (
    curtainFrame !== "pending" &&
    (isThemeTransitionRunning || isThrottledFrameDue)
  ) {
    drawBackground(curtainFrame)
    lastDrawTime = now
  }

  if (motionAllowed || isThemeTransitionRunning) {
    animationFrameId = requestAnimationFrame(renderFrame)
  } else {
    previousFrameTime = 0
  }
}

function requestRender() {
  if (!animationFrameId && !isRenderingUnavailable && !document.hidden) {
    animationFrameId = requestAnimationFrame(renderFrame)
  }
}

function stopRendering() {
  cancelAnimationFrame(animationFrameId)
  animationFrameId = 0
  previousFrameTime = 0
}

function handleVisibilityChange() {
  if (document.hidden) stopRendering()
  else requestRender()
}

function markBackdropActive() {
  document.documentElement.dataset.themeBackdrop = themeBackdropAttribute
}

function clearBackdropMarker() {
  if (
    document.documentElement.dataset.themeBackdrop === themeBackdropAttribute
  ) {
    delete document.documentElement.dataset.themeBackdrop
  }
}

function handleContextLost(event: Event) {
  event.preventDefault()
  isRenderingUnavailable = true
  isBackgroundReady.value = false
  stopRendering()
  clearBackdropMarker()
}

function handleContextRestored() {
  const canvas = backgroundCanvas.value
  if (!canvas) return
  try {
    initializeRenderingContext(canvas)
    isRenderingUnavailable = false
    markBackdropActive()
    resizeBackground()
    requestRender()
  } catch {
    isRenderingUnavailable = true
  }
}

watch(
  () => colorMode.value,
  () => {
    if (!renderingContext) return
    drawCurrentFrame()
    requestRender()
  },
)

onMounted(() => {
  const canvas = backgroundCanvas.value
  if (!canvas) return
  reducedMotionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  )
  try {
    initializeRenderingContext(canvas)
  } catch {
    isRenderingUnavailable = true
    return
  }
  markBackdropActive()
  canvas.addEventListener("webglcontextlost", handleContextLost)
  canvas.addEventListener("webglcontextrestored", handleContextRestored)
  document.addEventListener("visibilitychange", handleVisibilityChange)
  reducedMotionPreference.addEventListener("change", requestRender)
  canvasResizeObserver = new ResizeObserver(resizeBackground)
  canvasResizeObserver.observe(canvas)
  resizeBackground()
  requestRender()
})

onBeforeUnmount(() => {
  stopRendering()
  clearBackdropMarker()
  canvasResizeObserver?.disconnect()
  reducedMotionPreference?.removeEventListener("change", requestRender)
  document.removeEventListener("visibilitychange", handleVisibilityChange)
  const canvas = backgroundCanvas.value
  canvas?.removeEventListener("webglcontextlost", handleContextLost)
  canvas?.removeEventListener("webglcontextrestored", handleContextRestored)
  if (renderingContext) {
    if (vertexBuffer) renderingContext.deleteBuffer(vertexBuffer)
    if (shaderProgram) renderingContext.deleteProgram(shaderProgram)
    renderingContext.getExtension("WEBGL_lose_context")?.loseContext()
  }
  renderingContext = undefined
  shaderProgram = undefined
  vertexBuffer = undefined
})
</script>

<template>
  <canvas
    ref="backgroundCanvas"
    class="home-rongqiao-background"
    :class="{ 'is-ready': isBackgroundReady }"
    aria-hidden="true"
  />
</template>

<style scoped>
.home-rongqiao-background {
  position: fixed;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
}

.home-rongqiao-background.is-ready {
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .home-rongqiao-background.is-ready {
    transition: opacity 400ms ease-out;
  }
}
</style>
