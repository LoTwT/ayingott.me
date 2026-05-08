<script setup lang="ts">
const { colorMode, isDark } = useAppliedColorMode()
const toggleLabel = computed(() =>
  isDark.value ? "切换到亮色模式" : "切换到暗色模式",
)

function toggleDark() {
  const payload = isDark.value ? "light" : "dark"
  colorMode.preference = payload
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle touch-target focus-ring"
    :aria-label="toggleLabel"
    :aria-pressed="isDark"
    :title="toggleLabel"
    @click="toggleDark"
  >
    <svg
      v-if="isDark"
      aria-hidden="true"
      class="theme-toggle__icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path
          fill-opacity="0"
          stroke="currentColor"
          stroke-dasharray="56"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.6s"
            values="56;0"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.7s"
            dur="0.4s"
            to="1"
          />
        </path>
        <path
          d="M15.22 6.03l2.53 -1.94l-3.19 -0.09l-1.06 -3l-1.06 3l-3.19 0.09l2.53 1.94l-0.91 3.06l2.63 -1.81l2.63 1.81l-0.91 -3.06Z"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            begin="1.2s"
            dur="6s"
            keyTimes="0;0.1;0.4;0.5;1"
            repeatCount="indefinite"
            values="0;1;1;0;0"
          />
        </path>
        <path
          d="M19.61 12.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17l-0.59 -1.98Z"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            begin="1.2s"
            dur="6s"
            keyTimes="0;0.2;0.3;0.6;0.7;1"
            repeatCount="indefinite"
            values="0;0;1;1;0;0"
          />
        </path>
        <path
          d="M13.61 5.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17Z"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            begin="4.2s"
            dur="6s"
            keyTimes="0;0.1;0.4;0.5;1"
            repeatCount="indefinite"
            values="0;1;1;0;0"
          />
        </path>
        <path
          d="M20.83 9.73l1.88 -1.44l-2.37 -0.07l-0.79 -2.22l-0.79 2.23l-2.37 0.07l1.88 1.44l-0.68 2.27l1.95 -1.34l1.95 1.34Z"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            begin="4.2s"
            dur="6s"
            keyTimes="0;0.2;0.3;0.6;0.7;1"
            repeatCount="indefinite"
            values="0;0;1;1;0;0"
          />
        </path>
      </g>
    </svg>
    <svg
      v-else
      aria-hidden="true"
      class="theme-toggle__icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path
          fill="currentColor"
          fill-opacity="0"
          stroke-dasharray="34"
          d="M12 7c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5Z"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.4s"
            values="34;0"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.5s"
            dur="0.4s"
            to="1"
          />
        </path>
        <g fill="none">
          <path d="M12 21v1M21 12h1M12 3v-1M3 12h-1" opacity="0">
            <animateTransform
              attributeName="transform"
              dur="30s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
            <set fill="freeze" attributeName="opacity" begin="1s" to="1" />
            <animate
              fill="freeze"
              attributeName="d"
              begin="1s"
              dur="0.2s"
              values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
            />
          </path>
          <path
            d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
            opacity="0"
          >
            <animateTransform
              attributeName="transform"
              dur="30s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
            <set fill="freeze" attributeName="opacity" begin="1.2s" to="1" />
            <animate
              fill="freeze"
              attributeName="d"
              begin="1.2s"
              dur="0.2s"
              values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
            />
          </path>
        </g>
      </g>
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-interactive);
}

.theme-toggle:hover {
  color: var(--text-accent);
  transform: scale(1.05);
}

.theme-toggle__icon {
  width: 24px;
  height: 24px;
}
</style>
