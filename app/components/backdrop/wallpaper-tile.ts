import type { BackdropShape } from "./backdrop-shapes"
import { backdropShapeNames, backdropShapes } from "./backdrop-shapes"

// The wallpaper tile scatters doodles at random positions with a minimum spacing (Poisson
// disc sampling), then lets crowded doodles push each other apart for a few rounds so the
// empty patches shrink. They spread evenly without lining up in rows or columns. The tile
// repeats, so distances wrap around its edges, and a doodle that crosses an edge is drawn
// again on the opposite side. Each visit draws a new tile: shapes are dealt from a shuffled
// deck so every shape shows up about equally, nearby doodles never share a shape, and each
// doodle gets its own tilt and size.
export const wallpaperTileSize = 480
const doodleCount = 26
const minSpacing = 72
const sameShapeSpacing = minSpacing * 1.6
const placementAttempts = 4000
// Measured over 200 random tiles, 16 rounds shrink the largest empty patch from about 80px
// to about 67px in radius; many more rounds barely help and start to form a regular lattice.
const relaxRounds = 16
const shapeBox = 48
// Half the diagonal of a 48px box: the furthest a tilted doodle reaches from its center.
const doodleReach = 34

type Point = { x: number; y: number }

// Distance on the repeating tile: across an edge is as near as within it.
function wrappedDistance(a: Point, b: Point) {
  const dx = Math.abs(a.x - b.x)
  const dy = Math.abs(a.y - b.y)
  return Math.hypot(
    Math.min(dx, wallpaperTileSize - dx),
    Math.min(dy, wallpaperTileSize - dy),
  )
}

function scatterPoints(random: () => number) {
  const points: Point[] = []
  for (
    let attempt = 0;
    attempt < placementAttempts && points.length < doodleCount;
    attempt++
  ) {
    const candidate = {
      x: random() * wallpaperTileSize,
      y: random() * wallpaperTileSize,
    }
    if (
      points.every((point) => wrappedDistance(point, candidate) >= minSpacing)
    )
      points.push(candidate)
  }
  return points
}

// Signed shortest offset from one coordinate to another on the repeating tile.
function wrappedDelta(from: number, to: number) {
  const delta = to - from
  if (delta > wallpaperTileSize / 2) return delta - wallpaperTileSize
  if (delta < -wallpaperTileSize / 2) return delta + wallpaperTileSize
  return delta
}

// Each round, doodles closer than a little over the ideal even spacing push each other
// apart, harder the closer they are; positions wrap around the tile.
function relax(points: Point[]) {
  const idealSpacing = Math.sqrt(
    (2 * wallpaperTileSize ** 2) / (Math.sqrt(3) * points.length),
  )
  const reach = idealSpacing * 1.25
  const step = idealSpacing * 0.12
  for (let round = 0; round < relaxRounds; round++) {
    const pushes = points.map((point) => {
      const push = { x: 0, y: 0 }
      for (const other of points) {
        const dx = wrappedDelta(other.x, point.x)
        const dy = wrappedDelta(other.y, point.y)
        const distance = Math.hypot(dx, dy)
        if (distance === 0 || distance >= reach) continue
        const strength = (reach - distance) / reach
        push.x += (dx / distance) * strength
        push.y += (dy / distance) * strength
      }
      return push
    })
    points.forEach((point, index) => {
      const size = wallpaperTileSize
      point.x = (((point.x + pushes[index]!.x * step) % size) + size) % size
      point.y = (((point.y + pushes[index]!.y * step) % size) + size) % size
    })
  }
  return points
}

function shuffled<T>(items: readonly T[], random: () => number) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap]!, result[index]!]
  }
  return result
}

function dealShapes(points: Point[], random: () => number) {
  let deck: BackdropShape[] = []
  while (deck.length < points.length)
    deck = [...deck, ...shuffled(backdropShapeNames, random)]

  const shapes: BackdropShape[] = []
  points.forEach((point, index) => {
    const nearby = new Set(
      shapes.filter(
        (_, other) => wrappedDistance(points[other]!, point) < sameShapeSpacing,
      ),
    )
    const pick = deck.findIndex((shape) => !nearby.has(shape))
    shapes[index] = deck.splice(Math.max(pick, 0), 1)[0]!
  })
  return shapes
}

// Copies needed so a doodle near an edge also appears across it.
function wrappedOffsets(value: number) {
  const offsets = [0]
  if (value < doodleReach) offsets.push(wallpaperTileSize)
  if (value > wallpaperTileSize - doodleReach) offsets.push(-wallpaperTileSize)
  return offsets
}

export function wallpaperTileUrl(random: () => number = Math.random) {
  const between = (min: number, max: number) => min + random() * (max - min)
  const points = relax(scatterPoints(random))
  const shapes = dealShapes(points, random)
  const doodles = points.flatMap((point, index) => {
    const scale = between(0.85, 1)
    const half = (shapeBox * scale) / 2
    const rotation = between(-22, 22)
    // Scaling would also thin the line, so the stroke is widened back to the same 2.2px.
    const body = `scale(${scale.toFixed(2)}) rotate(${rotation.toFixed(1)} 24 24)' stroke-width='${(2.2 / scale).toFixed(2)}'><path d='${backdropShapes[shapes[index]!]}'/></g>`
    return wrappedOffsets(point.x).flatMap((offsetX) =>
      wrappedOffsets(point.y).map(
        (offsetY) =>
          `<g transform='translate(${(point.x + offsetX - half).toFixed(1)} ${(point.y + offsetY - half).toFixed(1)}) ${body}`,
      ),
    )
  })
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${wallpaperTileSize}' height='${wallpaperTileSize}' viewBox='0 0 ${wallpaperTileSize} ${wallpaperTileSize}' fill='none' stroke='black' stroke-linecap='round' stroke-linejoin='round'>${doodles.join("")}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
