<script setup>
import { computed, ref } from 'vue';
import { useElementWidth, useInView } from '../../composables/motion.js';

// Two series over sparse years: where ETtoday's visits come from. Drawn at real size so its text stays legible.
// Colour follows the series (direct = blue, social = red; a validated pair); identity also by legend and end labels.
const props = defineProps({ chart: { type: Object, required: true } });

const box = ref(null);
const width = useElementWidth(box);
const run = useInView(box, { threshold: 0.4 });

const years = computed(() => props.chart.series.flatMap((s) => s.points.map((p) => p.year)));
const x0 = computed(() => Math.min(...years.value));
const x1 = computed(() => Math.max(...years.value));
const yMax = 60;
const ticks = [0, 20, 40, 60];

const wide = computed(() => width.value >= 520);
const m = computed(() => ({ top: 28, right: wide.value ? 132 : 56, bottom: 30, left: 40 }));
const height = computed(() => Math.round(Math.min(340, Math.max(260, width.value * 0.52))));
const x = (yr) => m.value.left + ((yr - x0.value) / (x1.value - x0.value)) * (width.value - m.value.left - m.value.right);
const y = (v) => m.value.top + (1 - v / yMax) * (height.value - m.value.top - m.value.bottom);

// one segment per neighbouring pair: solid across one year, dashed across a gap in the data
const series = computed(() => props.chart.series.map((s) => {
  const pts = s.points.map((p) => ({ ...p, cx: x(p.year), cy: y(p.value) }));
  const segs = pts.slice(1).map((p, i) => ({ a: pts[i], b: p, gap: p.year - pts[i].year > 1 }));
  return { ...s, pts, segs, last: pts[pts.length - 1] };
}));

// the stretch with no data: between the first year and the next one collected
const gap = computed(() => {
  const ys = [...new Set(years.value)].sort((a, b) => a - b);
  const i = ys.findIndex((yr, k) => k > 0 && yr - ys[k - 1] > 1);
  return i > 0 ? { from: x(ys[i - 1]) + 10, to: x(ys[i]) - 10 } : null;
});

const tip = ref(null);
const show = (s, p) => { tip.value = { name: s.name, key: s.key, year: p.year, value: p.value, left: p.cx, top: p.cy }; };
const hide = () => { tip.value = null; };
const fmt = (v) => `${v}%`;
</script>

<template>
  <figure class="tc" :class="{ 'is-in': run }">
    <figcaption class="tc__cap">
      <span class="rv-label">{{ chart.label }}</span>
      <span class="tc__legend" aria-hidden="true">
        <span v-for="s in chart.series" :key="s.key" class="tc__key" :class="`is-${s.key}`">{{ s.name }}</span>
      </span>
    </figcaption>

    <div ref="box" class="tc__plot">
      <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" role="img" :aria-label="chart.label">
        <!-- recessive grid -->
        <g class="tc__grid">
          <g v-for="t in ticks" :key="t">
            <line :x1="m.left" :x2="width - m.right" :y1="y(t)" :y2="y(t)" />
            <text :x="m.left - 10" :y="y(t)" dy="0.32em" text-anchor="end">{{ t }}%</text>
          </g>
        </g>
        <!-- the years we do not have yet -->
        <g v-if="gap" class="tc__gap">
          <rect :x="gap.from" :y="m.top" :width="Math.max(0, gap.to - gap.from)" :height="height - m.top - m.bottom" />
          <text :x="(gap.from + gap.to) / 2" :y="m.top - 10" text-anchor="middle">{{ chart.gap }}</text>
        </g>
        <!-- x labels: the years with data -->
        <g class="tc__years">
          <text v-for="yr in [...new Set(years)]" :key="yr" :x="x(yr)" :y="height - 8" text-anchor="middle">{{ yr }}</text>
        </g>
        <!-- the lines -->
        <g v-for="s in series" :key="s.key" class="tc__series" :class="`is-${s.key}`">
          <line
            v-for="(g, i) in s.segs"
            :key="i"
            class="tc__seg"
            :class="{ 'is-gap': g.gap }"
            :x1="g.a.cx" :y1="g.a.cy" :x2="g.b.cx" :y2="g.b.cy"
            pathLength="1"
          />
          <circle v-for="p in s.pts" :key="p.year" class="tc__dot" :cx="p.cx" :cy="p.cy" r="5" />
          <text class="tc__end" :x="s.last.cx + 12" :y="s.last.cy" dy="0.32em">
            <tspan v-if="wide" class="tc__end-name">{{ s.name }}</tspan><tspan class="tc__end-val" :dx="wide ? 6 : 0">{{ fmt(s.last.value) }}</tspan>
          </text>
          <!-- hit targets bigger than the marks; focusable for the keyboard -->
          <circle
            v-for="p in s.pts"
            :key="`hit-${p.year}`"
            class="tc__hit"
            :cx="p.cx" :cy="p.cy" r="16"
            tabindex="0"
            :aria-label="`${s.name}, ${p.year}: ${fmt(p.value)}`"
            @mouseenter="show(s, p)" @focus="show(s, p)" @mouseleave="hide" @blur="hide"
          />
        </g>
      </svg>
      <div v-if="tip" class="tc__tip" :style="{ left: `${tip.left}px`, top: `${tip.top}px` }" aria-hidden="true">
        <span class="tc__tip-key" :class="`is-${tip.key}`">{{ tip.name }}</span>
        <b>{{ fmt(tip.value) }}</b><span>{{ tip.year }}</span>
      </div>
    </div>

    <p class="tc__note">{{ chart.note }}</p>

    <!-- the same figures as a table, for screen readers -->
    <table class="rv-visually-hidden">
      <caption>{{ chart.label }}</caption>
      <thead><tr><th scope="col"></th><th v-for="s in chart.series" :key="s.key" scope="col">{{ s.name }}</th></tr></thead>
      <tbody>
        <tr v-for="yr in [...new Set(years)].sort()" :key="yr">
          <th scope="row">{{ yr }}</th>
          <td v-for="s in chart.series" :key="s.key">{{ s.points.find((p) => p.year === yr)?.value ?? '–' }}</td>
        </tr>
      </tbody>
    </table>
  </figure>
