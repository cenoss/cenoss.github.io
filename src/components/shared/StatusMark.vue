<script setup>
// A source's collection status: a mark and its name, never colour alone.
// opened: solid blue · partial: half-filled · todo: an empty ring · context: grey
defineProps({ status: { type: String, required: true }, label: { type: String, required: true }, bare: { type: Boolean, default: false } });
</script>

<template>
  <span class="st" :class="`is-${status}`"><i aria-hidden="true"></i><span :class="{ 'rv-visually-hidden': bare }">{{ label }}</span></span>
</template>

<style scoped>
.st { display: inline-flex; align-items: center; gap: 7px; font: 500 11px/1.2 var(--rv-mono); letter-spacing: 0.02em; color: var(--rv-ink-2); white-space: nowrap; }
.st i { flex: none; width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid var(--rv-blue); }
.is-opened i { background: var(--rv-blue); }
.is-partial i { background: linear-gradient(90deg, var(--rv-blue) 50%, transparent 50%); }
.is-todo i { background: transparent; }
.is-context i { border-color: var(--rv-muted); background: color-mix(in oklab, var(--rv-muted) 35%, transparent); }
</style>
