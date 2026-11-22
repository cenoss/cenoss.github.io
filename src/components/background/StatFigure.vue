<script setup>
import { toRef } from 'vue';
import { useCountUp } from '../../composables/motion.js';

const props = defineProps({
  stat: { type: Object, required: true },
  run: { type: Boolean, default: false },
});
// a stat with `from` counts down from it (561 staff to 385); the others count up from zero
const shown = useCountUp(toRef(props, 'run'), props.stat.from ?? 0, props.stat.value);
const isSymbol = props.stat.unit === '%';
</script>

<template>
  <div class="stat">
    <p class="stat__figure">
      <span class="rv-visually-hidden">{{ stat.from ? `${stat.from} → ` : '' }}{{ stat.value }}{{ isSymbol ? '' : ' ' }}{{ stat.unit }}</span>
      <span class="stat__visual" aria-hidden="true">
        <span v-if="stat.from" class="stat__from">{{ stat.from }}<span class="stat__arrow">→</span></span>
        <span class="stat__num">{{ shown }}</span>
        <span class="stat__unit" :class="{ 'is-symbol': isSymbol }">{{ stat.unit }}</span>
      </span>
    </p>
    <p class="stat__caption">{{ stat.caption }}</p>
    <a class="rv-source" :href="stat.href" target="_blank" rel="noopener">{{ stat.source }}</a>
  </div>
</template>

<style scoped>
.stat { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.stat__figure { margin: 0; }
.stat__visual { display: flex; align-items: baseline; flex-wrap: wrap; column-gap: 6px; }
.stat__num {
  font-family: var(--rv-serif); font-weight: 300; font-optical-sizing: auto;
  font-size: clamp(64px, 7.4vw, 112px); line-height: 0.9; letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums lining-nums;
}
.stat__unit { font: 500 15px/1.2 var(--rv-sans); color: var(--rv-ink-2); }
.stat__unit.is-symbol {
  font-family: var(--rv-serif); font-weight: 300; font-size: clamp(32px, 3.6vw, 54px); color: inherit; margin-left: -2px;
}
.stat__from {
  display: inline-flex; align-items: baseline; gap: 8px; margin-right: 6px;
  font: 400 clamp(22px, 2.2vw, 30px)/1 var(--rv-serif); color: var(--rv-muted);
  text-decoration: line-through; text-decoration-thickness: 1px; text-decoration-color: var(--rv-red);
}
.stat__arrow { text-decoration: none; display: inline-block; font-family: var(--rv-sans); font-size: 0.7em; }
.stat__caption { margin: 0; max-width: 30ch; font-size: 15px; line-height: 1.5; color: var(--rv-ink-2); }
</style>
