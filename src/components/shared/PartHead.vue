<script setup>
defineProps({
  n: { type: Number, required: true },
  total: { type: Number, required: true },
  label: { type: String, required: true },
});
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <div class="rv-part__head">
    <span class="rv-part__num">{{ pad(n) }}</span>
    <span>{{ label }}</span>
    <span class="rv-part__count" aria-hidden="true">{{ pad(n) }} / {{ pad(total) }}</span>
  </div>
</template>
