<script setup>
import { computed } from 'vue';

const props = defineProps({
  core: { type: Object, required: true },
  rings: { type: Array, required: true },
  label: { type: String, required: true },
  run: { type: Boolean, default: false },
});

// Ring radius (percent of the map) and where each name sits on it, in degrees (0 = right, 90 = down).
// Placed so no two names collide from 460px of map up. A smaller map shows each as a dot on its ring
// (13 names, some of them seven CJK characters long, do not fit); the legend beside it names them all.
const geometry = {
  brands: { r: 25, angles: [-90, -30, 30, 90, 150, 210] },
  platforms: { r: 37, angles: [-135, -45, 45, 135] },
  regulators: { r: 46.5, angles: [-90, 22, 158] },
};

const chips = computed(() =>
  props.rings.flatMap((ring, ri) => {
    const g = geometry[ring.key];
    return (ring.short ?? ring.items).map((name, i) => {
      const a = (g.angles[i] * Math.PI) / 180;
      return { key: `${ring.key}-${i}`, ring: ring.key, ri, name, x: 50 + g.r * Math.cos(a), y: 50 + g.r * Math.sin(a) };
    });
  }),
);
</script>

<template>
  <!-- decorative: the legend beside it names every ring and member as text -->
  <div class="map" :class="{ 'is-in': run }" aria-hidden="true">
    <svg class="map__svg" viewBox="0 0 100 100">
      <circle
        v-for="(ring, i) in rings"
        :key="ring.key"
        class="map__ring"
        :class="`map__ring--${ring.key}`"
        cx="50" cy="50" :r="geometry[ring.key].r"
        :style="{ '--i': i + 1 }"
      />
      <circle class="map__core-disc" cx="50" cy="50" r="13" />
    </svg>
    <div class="map__core"><strong>{{ core.name }}</strong><span>{{ core.sub }}</span></div>
    <span
      v-for="c in chips"
      :key="c.key"
      class="map__chip"
      :class="`map__chip--${c.ring}`"
      :style="{ left: `${c.x}%`, top: `${c.y}%`, '--i': c.ri + 1 }"
    >{{ c.name }}</span>
    <span class="map__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.map { position: relative; aspect-ratio: 1; width: 100%; container-type: inline-size; }
.map__svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.map__ring {
  fill: none; stroke: var(--rv-line-strong); stroke-width: 1px; vector-effect: non-scaling-stroke;
  transform-box: view-box; transform-origin: center;
}
.map__ring--brands { fill: color-mix(in oklab, var(--rv-paper-2) 70%, transparent); }
.map__ring--platforms { stroke: var(--rv-red); stroke-width: 1.5px; }
.map__ring--regulators { stroke-dasharray: 1 0.9; }
.map__core-disc { fill: var(--rv-ink); transform-box: view-box; transform-origin: center; }

.map__core {
  position: absolute; left: 50%; top: 50%; translate: -50% -50%;
  display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center;
  color: var(--rv-paper);
}
.map__core strong { font: 400 clamp(17px, 3.6cqi, 24px)/1 var(--rv-serif); letter-spacing: -0.01em; }
.map__core span { font: 400 clamp(10px, 1.8cqi, 12px)/1.3 var(--rv-mono); letter-spacing: 0.04em; opacity: 0.75; }

.map__chip {
  position: absolute; translate: -50% -50%; white-space: nowrap;
  padding: 0.38em 0.85em; border-radius: 999px; border: 1px solid var(--rv-line-strong);
  background: var(--rv-paper); font: 500 clamp(11px, 2.1cqi, 14px)/1.2 var(--rv-sans); color: var(--rv-ink);
}
.map__chip--platforms { border-color: var(--rv-red); }
.map__chip--platforms::before {
  content: ""; display: inline-block; width: 6px; height: 6px; margin-right: 6px; border-radius: 50%;
  background: var(--rv-red); vertical-align: 0.1em;
}
.map__chip--regulators { border-style: dashed; color: var(--rv-ink-2); background: var(--rv-paper); }
.map__label {
  position: absolute; left: 0; bottom: 0;
  font: 500 11px/1 var(--rv-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--rv-muted);
}

/* drawn from the centre outward when it comes into view */
.map__core-disc, .map__ring { opacity: 0; scale: 0.55; transition: opacity 700ms ease, scale 900ms cubic-bezier(.2, .7, .2, 1); }
.map__chip, .map__core { opacity: 0; transition: opacity 500ms ease, translate 600ms cubic-bezier(.2, .7, .2, 1); }
.map__chip { translate: -50% calc(-50% + 8px); }
.map.is-in .map__core-disc, .map.is-in .map__ring { opacity: 1; scale: 1; }
.map.is-in .map__core { opacity: 1; transition-delay: 300ms; }
.map.is-in .map__chip { opacity: 1; translate: -50% -50%; }
.map.is-in .map__ring { transition-delay: calc(var(--i) * 160ms); }
.map.is-in .map__chip { transition-delay: calc(var(--i) * 160ms + 380ms); }

/* a small map: a dot per member on its ring, the disc holds the name only */
@container (max-width: 459px) {
  .map__chip { width: 12px; height: 12px; padding: 0; font-size: 0; color: transparent; border-width: 1.5px; border-color: var(--rv-ink-2); }
  .map__chip--platforms { background: var(--rv-red); border-color: var(--rv-paper); box-shadow: 0 0 0 1px var(--rv-red); }
  .map__chip--platforms::before { display: none; }
  .map__chip--regulators { border-style: solid; background: var(--rv-paper); border-color: var(--rv-muted); }
  .map__chip--brands { background: var(--rv-paper); }
}
@container (max-width: 380px) { .map__core span { display: none; } }

@media (prefers-reduced-motion: reduce) {
  .map__core-disc, .map__ring, .map__chip, .map__core { transition: none; }
}
</style>
