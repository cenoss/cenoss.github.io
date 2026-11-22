<script setup>
import { ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import { useInView } from '../../composables/motion.js';

defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const box = ref(null);
const run = useInView(box, { threshold: 0.3 });
const glyph = { up: '↗', flat: '→', down: '↘' };
</script>

<template>
  <div :id="t.id" class="rv-part event">
    <PartHead :n="n" :total="total" :label="t.label" />
    <div class="event__head">
      <h3 class="rv-h3">{{ t.title }}</h3>
      <p class="rv-body">{{ t.text }}</p>
    </div>
    <ul ref="box" class="event__cards" :class="{ 'is-in': run }">
      <li v-for="(c, i) in t.cards" :key="c.key" class="card rv-rise" :class="`is-${c.tone}`" :style="{ transitionDelay: `${i * 120}ms` }">
        <span class="card__who">{{ c.who }}</span>
        <span class="card__value"><span class="card__glyph" aria-hidden="true">{{ glyph[c.tone] }}</span>{{ c.value }}</span>
        <span class="card__caption">{{ c.caption }}</span>
        <a class="rv-source" :href="c.href" target="_blank" rel="noopener">{{ c.source }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.event__head { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(32px, 6vw, 96px); align-items: end; }
.event__cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--rv-gap); margin-top: clamp(36px, 4.4vw, 56px); }
.card { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; padding: clamp(22px, 2.6vw, 32px); background: var(--rv-paper-2); border-top: 4px solid var(--rv-ink); }
.card.is-up { border-top-color: var(--rv-blue); }
.card.is-down { border-top-color: var(--rv-red); }
.card__who { font: 500 12px/1.4 var(--rv-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rv-muted); }
.card__value { display: inline-flex; align-items: baseline; gap: 10px; white-space: nowrap; font: 300 clamp(36px, 3.8vw, 56px)/1 var(--rv-serif); letter-spacing: -0.02em; font-variant-numeric: lining-nums; }
html[lang^="zh"] .card__value { font-weight: 400; letter-spacing: 0; }
.card__glyph { font-family: var(--rv-sans); font-size: 0.55em; }
.is-up .card__glyph { color: var(--rv-blue); }
.is-down .card__glyph { color: var(--rv-red); }
.is-flat .card__glyph { color: var(--rv-muted); }
.card__caption { font-size: 15px; color: var(--rv-ink-2); }
@media (max-width: 900px) {
  .event__head { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .event__cards { grid-template-columns: minmax(0, 1fr); }
}
</style>
