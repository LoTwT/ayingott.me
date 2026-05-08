<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <span>© {{ year }} Lo</span>
      <span aria-hidden="true">·</span>
      <span>MIT 许可证</span>
      <span aria-hidden="true">·</span>
      <span>ayingott.me</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: var(--spacing-8) var(--layout-page-gutter);
}

.site-footer__inner {
  max-width: var(--container-wide);
  margin-inline: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
}
</style>
