<template>
  <div class="design-system-preview" aria-hidden="true">
    <div class="specimen-guides"></div>
    <span class="specimen-lettering font-display">Aa</span>
    <div class="specimen-palette">
      <span class="specimen-color specimen-blue"></span>
      <span class="specimen-color specimen-mint"></span>
      <span class="specimen-color specimen-amber"></span>
    </div>
    <span class="specimen-name font-mono">AYINGOTT</span>
  </div>
</template>

<style scoped>
.design-system-preview {
  --specimen-blue: var(--color-sky-400);
  --specimen-mint: var(--color-mint-300);
  --specimen-amber: var(--color-amber-200);
  --specimen-guide: color-mix(in srgb, var(--text-primary) 13%, transparent);
  position: relative;
  container-type: inline-size;
  overflow: hidden;
  width: 100%;
  height: 100%;
  color: var(--text-primary);
}

.specimen-guides {
  position: absolute;
  top: 25%;
  bottom: 26%;
  left: 8.5%;
  width: 46%;
  border-block: 1px solid var(--specimen-guide);
}

.specimen-guides::before {
  position: absolute;
  top: -8%;
  bottom: -8%;
  left: 2%;
  border-left: 1px solid var(--specimen-guide);
  content: "";
}

.specimen-lettering {
  position: absolute;
  top: 26%;
  left: 8%;
  font-size: 36cqw;
  font-weight: 600;
  line-height: 0.85;
  letter-spacing: -0.075em;
}

.specimen-palette {
  position: absolute;
  top: 23%;
  right: 9%;
  width: 31%;
  height: 53%;
}

.specimen-color {
  position: absolute;
  display: block;
}

.specimen-blue {
  top: 8%;
  left: 0;
  width: 72%;
  height: 66%;
  background: var(--specimen-blue);
}

.specimen-mint {
  right: 0;
  bottom: 0;
  width: 51%;
  height: 53%;
  border-radius: 0 0 28% 0;
  background: var(--specimen-mint);
}

.specimen-amber {
  top: 0;
  right: 0;
  width: 29%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--specimen-amber);
}

.specimen-name {
  position: absolute;
  bottom: 10.5%;
  left: 9%;
  color: var(--text-secondary);
  font-size: 3.35cqw;
  line-height: 1;
  letter-spacing: 0.14em;
}

:global(.dark .design-system-preview) {
  --specimen-blue: var(--color-sky-300);
}
</style>
