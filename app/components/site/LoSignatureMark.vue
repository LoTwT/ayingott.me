<template>
  <svg
    class="lo-signature-mark"
    viewBox="0 0 96 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      class="lo-signature-mark__path"
      pathLength="1"
      vector-effect="non-scaling-stroke"
      d="M 24 6 C 14 10 10 21 12 30 C 14 41 31 39 45 31 C 53 26 58 19 61 14 C 65 7 76 10 78 18 C 81 29 68 38 58 32 C 48 26 55 14 68 15 C 82 16 91 26 86 35 C 82 43 69 42 58 34"
    />
  </svg>
</template>

<style scoped>
.lo-signature-mark {
  width: var(--lo-signature-width, 54px);
  height: var(--lo-signature-height, 36px);
  display: block;
  overflow: visible;
}

.lo-signature-mark__path {
  opacity: 0;
  stroke: currentColor;
  stroke-width: var(--lo-signature-stroke-width, 2.35);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: lo-signature-loop 8s linear infinite;
}

@keyframes lo-signature-loop {
  0%,
  1% {
    opacity: 0;
    stroke-dashoffset: 1;
  }

  2% {
    opacity: 1;
  }

  30%,
  82% {
    opacity: 1;
    stroke-dashoffset: 0;
  }

  95% {
    opacity: 0;
    stroke-dashoffset: 0;
  }

  96%,
  100% {
    opacity: 0;
    stroke-dashoffset: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lo-signature-mark__path {
    animation: none;
    opacity: 1;
    stroke-dashoffset: 0;
  }
}
</style>
