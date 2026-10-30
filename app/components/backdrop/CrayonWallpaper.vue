<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
} from "vue"
import { wallpaperTileSize, wallpaperTileUrl } from "./wallpaper-tile"

// The whole page is doodle wallpaper in pencil grey, slowly drifting, laid out at random on
// every visit (see wallpaper-tile.ts). Around the pointer the same doodles show up in
// crayon colors, as if colored in where you look. When the pointer rests, or on touch
// screens, the crayon spot wanders on its own, and glides back once the pointer moves again.
// After 30s without input the spot fades out and everything stops but the drift.
//
// Kept cheap to render: the drift moves an oversized pencil layer with a transform, which
// the compositor handles without repainting, and the crayon colors live in a 400px box
// that follows the spot, so each frame repaints only that box. The box shifts its own mask
// and gradient by the drift and its position, so its doodles line up with the pencil ones.

// Built on the client: the layout is random, so rendering it on the server would not match.
// Until it exists the layers are not rendered, since without a mask they would be solid.
const tileUrl = shallowRef("")

const pencilRef = useTemplateRef<HTMLDivElement>("pencil")
const spotRef = useTemplateRef<HTMLDivElement>("spot")
const isResting = shallowRef(false)
const wanderAfterIdle = 1800
const restAfterIdle = 30_000
// Matches the opacity transition, so the loop stops only once the spot has faded out.
const fadeOutDuration = 600
const spotRadius = 200
// Each cycle moves one tile right and two tiles down, so the pattern loops seamlessly.
const driftDuration = 96_000
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

onMounted(async () => {
  tileUrl.value = wallpaperTileUrl()
  await nextTick()
  const pencil = pencilRef.value
  const spot = spotRef.value
  if (!pencil || !spot) return

  let x = window.innerWidth * 0.7
  let y = window.innerHeight * 0.3
  const motionAllowed = window.matchMedia(
    "(prefers-reduced-motion: no-preference)",
  ).matches
  const drift = motionAllowed
    ? pencil.animate(
        [
          { transform: "translate(0, 0)" },
          {
            transform: `translate(${wallpaperTileSize}px, ${wallpaperTileSize * 2}px)`,
          },
        ],
        { duration: driftDuration, iterations: Infinity },
      )
    : undefined

  // Moves the box to the spot and offsets its tile and gradient so they stay pinned to the
  // viewport and to the drifting pencil layer, whatever the box position.
  const place = () => {
    const driftTime = Number(drift?.currentTime ?? 0)
    const progress = (driftTime % driftDuration) / driftDuration
    const left = x - spotRadius
    const top = y - spotRadius
    const tileX = wallpaperTileSize * (progress - 1) - left
    const tileY = wallpaperTileSize * 2 * (progress - 1) - top
    spot.style.transform = `translate3d(${left}px, ${top}px, 0)`
    spot.style.maskPosition = `${tileX}px ${tileY}px, 0 0`
    spot.style.backgroundPosition = `${-left}px ${-top}px`
  }

  place()
  if (!motionAllowed) return

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
  let lastActivity = performance.now()
  let restingSince: number | undefined

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
    } else if (glide) {
      wander = undefined
      // The target is the live pointer, so the glide keeps up if the pointer moves on.
      const progress = Math.min(1, (time - glide.start) / glide.duration)
      const eased = easeOutCubic(progress)
      x = glide.from.x + (pointer.x - glide.from.x) * eased
      y = glide.from.y + (pointer.y - glide.from.y) * eased
      if (progress === 1) glide = undefined
    } else {
      wander = undefined
      x = pointer.x
      y = pointer.y
    }
    // The drift keeps moving the pencil layer, so the box is re-placed every frame.
    place()

    if (restingSince === undefined && time - lastActivity > restAfterIdle) {
      restingSince = time
      isResting.value = true
    }
    if (restingSince !== undefined && time - restingSince > fadeOutDuration) {
      frame = 0
      lastFrame = undefined
      return
    }
    frame = requestAnimationFrame(tick)
  }
  const wake = () => {
    lastActivity = performance.now()
    if (restingSince === undefined) return
    restingSince = undefined
    isResting.value = false
    if (!frame) frame = requestAnimationFrame(tick)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    wake()
    const now = performance.now()
    pointer.x = event.clientX
    pointer.y = event.clientY
    if (now - lastMove > wanderAfterIdle) {
      const distance = Math.hypot(pointer.x - x, pointer.y - y)
      glide = { from: { x, y }, start: now, duration: returnDuration(distance) }
    }
    lastMove = now
  }

  frame = requestAnimationFrame(tick)
  window.addEventListener("pointermove", onPointerMove, { passive: true })
  // Taps and scrolling count as activity too, so touch screens wake the spot.
  window.addEventListener("pointerdown", wake, { passive: true })
  window.addEventListener("scroll", wake, { passive: true })
  cleanup = () => {
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("pointerdown", wake)
    window.removeEventListener("scroll", wake)
    cancelAnimationFrame(frame)
    drift?.cancel()
  }
})

onBeforeUnmount(() => cleanup())
</script>

<template>
  <div
    class="crayon-wallpaper"
    aria-hidden="true"
    :style="{
      '--tile': tileUrl,
      '--tile-size': `${wallpaperTileSize}px`,
      '--spot-radius': `${spotRadius}px`,
    }"
  >
    <template v-if="tileUrl">
      <div ref="pencil" class="pencil" />
      <div
        ref="spot"
        class="crayon-spot"
        :class="{ 'is-resting': isResting }"
      />
    </template>
  </div>
</template>

<style scoped>
.crayon-wallpaper {
  position: fixed;
  inset: 0;
  overflow: hidden;
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

/* One tile wider and two tiles taller than the viewport, reaching up and left, so the
   drift can move it a full cycle without uncovering an edge. */
.pencil {
  position: absolute;
  top: calc(var(--tile-size) * -2);
  left: calc(var(--tile-size) * -1);
  right: 0;
  bottom: 0;
  background: var(--text-muted);
  opacity: 0.22;
  mask-image: var(--tile);
  mask-size: var(--tile-size) var(--tile-size);
  will-change: transform;
}

.crayon-spot {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--spot-radius) * 2);
  height: calc(var(--spot-radius) * 2);
  background: linear-gradient(
      125deg,
      var(--brutal-yellow),
      var(--brutal-orange) 22%,
      var(--brutal-pink) 40%,
      var(--brutal-purple) 58%,
      var(--brutal-blue) 76%,
      var(--brutal-green)
    )
    0 0 / 100vw 100vh no-repeat;
  mask-image:
    var(--tile), radial-gradient(closest-side, black 45%, transparent 100%);
  mask-size:
    var(--tile-size) var(--tile-size),
    100% 100%;
  mask-repeat: repeat, no-repeat;
  mask-composite: intersect;
  transition: opacity 600ms ease;
  will-change: transform;
}

.crayon-spot.is-resting {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .crayon-wallpaper {
    animation: faded-in 1.2s ease 300ms both;
  }
}
</style>
