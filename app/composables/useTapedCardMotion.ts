import { onBeforeUnmount, onMounted } from "vue"

interface CardPointer {
  stage: HTMLElement
  clientX: number
  clientY: number
}

const pointerProperties = [
  "--pointer-lift",
  "--pointer-pitch",
  "--pointer-yaw",
  "--pointer-turn",
] as const

export function useTapedCardMotion() {
  let motionAllowed: MediaQueryList | undefined
  let pointer: CardPointer | undefined
  let frame = 0
  let followTimer = 0

  function resetCardPointer() {
    cancelAnimationFrame(frame)
    window.clearTimeout(followTimer)
    frame = 0
    followTimer = 0
    if (pointer) {
      for (const property of pointerProperties) {
        pointer.stage.style.removeProperty(property)
      }
      delete pointer.stage.dataset.pointerFollowing
    }
    pointer = undefined
  }

  function updateCardPose({ stage, clientX, clientY }: CardPointer) {
    const paper = stage.querySelector<HTMLElement>(".preview-paper")
    if (!paper) return

    // Measure the stationary stage so the tilted paper cannot feed back into its hit area.
    const bounds = stage.getBoundingClientRect()
    const style = getComputedStyle(stage)
    const width = Number.parseFloat(style.width)
    const height = Number.parseFloat(style.height)
    if (!width || !height) return
    const rotation = new DOMMatrixReadOnly(
      style.transform === "none" ? undefined : style.transform,
    )
    const dx = clientX - bounds.x - bounds.width / 2
    const dy = clientY - bounds.y - bounds.height / 2
    const x = Math.min(
      width,
      Math.max(0, rotation.a * dx + rotation.b * dy + width / 2),
    )
    const y = Math.min(
      height,
      Math.max(0, rotation.c * dx + rotation.d * dy + height / 2),
    )
    const anchorX = Number.parseFloat(getComputedStyle(paper).transformOrigin)
    const restingTurn = Number.parseFloat(
      style.getPropertyValue("--paper-hover-turn"),
    )
    const horizontalReach = Math.max(anchorX, width - anchorX)
    const down = y / height
    const across = (x - anchorX) / horizontalReach
    const reach = Math.min(
      1,
      Math.hypot(x - anchorX, y) / Math.hypot(horizontalReach, height),
    )

    // Start at the row's gentle lift and add more freedom away from the tape.
    stage.style.setProperty("--pointer-lift", String(0.35 + 0.65 * reach))
    stage.style.setProperty("--pointer-pitch", `${0.84 + 2 * down}deg`)
    stage.style.setProperty(
      "--pointer-yaw",
      `${-3 * across * (0.35 + 0.65 * down)}deg`,
    )
    // A little in-plane swing makes the free edge visible without steep perspective.
    stage.style.setProperty(
      "--pointer-turn",
      `${0.35 * restingTurn + 1.5 * across * (0.3 + 0.7 * down)}deg`,
    )
  }

  function trackCardPointer(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !motionAllowed?.matches) return
    const stage = event.currentTarget
    if (!(stage instanceof HTMLElement)) return
    if (pointer && pointer.stage !== stage) resetCardPointer()
    pointer = { stage, clientX: event.clientX, clientY: event.clientY }
    if (event.type === "pointerenter") {
      updateCardPose(pointer)
      followTimer = window.setTimeout(() => {
        followTimer = 0
        if (pointer?.stage === stage && motionAllowed?.matches) {
          stage.dataset.pointerFollowing = ""
        }
      }, 220)
      return
    }
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (pointer && motionAllowed?.matches) updateCardPose(pointer)
    })
  }

  onMounted(() => {
    motionAllowed = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    )
    motionAllowed.addEventListener("change", resetCardPointer)
  })

  onBeforeUnmount(() => {
    resetCardPointer()
    motionAllowed?.removeEventListener("change", resetCardPointer)
  })

  return { trackCardPointer, resetCardPointer }
}
