import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from "vue"

type AppliedColorMode = "dark" | "light"

function getColorModeValue(
  colorMode: ReturnType<typeof useColorMode>,
): AppliedColorMode {
  if (colorMode.value === "dark" || colorMode.preference === "dark") {
    return "dark"
  }

  return "light"
}

export function useAppliedColorMode() {
  const colorMode = useColorMode()
  const appliedValue = shallowRef<AppliedColorMode>(
    getColorModeValue(colorMode),
  )
  const isMounted = shallowRef(false)

  function syncFromDocument() {
    if (!import.meta.client) {
      return
    }

    appliedValue.value = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  }

  if (import.meta.client) {
    let observer: MutationObserver | undefined

    watch(
      () => [colorMode.preference, colorMode.value],
      async () => {
        await nextTick()
        syncFromDocument()
      },
      { immediate: true },
    )

    onMounted(() => {
      syncFromDocument()
      isMounted.value = true
      observer = new MutationObserver(syncFromDocument)
      observer.observe(document.documentElement, {
        attributeFilter: ["class"],
        attributes: true,
      })
    })

    onBeforeUnmount(() => {
      observer?.disconnect()
    })
  }

  const isDark = computed(() => {
    if (!isMounted.value) {
      if (import.meta.client) {
        return false
      }

      return getColorModeValue(colorMode) === "dark"
    }

    return appliedValue.value === "dark"
  })

  return {
    colorMode,
    isDark,
  }
}
