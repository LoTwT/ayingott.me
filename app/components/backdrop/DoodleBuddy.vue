<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from "vue"

// A little hand-drawn creature lives at the bottom of the right margin. It peeks up when the
// page loads, blinks, waves now and then in stop-motion steps, and hops with a greeting when
// clicked. It is decorative, so it stays out of the accessibility tree and the tab order.
const isHopping = shallowRef(false)
const greeting = shallowRef("")
const greetings = ["嗨！", "你好呀", "我是 Lo 画的", "别戳啦", "♪"]
let greetingIndex = 0
let timer = 0

function poke() {
  greeting.value = greetings[greetingIndex++ % greetings.length]!
  isHopping.value = false
  requestAnimationFrame(() => (isHopping.value = true))
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    greeting.value = ""
    isHopping.value = false
  }, 1600)
}

onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<template>
  <div class="doodle-buddy" aria-hidden="true">
    <svg class="boil-filters">
      <filter v-for="seed in 3" :id="`buddy-boil-${seed}`" :key="seed">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.05"
          numOctaves="2"
          :seed="seed * 7"
        />
        <feDisplacementMap in="SourceGraphic" scale="2.2" />
      </filter>
    </svg>
    <div class="buddy" :class="{ 'is-hopping': isHopping }" @click="poke">
      <span v-if="greeting" class="speech">{{ greeting }}</span>
      <svg class="buddy-body" viewBox="0 0 90 84">
        <path
          class="body"
          d="M18 84 C 12 60, 16 26, 42 22 C 68 18, 76 52, 70 84"
        />
        <path
          class="sprout"
          d="M42 22 C 39 14, 45 11, 43 4 M43 9 C 47 6, 51 8, 52 5"
        />
        <g class="eyes">
          <ellipse cx="35" cy="45" rx="3" ry="4.2" />
          <ellipse cx="52" cy="44" rx="3" ry="4.2" />
        </g>
        <circle class="cheek" cx="28" cy="54" r="4" />
        <circle class="cheek" cx="60" cy="53" r="4" />
        <path class="mouth" d="M38 55 C 41 59, 46 59, 49 55" />
        <path class="arm left-arm" d="M19 62 C 10 64, 6 70, 7 76" />
        <path class="arm right-arm" d="M69 60 C 78 56, 82 49, 80 42" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.doodle-buddy {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.boil-filters {
  position: absolute;
  width: 0;
  height: 0;
}

.buddy {
  position: absolute;
  bottom: -6px;
  left: calc(50% + 24rem + 40px);
  width: 90px;
  height: 84px;
  pointer-events: auto;
  cursor: pointer;
  transform-origin: bottom center;
}

/* Narrow screens: it peeks in from the right edge instead. */
@media (width < 1100px) {
  .buddy {
    left: auto;
    right: -22px;
    bottom: 96px;
    rotate: -90deg;
    scale: 0.7;
    transform-origin: center;
  }
}

.buddy-body {
  width: 100%;
  height: 100%;
  overflow: visible;
  stroke: var(--brutal-sticker-ink);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.body {
  fill: var(--brutal-yellow);
}

.sprout,
.mouth,
.arm {
  fill: none;
}

.sprout {
  stroke: var(--brutal-green);
  stroke-width: 2.8;
}

.eyes {
  fill: var(--brutal-sticker-ink);
  stroke: none;
  transform-box: fill-box;
  transform-origin: center;
}

.cheek {
  fill: var(--brutal-pink);
  stroke: none;
  opacity: 0.7;
}

.arm {
  transform-box: fill-box;
}

.left-arm {
  transform-origin: right top;
}

.right-arm {
  transform-origin: left bottom;
}

.speech {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  padding: 4px 10px;
  border: 2px solid var(--brutal-sticker-ink);
  border-radius: 14px 14px 14px 4px;
  background: var(--surface-elevated);
  color: var(--text-primary);
  font-size: 13px;
  white-space: nowrap;
  rotate: -4deg;
}

@keyframes speech-pop {
  from {
    opacity: 0;
    scale: 0.4;
    translate: -10px 10px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .buddy {
    animation: buddy-peek 900ms var(--ease-sticker) 1200ms both;
  }

  .buddy-body {
    animation: buddy-boil 600ms steps(1, end) infinite;
  }

  .eyes {
    animation: buddy-blink 4.2s steps(1, end) 2s infinite;
  }

  /* Waves in three held poses, like stop-motion, once every eight seconds. */
  .right-arm {
    animation: buddy-wave 8s steps(1, end) 2.6s infinite;
  }

  .buddy.is-hopping {
    animation: buddy-hop 520ms var(--ease-sticker);
  }

  .speech {
    animation: speech-pop 320ms var(--ease-sticker) both;
  }
}

@media (prefers-reduced-motion: no-preference) and (width < 1100px) {
  .buddy {
    animation: none;
  }
}

@keyframes buddy-peek {
  from {
    translate: 0 100%;
  }

  60% {
    translate: 0 -8%;
  }
}

@keyframes buddy-boil {
  0% {
    filter: url("#buddy-boil-1");
  }

  33% {
    filter: url("#buddy-boil-2");
  }

  66% {
    filter: url("#buddy-boil-3");
  }
}

@keyframes buddy-blink {
  0%,
  96% {
    scale: 1 1;
  }

  97% {
    scale: 1 0.15;
  }
}

@keyframes buddy-wave {
  0%,
  12% {
    rotate: 0deg;
  }

  2%,
  6%,
  10% {
    rotate: -28deg;
  }

  4%,
  8% {
    rotate: 6deg;
  }
}

@keyframes buddy-hop {
  30% {
    translate: 0 -26px;
    scale: 0.94 1.08;
  }

  60% {
    translate: 0 0;
    scale: 1.08 0.92;
  }
}
</style>
