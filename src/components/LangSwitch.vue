<script setup lang="ts">
import { LOCALES_MAP } from "../i18n"

const { locale, availableLocales } = useI18n()
useLocalStorage("ayingott-locale", locale)
</script>

<template>
  <select name="locale-change" v-model="locale">
    <template v-for="l in availableLocales">
      <option :value="l">
        {{ LOCALES_MAP[l] }}
      </option>
    </template>
  </select>
  <div>{{ locale }}</div>
</template>
