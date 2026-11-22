<script setup>
import { computed } from 'vue';
import StatusMark from '../shared/StatusMark.vue';

// One dashboard chart as a tile. Draws only the figures already in hand; a chart still waiting on its data
// shows the outline of its form, never made-up values.
const props = defineProps({
  tile: { type: Object, required: true },
  statusNames: { type: Object, required: true },
  inHand: { type: String, required: true },
  awaiting: { type: String, required: true },
});
const W = 200;
const H = 92;
const pad = { l: 8, r: 34, t: 10, b: 16 };
const sx = (v, a, b) => pad.l + ((v - a) / (b - a)) * (W - pad.l - pad.r);
const sy = (v, max) => pad.t + (1 - v / max) * (H - pad.t - pad.b);

const lines = computed(() => {
  if (props.tile.kind !== 'lines') return [];
  return ['direct', 'social'].map((k) => {
    const pts = props.tile.data[k].map((p) => ({ ...p, x: sx(p.year, 2017, 2025), y: sy(p.value, 60) }));
    return { key: k, pts, segs: pts.slice(1).map((p, i) => ({ a: pts[i], b: p, gap: p.year - pts[i].year > 1 })) };
  });
});
</script>

<template>
  <article class="tile" :class="`is-${tile.status}`">
    <header class="tile__head"><span class="tile__key">{{ tile.key }}</span><b>{{ tile.name }}</b></header>

    <div class="tile__plot">
      <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`${tile.name}: ${tile.kind === 'ghost' ? awaiting : inHand}`">
        <line class="axis" :x1="pad.l" :x2="W - pad.r" :y1="H - pad.b" :y2="H - pad.b" />

        <!-- a: traffic mix, direct and social -->
        <template v-if="tile.kind === 'lines'">
          <g v-for="l in lines" :key="l.key" :class="`ser ser--${l.key}`">
            <line v-for="(g, i) in l.segs" :key="i" :x1="g.a.x" :y1="g.a.y" :x2="g.b.x" :y2="g.b.y" :class="{ gap: g.gap }" />
            <circle v-for="p in l.pts" :key="p.year" :cx="p.x" :cy="p.y" r="2.6"><title>{{ p.year }}: {{ p.value }}%</title></circle>
            <text :x="l.pts[l.pts.length - 1].x + 5" :y="l.pts[l.pts.length - 1].y + 3">{{ l.pts[l.pts.length - 1].value }}%</text>
          </g>
          <text class="yr" :x="pad.l" :y="H - 4">2017</text><text class="yr" :x="W - pad.r" :y="H - 4" text-anchor="end">2025</text>
        </template>

        <!-- b: headcount, and profit from Jul 2025 -->
        <template v-else-if="tile.kind === 'staff'">
          <g v-for="(s, i) in tile.data.staff" :key="s.year">
            <rect :x="40 + i * 64" :y="sy(s.value, 600)" width="34" :height="H - pad.b - sy(s.value, 600)" :class="i ? 'bar' : 'bar bar--lo'"><title>{{ s.year }}: {{ s.value }}</title></rect>
            <text class="val" :x="57 + i * 64" :y="sy(s.value, 600) - 3" text-anchor="middle">{{ s.value }}</text>
            <text class="yr" :x="57 + i * 64" :y="H - 4" text-anchor="middle">{{ s.year }}</text>
          </g>
          <line class="profit" x1="150" x2="150" :y1="pad.t" :y2="H - pad.b" />
          <text class="note" x="154" :y="pad.t + 8">+</text>
        </template>

        <!-- c: ETtoday weekly use, the years in hand -->
        <template v-else-if="tile.kind === 'dots'">
          <g v-for="p in tile.data.use" :key="p.year">
            <circle :cx="sx(p.year, 2017, 2026)" :cy="sy(p.value, 50)" r="3.2" class="dot"><title>{{ p.year }}: {{ p.value }}%</title></circle>
            <text class="val" :x="sx(p.year, 2017, 2026)" :y="sy(p.value, 50) - 6" text-anchor="middle">{{ p.value }}</text>
          </g>
          <text class="yr" :x="pad.l" :y="H - 4">2017</text><text class="yr" :x="W - pad.r" :y="H - 4" text-anchor="end">2026</text>
        </template>

        <!-- g: digital ad spend, the totals in hand -->
        <template v-else-if="tile.kind === 'bars'">
          <g v-for="(b, i) in tile.data" :key="b.year">
            <rect :x="44 + i * 64" :y="sy(b.value, 700)" width="34" :height="H - pad.b - sy(b.value, 700)" class="bar"><title>{{ b.year }}: {{ b.value }}</title></rect>
            <text class="val" :x="61 + i * 64" :y="sy(b.value, 700) - 3" text-anchor="middle">{{ b.value }}</text>
            <text class="yr" :x="61 + i * 64" :y="H - 4" text-anchor="middle">{{ b.year }}</text>
          </g>
        </template>

        <!-- waiting: the form of the chart, no values -->
        <template v-else>
          <path class="ghost" :d="`M ${pad.l} ${H - 30} C 50 ${H - 50}, 80 ${H - 20}, 110 ${H - 44} S 150 ${H - 60}, ${W - pad.r} ${H - 52}`" />
          <path class="ghost" :d="`M ${pad.l} ${H - 22} C 60 ${H - 30}, 90 ${H - 40}, 120 ${H - 28} S 160 ${H - 36}, ${W - pad.r} ${H - 30}`" />
          <text class="wait" :x="(W - pad.r + pad.l) / 2" :y="pad.t + 10" text-anchor="middle">{{ awaiting }}</text>
        </template>
      </svg>
      <p v-if="tile.series || tile.labels" class="tile__legend">
        <span v-for="(s, i) in tile.series" :key="s" :class="`k k--${i ? 'social' : 'direct'}`">{{ s }}</span>
        <span v-for="l in tile.labels" :key="l" class="k">{{ l }}</span>
      </p>
    </div>

    <footer class="tile__foot">
      <StatusMark :status="tile.status" :label="statusNames[tile.status]" />
      <span>{{ tile.chart }} · {{ tile.source }}</span>
    </footer>
  </article>
