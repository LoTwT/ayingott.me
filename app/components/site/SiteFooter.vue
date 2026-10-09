<script setup lang="ts">
import { useRuntimeConfig } from "#imports"
import { ownerName } from "~/utils/profile"

const { copyrightYear } = useRuntimeConfig().public
</script>

<template>
  <footer class="flex min-h-(--site-footer-height) shrink-0 items-center">
    <p class="theme-color-transition text-xs leading-5 text-(--text-muted)">
      © {{ copyrightYear }} {{ ownerName }}
    </p>
  </footer>
</template>
