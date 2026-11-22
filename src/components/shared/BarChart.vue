<script setup>
import { ref } from 'vue';
import { useInView } from '../../composables/motion.js';

// One series of horizontal bars on a 0–100% scale. Values are labelled on the bars (text in ink, never the
// bar colour); the focal row is the only one in the accent. Hover dims the other rows.
const props = defineProps({
  rows: { type: Array, required: true },      // { name, value, focal?, note? }
  unit: { type: String, default: '' },         // read after the value by screen readers
  max: { type: Number, default: 100 },
  tag: { type: String, default: '' },          // a small tag on every row (e.g. "Friend and foe")
  axis: { type: Boolean, default: true },
});
const box = ref(null);
const run = useInView(box, { threshold: 0.5 });
const hovered = ref(null);
</script>

<template>
  <div ref="box" class="bars" :class="{ 'is-in': run }">
    <ul class="bars__list">
      <li
        v-for="(r, i) in rows"
        :key="r.name"
        class="bars__row"
        :class="{ 'is-focal': r.focal, 'is-dim': hovered !== null && hovered !== i }"
        :title="`${r.name}: ${r.value}% ${unit}`"
        @mouseenter="hovered = i"
        @mouseleave="hovered = null"
      >
        <span class="bars__name">{{ r.name }}<span v-if="r.note" class="bars__note">{{ r.note }}</span></span>
        <span class="bars__track" aria-hidden="true"><span class="bars__fill" :style="{ '--v': r.value / max, '--d': `${i * 90}ms` }"></span></span>
        <span class="bars__value">{{ r.value }}%<span class="rv-visually-hidden"> {{ unit }}</span></span>
        <span v-if="tag" class="bars__tag rv-tag">{{ tag }}</span>
      </li>
    </ul>
    <div v-if="axis" class="bars__axis" aria-hidden="true"><span>0</span><span>{{ max / 2 }}%</span><span>{{ max }}%</span></div>
  </div>
</template>

<style scoped>
.bars { --name: 132px; --val: 52px; width: 100%; }
.bars__list { display: flex; flex-direction: column; gap: 12px; }
.bars__row {
  display: grid; grid-template-columns: var(--name) minmax(0, 1fr) var(--val); align-items: center; gap: 4px 14px;
  transition: opacity 160ms ease;
}
.bars__row.is-dim { opacity: 0.4; }
.bars__name { display: flex; flex-direction: column; font-size: 15px; font-weight: 500; line-height: 1.25; }
.bars__note { font: 400 11px/1.3 var(--rv-mono); color: var(--rv-muted); margin-top: 2px; }
.bars__track { position: relative; height: 14px; background: color-mix(in oklab, var(--rv-ink) 7%, transparent); border-radius: 0 4px 4px 0; }
.bars__fill {
  position: absolute; inset: 0 auto 0 0; width: calc(var(--v) * 100%); background: var(--rv-ink); border-radius: 0 4px 4px 0;
  transform-origin: left; transform: scaleX(0); transition: transform 900ms cubic-bezier(.2, .7, .2, 1) var(--d);
}
.is-focal .bars__fill { background: var(--rv-red); }
.bars.is-in .bars__fill { transform: scaleX(1); }
.bars__value { font: 500 15px/1 var(--rv-mono); font-variant-numeric: tabular-nums; text-align: right; }
.bars__tag { grid-column: 2 / -1; justify-self: start; }
.bars__axis {
  display: flex; justify-content: space-between; margin: 8px calc(var(--val) + 14px) 0 calc(var(--name) + 14px);
  font: 400 11px/1 var(--rv-mono); color: var(--rv-muted);
}
@media (max-width: 480px) { .bars { --name: 104px; --val: 44px; } }
@media (prefers-reduced-motion: reduce) { .bars__fill { transition: none; transform: none; } }
</style>
