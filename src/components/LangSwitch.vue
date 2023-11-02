<script setup lang="ts">
import { LOCALES_MAP } from "../i18n"

const { locale, availableLocales } = useI18n()
const lStorage = useLStorage()

watch(
  () => lStorage.value.locale,
  (l) => {
    locale.value = l
  },
)
</script>

<template>
  <select v-model="lStorage.locale" name="locale-change">
    <template v-for="l in availableLocales" :key="l">
      <option :value="l">
        {{ LOCALES_MAP[l] }}
      </option>
    </template>
  </select>
  <div>{{ locale }}</div>
</template>