</template>

<style scoped>
.tile { display: flex; flex-direction: column; gap: 10px; padding: 16px; background: var(--rv-paper-2); border-top: 3px solid var(--rv-blue); min-width: 0; }
.tile.is-todo { border-top: 3px dashed var(--rv-line-strong); background: color-mix(in oklab, var(--rv-paper-2) 55%, var(--rv-paper)); }
.tile__head { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: baseline; }
.tile__key { font: italic 400 20px/1 var(--rv-serif); color: var(--rv-red); }
.tile__head b { font-size: 14px; font-weight: 600; line-height: 1.3; }
.tile__plot svg { width: 100%; height: auto; overflow: visible; }
.axis { stroke: var(--rv-line-strong); stroke-width: 1; }
.ser line { stroke-width: 2; stroke-linecap: round; }
.ser line.gap { stroke-width: 1.2; stroke-dasharray: 2 3; }
.ser--direct line { stroke: var(--rv-blue); } .ser--direct circle { fill: var(--rv-blue); }
.ser--social line { stroke: var(--rv-red); } .ser--social circle { fill: var(--rv-red); }
.ser text { font: 500 8px var(--rv-mono); fill: var(--rv-ink); }
.bar { fill: var(--rv-blue); } .bar--lo { fill: color-mix(in oklab, var(--rv-blue) 40%, transparent); }
.dot { fill: var(--rv-blue); }
.val { font: 500 8px var(--rv-mono); fill: var(--rv-ink); }
.yr { font: 400 7px var(--rv-mono); fill: var(--rv-muted); }
.profit { stroke: var(--rv-red); stroke-width: 1.2; stroke-dasharray: 3 2; }
.note { font: 600 10px var(--rv-sans); fill: var(--rv-red); }
.ghost { fill: none; stroke: var(--rv-line-strong); stroke-width: 1.5; stroke-dasharray: 3 4; }
.wait { font: 500 8px var(--rv-mono); fill: var(--rv-muted); letter-spacing: 0.06em; text-transform: uppercase; }
.tile__legend { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 11px; color: var(--rv-ink-2); }
.k { display: inline-flex; align-items: center; gap: 5px; }
.k--direct::before, .k--social::before { content: ""; width: 10px; height: 2px; }
.k--direct::before { background: var(--rv-blue); } .k--social::before { background: var(--rv-red); }
.tile__foot { margin-top: auto; display: flex; flex-direction: column; gap: 4px; font: 400 11px/1.4 var(--rv-mono); color: var(--rv-muted); }
</style>
