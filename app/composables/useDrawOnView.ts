import type { ShallowRef } from "vue"
import { onBeforeUnmount, onMounted, shallowRef } from "vue"

// Draws an annotation once it scrolls a little past the bottom edge of the viewport.
// With reduced motion it is drawn as soon as it mounts, without the stroke animation.
export function useDrawOnView(target: Readonly<ShallowRef<Element | null>>) {
  const isDrawn = shallowRef(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const element = target.value
    if (
      !element ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    ) {
      isDrawn.value = true
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        isDrawn.value = true
        observer?.disconnect()
      },
      { rootMargin: "0px 0px -20% 0px" },
    )
    observer.observe(element)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return isDrawn
}
