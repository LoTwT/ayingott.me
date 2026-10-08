import { onBeforeUnmount, onMounted } from "vue"

export function useMagneticPointer(maximumOffset = 3) {
  let pointerCapabilities: MediaQueryList | undefined
  let activeControl: HTMLElement | undefined

  function resetMagneticOffset() {
    activeControl?.style.removeProperty("--magnetic-x")
    activeControl?.style.removeProperty("--magnetic-y")
    activeControl = undefined
  }

  function moveMagneticIcon(event: PointerEvent) {
    if (
      !pointerCapabilities?.matches ||
      event.pointerType === "touch" ||
      !(event.currentTarget instanceof HTMLElement) ||
      event.currentTarget.matches(":disabled")
    ) {
      resetMagneticOffset()
      return
    }

    const control = event.currentTarget
    const bounds = control.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return

    if (activeControl !== control) resetMagneticOffset()
    activeControl = control

    const horizontalPosition = Math.max(
      -1,
      Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2),
    )
    const verticalPosition = Math.max(
      -1,
      Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2),
    )
    const scale =
      maximumOffset /
      Math.max(1, Math.hypot(horizontalPosition, verticalPosition))

    control.style.setProperty("--magnetic-x", `${horizontalPosition * scale}px`)
    control.style.setProperty("--magnetic-y", `${verticalPosition * scale}px`)
  }

  onMounted(() => {
    pointerCapabilities = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    )
    pointerCapabilities.addEventListener("change", resetMagneticOffset)
    document.addEventListener("visibilitychange", resetMagneticOffset)
  })

  onBeforeUnmount(() => {
    pointerCapabilities?.removeEventListener("change", resetMagneticOffset)
    document.removeEventListener("visibilitychange", resetMagneticOffset)
    resetMagneticOffset()
  })

  return { moveMagneticIcon, resetMagneticOffset }
}
