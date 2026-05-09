<script setup lang="ts">
import DecorativePrimitive from "~/components/site/DecorativePrimitive.vue"

defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

useHead({
  title: "未找到 · ayingott.me",
  htmlAttrs: {
    lang: "zh-CN",
  },
})

function goHome() {
  clearError({ redirect: "/" })
}
</script>

<template>
  <NuxtLayout>
    <section class="error-page" aria-labelledby="error-title">
      <div class="error-page__mark">404</div>
      <DecorativePrimitive class="error-page__line" kind="line" />

      <h1 id="error-title" class="error-page__title">未找到。</h1>
      <p class="error-page__copy">这个页面不在。首页还在。</p>

      <button
        type="button"
        class="error-page__button touch-target"
        @click="goHome"
      >
        回到首页
      </button>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error-page {
  width: min(100%, var(--container-reading));
  min-height: calc(100svh - 240px);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.error-page__mark {
  color: var(--accent-primary);
  font-family: var(--font-display);
  font-size: var(--text-7xl);
  line-height: var(--text-7xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-tighter);
}

.error-page__line {
  margin-block: var(--spacing-6);
}

.error-page__title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: var(--text-3xl--line-height);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--tracking-normal);
}

.error-page__copy {
  max-width: 28rem;
  margin: var(--spacing-4) 0 0;
  color: var(--text-muted);
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
}

.error-page__button {
  margin-top: var(--spacing-8);
  border: 0;
  border-radius: var(--radius-control);
  padding-inline: var(--spacing-5);
  background: var(--accent-primary);
  color: var(--accent-contrast);
  font-family: var(--font-display);
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-interactive);
}

.error-page__button:hover {
  transform: translateY(-1px);
}
</style>
