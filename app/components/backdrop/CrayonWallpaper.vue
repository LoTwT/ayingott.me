<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from "vue"
import { wallpaperTileSize, wallpaperTileUrl } from "./wallpaper-tile"

// The whole page is doodle wallpaper in pencil grey, slowly drifting, laid out at random on
// every visit (see wallpaper-tile.ts). Around the pointer the same doodles show up in
// crayon colors, as if colored in where you look. When the pointer rests, or on touch
// screens, the crayon spot wanders on its own, and glides back once the pointer moves again.

// Built on the client: the layout is random, so rendering it on the server would not match.
// Until it exists the layers are not rendered, since without a mask they would be solid.
const tileUrl = shallowRef("")

const rootRef = useTemplateRef<HTMLDivElement>("root")
const wanderAfterIdle = 1800
let frame = 0
let lastMove = Number.NEGATIVE_INFINITY
let cleanup = () => {}

// Glide time back to the pointer grows with the distance the spot wandered away.
function returnDuration(distance: number) {
  return Math.min(700, Math.max(320, distance * 0.9))
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

// Wandering heads for random waypoints in the middle of the viewport. Each new waypoint lies
// at least a third of the viewport away, so the spot never just jitters in place.
function pickWaypoint(from: { x: number; y: number }) {
  const width = window.innerWidth
  const height = window.innerHeight
  const minDistance = Math.min(width, height) / 3
  let waypoint = { x: 0, y: 0 }
  for (let attempt = 0; attempt < 8; attempt++) {
    waypoint = {
      x: randomBetween(0.12, 0.88) * width,
      y: randomBetween(0.16, 0.84) * height,
    }
    if (Math.hypot(waypoint.x - from.x, waypoint.y - from.y) >= minDistance)
      break
  }
  return { ...waypoint, speed: randomBetween(90, 150) }
}

onMounted(() => {
  tileUrl.value = wallpaperTileUrl()
  const root = rootRef.value
  if (
    !root ||
    !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  )
    return

  let x = window.innerWidth * 0.7
  let y = window.innerHeight * 0.3
  const pointer = { x, y }
  // Set while the spot glides from where it wandered back to the pointer.
  let glide:
    | { from: { x: number; y: number }; start: number; duration: number }
    | undefined
  // Wandering steers a velocity toward the waypoint instead of moving straight at it, so
  // the path curves smoothly and every turn is rounded. Reset whenever wandering restarts.
  let wander:
    | {
        waypoint: ReturnType<typeof pickWaypoint>
        velocity: { x: number; y: number }
      }
    | undefined
  let lastFrame: number | undefined

  const place = () => {
    root.style.setProperty("--mx", `${x}px`)
    root.style.setProperty("--my", `${y}px`)
  }
  const tick = (time: number) => {
    // Seconds since the last frame, capped so a tab that was hidden does not leap ahead.
    const elapsed = Math.min(0.05, (time - (lastFrame ?? time)) / 1000)
    lastFrame = time
    if (time - lastMove > wanderAfterIdle) {
      wander ??= { waypoint: pickWaypoint({ x, y }), velocity: { x: 0, y: 0 } }
      const { waypoint, velocity } = wander
      const dx = waypoint.x - x
      const dy = waypoint.y - y
      const distance = Math.hypot(dx, dy) || 1
      // Turning toward the desired heading is time based, so it feels the same at any
      // refresh rate; 0.8s is how long the spot takes to mostly settle on a new heading.
      const turn = 1 - Math.exp(-elapsed / 0.8)
      velocity.x += ((dx / distance) * waypoint.speed - velocity.x) * turn
      velocity.y += ((dy / distance) * waypoint.speed - velocity.y) * turn
      x += velocity.x * elapsed
      y += velocity.y * elapsed
      if (distance < 80) wander.waypoint = pickWaypoint({ x, y })
      place()
    } else if (glide) {
      wander = undefined
      // The target is the live pointer, so the glide keeps up if the pointer moves on.
      const progress = Math.min(1, (time - glide.start) / glide.duration)
      const eased = easeOutCubic(progress)
      x = glide.from.x + (pointer.x - glide.from.x) * eased
      y = glide.from.y + (pointer.y - glide.from.y) * eased
      place()
      if (progress === 1) glide = undefined
    } else {
      wander = undefined
    }
    frame = requestAnimationFrame(tick)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    const now = performance.now()
    pointer.x = event.clientX
    pointer.y = event.clientY
    if (now - lastMove > wanderAfterIdle) {
      const distance = Math.hypot(pointer.x - x, pointer.y - y)
      glide = { from: { x, y }, start: now, duration: returnDuration(distance) }
    }
    lastMove = now
    if (glide) return
    x = pointer.x
    y = pointer.y
    place()
  }

  place()
  frame = requestAnimationFrame(tick)
  window.addEventListener("pointermove", onPointerMove, { passive: true })
  cleanup = () => {
    window.removeEventListener("pointermove", onPointerMove)
    cancelAnimationFrame(frame)
  }
})

onBeforeUnmount(() => cleanup())
</script>

<template>
  <div
    ref="root"
    class="crayon-wallpaper"
    aria-hidden="true"
    :style="{ '--tile': tileUrl, '--tile-size': `${wallpaperTileSize}px` }"
  >
    <template v-if="tileUrl">
      <div class="wallpaper pencil" />
      <div class="wallpaper crayon" />
    </template>
  </div>
</template>

<style scoped>
.crayon-wallpaper {
  --mx: 70vw;
  --my: 30vh;
  position: fixed;
  inset: 0;
  pointer-events: none;
  /* Fades the wallpaper down behind the content column so the text stays readable. */
  mask-image: linear-gradient(
    to right,
    black,
    rgb(0 0 0 / 0.3) calc(50% - 20rem),
    rgb(0 0 0 / 0.3) calc(50% + 20rem),
    black
  );
}

.wallpaper {
  position: absolute;
  inset: 0;
  mask-size:
    var(--tile-size) var(--tile-size),
    100% 100%;
  mask-repeat: repeat, no-repeat;
}

.pencil {
  background: var(--text-muted);
  opacity: 0.22;
  mask-image: var(--tile);
}

.crayon {
  background: linear-gradient(
    125deg,
    var(--brutal-yellow),
    var(--brutal-orange) 22%,
    var(--brutal-pink) 40%,
    var(--brutal-purple) 58%,
    var(--brutal-blue) 76%,
    var(--brutal-green)
  );
  mask-image:
    var(--tile),
    radial-gradient(
      circle 200px at var(--mx) var(--my),
      black 45%,
      transparent 100%
    );
  mask-composite: intersect;
}

@media (prefers-reduced-motion: no-preference) {
  .wallpaper {
    animation: wallpaper-drift 96s linear infinite;
  }

  .crayon-wallpaper {
    animation: faded-in 1.2s ease 300ms both;
  }
}

@keyframes wallpaper-drift {
  from {
    mask-position:
      0 0,
      0 0;
  }

  to {
    mask-position:
      var(--tile-size) calc(var(--tile-size) * 2),
      0 0;
  }
}
</style>