</template>

<style scoped>
.tc { display: flex; flex-direction: column; gap: 14px; }
.tc__cap { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 20px; align-items: baseline; }
.tc__legend { display: flex; gap: 18px; }
.tc__key { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; }
.tc__key::before { content: ""; width: 18px; height: 3px; border-radius: 2px; background: currentColor; }
.tc__key.is-direct::before, .tc__tip-key.is-direct::before { background: var(--rv-blue); }
.tc__key.is-social::before, .tc__tip-key.is-social::before { background: var(--rv-red); }
.tc__plot { position: relative; width: 100%; }
.tc__plot svg { overflow: visible; }

.tc__grid line { stroke: var(--rv-line); stroke-width: 1; }
.tc__grid text, .tc__years text { font: 400 11px var(--rv-mono); fill: var(--rv-muted); }
.tc__gap rect { fill: color-mix(in oklab, var(--rv-ink) 4%, transparent); }
.tc__gap text { font: 500 11px var(--rv-mono); fill: var(--rv-muted); letter-spacing: 0.04em; }

.tc__seg { stroke-width: 2.5; stroke-linecap: round; fill: none; }
.is-direct .tc__seg { stroke: var(--rv-blue); }
.is-social .tc__seg { stroke: var(--rv-red); }
.tc__seg { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1100ms cubic-bezier(.4, 0, .2, 1); }
.tc__seg.is-gap { stroke-width: 1.5; stroke-dasharray: 0.012 0.018; stroke-dashoffset: 0; opacity: 0; transition: opacity 600ms ease 400ms; }
.tc.is-in .tc__seg { stroke-dashoffset: 0; }
.tc.is-in .tc__seg.is-gap { opacity: 1; }
.tc__dot { stroke: var(--rv-paper); stroke-width: 2; }
.is-direct .tc__dot { fill: var(--rv-blue); }
.is-social .tc__dot { fill: var(--rv-red); }
.tc__dot, .tc__end { opacity: 0; transition: opacity 400ms ease 900ms; }
.tc.is-in .tc__dot, .tc.is-in .tc__end { opacity: 1; }
.tc__end { font: 500 13px var(--rv-sans); fill: var(--rv-ink); }
.tc__end-name { fill: var(--rv-ink-2); font-weight: 400; }
.tc__end-val { font-family: var(--rv-mono); }
.tc__hit { fill: transparent; cursor: default; outline: none; }
.tc__hit:focus-visible { stroke: var(--rv-ink); stroke-width: 1.5; }

.tc__tip {
  position: absolute; translate: -50% calc(-100% - 14px); pointer-events: none; z-index: 2;
  display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; background: var(--rv-ink); color: var(--rv-paper);
  font-size: 12px; white-space: nowrap; border-radius: 4px;
}
.tc__tip b { font: 500 18px/1.1 var(--rv-mono); }
.tc__tip span:last-child { font: 400 11px var(--rv-mono); opacity: 0.7; }
.tc__tip-key { display: inline-flex; align-items: center; gap: 6px; }
.tc__tip-key::before { content: ""; width: 10px; height: 3px; border-radius: 2px; }
.tc__note { font-size: 13px; color: var(--rv-muted); max-width: 60ch; }

@media (prefers-reduced-motion: reduce) {
  .tc__seg, .tc__seg.is-gap, .tc__dot, .tc__end { transition: none; }
}
</style>
