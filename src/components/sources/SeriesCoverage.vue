<script setup>
import { ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import StatusMark from '../shared/StatusMark.vue';
import { useInView } from '../../composables/motion.js';

// The dashboard series (§3.3) on one year axis: each row's planned span as a bar, the years already in hand
// as dots. Priority order, top to bottom.
const props = defineProps({
  t: { type: Object, required: true },
  statusNames: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const y0 = Math.min(...props.t.rows.map((r) => r.from));
const y1 = Math.max(...props.t.rows.map((r) => r.to));
const years = Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i);
const cell = 100 / years.length;
const x = (yr) => (yr - y0) * cell;                       // left edge of a year's cell
const box = ref(null);
const run = useInView(box, { threshold: 0.15 });
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <div :id="t.id" class="rv-part series">
    <PartHead :n="n" :total="total" :label="t.label" />
    <div class="series__head">
      <h3 class="rv-h3">{{ t.title }}</h3>
      <p class="rv-body">{{ t.text }}</p>
    </div>

    <figure ref="box" class="cov" :class="{ 'is-in': run }">
      <figcaption class="cov__legend">
        <span class="cov__key is-span">{{ t.legend.span }}</span>
        <span class="cov__key is-have">{{ t.legend.have }}</span>
      </figcaption>
      <div class="cov__axis" aria-hidden="true">
        <span></span>
        <div class="cov__years"><span v-for="yr in years" :key="yr" :style="{ left: `${x(yr) + cell / 2}%` }">{{ '’' + String(yr).slice(2) }}</span></div>
        <span></span>
      </div>
      <ol class="cov__rows">
        <li v-for="(r, i) in t.rows" :key="r.key" class="cov__row">
          <div class="cov__label">
            <span class="cov__n">{{ pad(i + 1) }}</span>
            <span><b>{{ r.name }}</b><span>{{ r.source }}</span></span>
          </div>
          <div class="cov__track" :title="`${r.from}–${r.to}${r.have.length ? ' · ' + r.have.join(', ') : ''}`">
            <span class="rv-visually-hidden">{{ r.from }}–{{ r.to }}. {{ t.legend.have }}: {{ r.have.length ? r.have.join(', ') : '–' }}.</span>
            <span v-for="yr in years" :key="yr" class="cov__grid" :style="{ left: `${x(yr)}%` }" aria-hidden="true"></span>
            <span class="cov__span" :class="`is-${r.status}`" :style="{ left: `${x(r.from)}%`, width: `${(r.to - r.from + 1) * cell}%`, '--d': `${i * 50}ms` }" aria-hidden="true"></span>
            <span v-for="yr in r.have" :key="yr" class="cov__dot" :style="{ left: `${x(yr) + cell / 2}%`, '--d': `${300 + i * 50}ms` }" aria-hidden="true"></span>
          </div>
          <div class="cov__meta">
            <StatusMark :status="r.status" :label="statusNames[r.status]" />
            <span class="cov__chart">{{ r.chart }}</span>
          </div>
        </li>
      </ol>
    </figure>
  </div>
</template>

<style scoped>
.series__head { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(32px, 6vw, 96px); align-items: end; }
.cov { --label: minmax(220px, 3.2fr); --meta: minmax(180px, 2.2fr); margin-top: clamp(40px, 5vw, 64px); display: flex; flex-direction: column; }
.cov__legend { display: flex; gap: 22px; margin-bottom: 14px; font-size: 13px; color: var(--rv-ink-2); }
.cov__key { display: inline-flex; align-items: center; gap: 8px; }
.cov__key.is-span::before { content: ""; width: 26px; height: 10px; border-radius: 0 3px 3px 0; background: color-mix(in oklab, var(--rv-blue) 22%, transparent); border: 1px solid color-mix(in oklab, var(--rv-blue) 45%, transparent); }
.cov__key.is-have::before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--rv-blue); box-shadow: 0 0 0 2px var(--rv-paper); }
.cov__axis, .cov__row { display: grid; grid-template-columns: var(--label) minmax(0, 6fr) var(--meta); gap: 20px; align-items: center; }
.cov__axis { padding-bottom: 8px; border-bottom: 1px solid var(--rv-ink); }
.cov__years { position: relative; height: 14px; }
.cov__years span { position: absolute; translate: -50% 0; font: 400 11px/1 var(--rv-mono); color: var(--rv-muted); }
.cov__row { padding: 12px 0; border-bottom: 1px solid var(--rv-line); transition: background-color 150ms ease; }
.cov__row:hover { background: color-mix(in oklab, var(--rv-paper-2) 60%, transparent); }
.cov__label { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 8px; align-items: baseline; }
.cov__label > span:last-child { display: flex; flex-direction: column; gap: 2px; }
.cov__n { font: 500 11px var(--rv-mono); color: var(--rv-red); }
.cov__label b { font-size: 14px; font-weight: 600; line-height: 1.3; }
.cov__label b + span { font: 400 11px/1.3 var(--rv-mono); color: var(--rv-muted); }
.cov__track { position: relative; height: 22px; }
.cov__grid { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--rv-line); }
.cov__span {
  position: absolute; top: 5px; height: 12px; border-radius: 0 4px 4px 0;
  background: color-mix(in oklab, var(--rv-blue) 22%, transparent); border: 1px solid color-mix(in oklab, var(--rv-blue) 45%, transparent);
  transform-origin: left; transform: scaleX(0); transition: transform 800ms cubic-bezier(.2, .7, .2, 1) var(--d);
}
.cov__span.is-todo { background: repeating-linear-gradient(135deg, color-mix(in oklab, var(--rv-blue) 18%, transparent) 0 3px, transparent 3px 7px); }
.cov.is-in .cov__span { transform: scaleX(1); }
.cov__dot {
  position: absolute; top: 50%; width: 11px; height: 11px; border-radius: 50%; background: var(--rv-blue); box-shadow: 0 0 0 2px var(--rv-paper);
  translate: -50% -50%; opacity: 0; transition: opacity 300ms ease var(--d);
}
.cov.is-in .cov__dot { opacity: 1; }
.cov__meta { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.cov__chart { font-size: 13px; color: var(--rv-ink-2); line-height: 1.35; }

@media (max-width: 1100px) { .cov { --label: minmax(180px, 3fr); --meta: minmax(140px, 2fr); } }
@media (max-width: 900px) { .series__head { grid-template-columns: minmax(0, 1fr); gap: 20px; } }
@media (max-width: 760px) {
  .cov__axis { grid-template-columns: minmax(0, 1fr); }
  .cov__axis > span { display: none; }
  .cov__row { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .cov__years span:nth-child(even) { visibility: hidden; }
  .cov__meta { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
}
@media (prefers-reduced-motion: reduce) { .cov__span, .cov__dot { transition: none; transform: none; opacity: 1; } }
</style>
