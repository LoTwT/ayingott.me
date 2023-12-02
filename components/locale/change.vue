<script setup lang="ts">
const router = useRouter()

const { locale } = useI18n()
const localePath = useLocalePath()

const changeLocale = () => {
  locale.value = locale.value === "en" ? "zh" : "en"
  router.push(localePath("resume"))
}

const iconsMap: Record<string, string> = {
  en: "english",
  zh: "chinese",
}

const icon = computed(() => `i-icon-park-outline-${iconsMap[locale.value]}`)
</script>

<template>
  <button flex items-center justify-center @click="changeLocale">
    <div :class="[icon]" header-icon />
  </button>
</template>
