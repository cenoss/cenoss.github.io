<script setup>
// A tool's real mark from public/icons, on a small tile; a tool without a permitted mark gets its initial.
const props = defineProps({ icon: { type: String, default: null }, name: { type: String, required: true }, size: { type: Number, default: 40 } });
const src = props.icon ? `${import.meta.env.BASE_URL}icons/${props.icon}.svg` : null;
</script>

<template>
  <span class="mark" :style="{ '--s': `${size}px` }" aria-hidden="true">
    <img v-if="src" :src="src" alt="" />
    <span v-else class="mark__type">{{ name.slice(0, 1) }}</span>
  </span>
</template>

<style scoped>
.mark { flex: none; display: grid; place-items: center; width: var(--s); height: var(--s); border-radius: 8px; background: #fbf9f4; border: 1px solid rgba(23, 21, 15, 0.12); }
.mark img { width: 62%; height: 62%; object-fit: contain; }
.mark__type { font: 400 calc(var(--s) * 0.48)/1 var(--rv-serif); color: #3a362e; }
</style>
