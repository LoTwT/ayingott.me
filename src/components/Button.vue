<script setup lang="ts">
const { text } = defineProps<{ text: string }>()
</script>

<template>
  <button data-text="Awesome" class="button">
    <span class="actual-text">&nbsp;{{ text }}&nbsp;</span>
    <span class="hover-text" aria-hidden="true">&nbsp;{{ text }}&nbsp;</span>
  </button>
</template>

<style scoped>
  /* === removing default button style ===*/
.button {
  margin: 0;
  background: transparent;
  padding: 0;
  border: none;
}

/* button styling */
.button {
  --border-right: .25rem;
  --text-stroke-color: rgba(255,255,255,0.6);
  --animation-color: #37FF8B;
  --fs-size: 2em;
  letter-spacing: 0.25rem;
  text-decoration: none;
  font-size: var(--fs-size);
  font-family: "Arial";
  position: relative;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: .0625rem var(--text-stroke-color);
}
/* this is the text, when you hover on button */
.hover-text {
  position: absolute;
  box-sizing: border-box;
  content: attr(data-text);
  color: var(--animation-color);
  width: 0%;
  inset: 0;
  border-right: var(--border-right) solid var(--animation-color);
  overflow: hidden;
  transition: 0.7s;
  -webkit-text-stroke: .0625rem var(--animation-color);
}
/* hover */
.button:hover .hover-text {
  width: 100%;
  filter: drop-shadow(0 0 1.4375rem var(--animation-color))
}
</style>
