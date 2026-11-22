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
// grid areas around the hub: two sides left, two right
const area = { readers: 'a', producers: 'b', advertisers: 'c', commerce: 'd' };
</script>

<template>
  <div :id="t.id" class="rv-part sides">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div ref="box" class="hub" :class="{ 'is-in': run }">
      <!-- connectors drawn behind the cards; the dash runs toward the hub -->
      <svg class="hub__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M27 25 C 40 25, 40 50, 50 50" /><path d="M73 25 C 60 25, 60 50, 50 50" />
        <path d="M27 75 C 40 75, 40 50, 50 50" /><path d="M73 75 C 60 75, 60 50, 50 50" />
      </svg>
      <div class="hub__core" aria-hidden="true"><span>{{ t.hub }}</span></div>
      <article
        v-for="(s, i) in t.items"
        :key="s.key"
        class="side rv-rise"
        :class="`side--${s.key}`"
        :style="{ gridArea: area[s.key], transitionDelay: `${150 + i * 110}ms` }"
      >
        <span class="side__flow">{{ s.flow }}</span>
        <h4 class="side__name">{{ s.name }}</h4>
        <p class="side__text">{{ s.text }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.hub {
  position: relative; display: grid; margin-top: clamp(36px, 4.4vw, 56px);
  grid-template-columns: minmax(0, 1fr) clamp(160px, 18vw, 240px) minmax(0, 1fr);
  grid-template-areas: "a . b" "c . d"; gap: clamp(48px, 7vw, 96px) 0; align-items: center;
}
.hub__lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.hub__lines path {
  fill: none; stroke: var(--rv-line-strong); stroke-width: 1.25px; vector-effect: non-scaling-stroke;
  stroke-dasharray: 5 6;
}
.hub.is-in .hub__lines path { animation: flow 1.6s linear infinite; }
@keyframes flow { to { stroke-dashoffset: -22; } }
.hub__core {
  position: absolute; left: 50%; top: 50%; translate: -50% -50%; z-index: 1;
  display: grid; place-items: center; width: clamp(128px, 14vw, 184px); aspect-ratio: 1; border-radius: 50%;
  background: var(--rv-ink); color: var(--rv-paper); box-shadow: 0 0 0 10px var(--rv-paper), 0 0 0 11px var(--rv-line);
  font: 400 clamp(22px, 2.4vw, 32px)/1 var(--rv-serif); letter-spacing: -0.01em;
  scale: 0.7; opacity: 0; transition: scale 800ms cubic-bezier(.2, .7, .2, 1), opacity 500ms ease;
}
.hub.is-in .hub__core { scale: 1; opacity: 1; }
.side { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; padding: clamp(20px, 2.4vw, 28px); background: var(--rv-paper-2); border-top: 3px solid var(--rv-ink); }
.side--commerce { border-top-color: var(--rv-red); }
.side__flow {
  align-self: flex-start; font: 500 11px/1 var(--rv-mono); letter-spacing: 0.08em; text-transform: uppercase;
  padding: 5px 8px; border-radius: 999px; background: var(--rv-paper); color: var(--rv-muted);
}
.side__name { font: 400 clamp(22px, 2vw, 28px)/1.15 var(--rv-serif); }
html[lang^="zh"] .side__name { font-weight: 500; }
.side__text { font-size: 15px; line-height: 1.55; color: var(--rv-ink-2); }

@media (max-width: 860px) {
  .hub { grid-template-columns: minmax(0, 1fr); grid-template-areas: "core" "a" "b" "c" "d"; gap: 14px; }
  .hub__lines { display: none; }
  .hub__core { position: relative; left: auto; top: auto; translate: none; grid-area: core; justify-self: center; margin-bottom: 18px; width: 120px; }
}
@media (prefers-reduced-motion: reduce) {
  .hub.is-in .hub__lines path { animation: none; }
  .hub__core { transition: none; scale: 1; opacity: 1; }
}
</style>
