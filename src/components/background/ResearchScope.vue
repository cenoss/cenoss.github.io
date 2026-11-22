<script setup>
import { ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import ScopeMap from './ScopeMap.vue';
import StudyTimeline from './StudyTimeline.vue';
import { useInView } from '../../composables/motion.js';

defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});

const mapBox = ref(null);
const mapIn = useInView(mapBox, { threshold: 0.35 });
const outBox = ref(null);
const outIn = useInView(outBox, { threshold: 0.6 });
const tlBox = ref(null);
const tlIn = useInView(tlBox, { threshold: 0.6 });
</script>

<template>
  <div :id="t.id" class="rv-part scope">
    <PartHead :n="n" :total="total" :label="t.label" />
    <div class="scope__grid">
      <div class="scope__text">
        <h3 class="rv-h3">{{ t.title }}</h3>
        <p class="scope__body">{{ t.body }}</p>

        <ul class="legend">
          <li class="legend__row">
            <span class="legend__key legend__key--core" aria-hidden="true"></span>
            <div>
              <p class="legend__label">{{ t.core.role }}</p>
              <p class="legend__items">{{ t.core.name }}, {{ t.core.sub }}</p>
            </div>
          </li>
          <li v-for="ring in t.rings" :key="ring.key" class="legend__row">
            <span class="legend__key" :class="`legend__key--${ring.key}`" aria-hidden="true"></span>
            <div>
              <p class="legend__label">{{ ring.label }} <span class="legend__count">{{ ring.items.length }}</span></p>
              <p class="legend__items">{{ ring.items.join(' · ') }}</p>
            </div>
          </li>
        </ul>

        <div ref="outBox" class="out" :class="{ 'is-in': outIn }">
          <p class="rv-label">{{ t.out.label }}</p>
          <ul class="out__list">
            <li v-for="(item, i) in t.out.items" :key="item" :style="{ '--i': i }"><s>{{ item }}</s></li>
          </ul>
        </div>
      </div>

      <div ref="mapBox" class="scope__map">
        <ScopeMap :core="t.core" :rings="t.rings" :label="t.mapLabel" :run="mapIn" />
      </div>
    </div>

    <div ref="tlBox">
      <StudyTimeline :t="t.timeline" :run="tlIn" />
    </div>
  </div>
</template>

<style scoped>
.scope__grid {
  display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 5vw, 80px); align-items: start;
}
.scope__body { margin: 20px 0 0; max-width: 46ch; color: var(--rv-ink-2); }
.scope__map { padding: clamp(24px, 3vw, 40px) clamp(40px, 5vw, 64px) 0; }

/* ---------------------------------------------------------------- legend */
.legend { margin-top: clamp(28px, 3.4vw, 44px); border-top: 1px solid var(--rv-line); }
.legend__row { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--rv-line); }
.legend__row p { margin: 0; }
.legend__label { font-size: 15px; font-weight: 600; }
.legend__count {
  display: inline-grid; place-items: center; min-width: 20px; height: 20px; margin-left: 6px; padding: 0 6px;
  border-radius: 999px; background: var(--rv-ink); color: var(--rv-paper); font: 500 11px/1 var(--rv-mono); vertical-align: 0.12em;
}
.legend__items { margin-top: 4px; font-size: 14px; line-height: 1.5; color: var(--rv-muted); }
.legend__key { position: relative; width: 22px; height: 22px; margin-top: 1px; border-radius: 50%; border: 1px solid var(--rv-line-strong); }
.legend__key--core { background: var(--rv-ink); border-color: var(--rv-ink); }
.legend__key--brands { background: var(--rv-paper-2); }
.legend__key--platforms { border: 1.5px solid var(--rv-red); }
.legend__key--regulators { border-style: dashed; border-color: var(--rv-ink-2); }

/* ---------------------------------------------------------------- out of scope */
.out { margin-top: clamp(24px, 3vw, 36px); padding: 18px 20px; border: 1px dashed var(--rv-line-strong); }
.out__list { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 10px; }
.out__list li { font-size: 15px; color: var(--rv-muted); }
.out__list s { position: relative; text-decoration: none; }
/* the strike draws across when the box comes into view */
.out__list s::after {
  content: ""; position: absolute; left: -2px; right: -2px; top: 55%; height: 1.5px; background: var(--rv-red);
  transform-origin: left; transform: scaleX(0); transition: transform 500ms cubic-bezier(.2, .7, .2, 1);
  transition-delay: calc(var(--i) * 140ms + 150ms);
}
.out.is-in .out__list s::after { transform: scaleX(1); }

/* 961 to 1200: the map takes a larger share, so it keeps its names (they need 460px of map) */
@media (min-width: 961px) and (max-width: 1200px) {
  .scope__grid { grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 40px; }
  .scope__map { padding: 24px 28px 0; }
}
@media (max-width: 960px) {
  /* one column: title, words, then the map, then the legend under it */
  .scope__grid { grid-template-columns: minmax(0, 1fr); row-gap: 0; }
  .scope__text { display: contents; }
  .scope__text > .rv-h3 { order: 1; }
  .scope__body { order: 2; }
  .scope__map { order: 3; max-width: 560px; width: 100%; margin: 24px auto 0; padding: 32px 48px 0; }
  .legend { order: 4; }
  .out { order: 5; }
}
@media (max-width: 480px) {
  .scope__map { padding: 24px 28px 0; }
}
@media (prefers-reduced-motion: reduce) { .out__list s::after { transition: none; } }
</style>
