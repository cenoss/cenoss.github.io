<script setup>
import { computed, ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import { useScrollProgress } from '../../composables/motion.js';

const props = defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});

const pad = (k) => String(k).padStart(2, '0');

// the spine through the numbers fills as the list is read; each row lights when the spine reaches it
const list = ref(null);
const progress = useScrollProgress(list, { start: 0.8, end: 0.6 });
const litUpTo = computed(() => Math.floor(progress.value * props.t.items.length + 0.35));
</script>

<template>
  <div :id="t.id" class="rv-part objectives">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div ref="list" class="obj">
      <div class="obj__cols" aria-hidden="true">
        <span></span><span>{{ t.columns[0] }}</span><span>{{ t.columns[1] }}</span><span>{{ t.columns[2] }}</span>
      </div>
      <span class="obj__spine" aria-hidden="true"><span :style="{ transform: `scaleY(${progress})` }"></span></span>
      <ol class="obj__list">
        <li v-for="(o, i) in t.items" :key="o.title" class="obj__row" :class="{ 'is-lit': i < litUpTo }">
          <span class="obj__num" aria-hidden="true">{{ pad(i + 1) }}</span>
          <div class="obj__main">
            <h4 class="obj__title">{{ o.title }}</h4>
            <p class="obj__body">{{ o.body }}</p>
          </div>
          <p class="obj__lens">
            <span class="rv-visually-hidden">{{ t.columns[1] }}: </span>
            <span class="obj__lens-name">{{ o.lens }}</span>
            <span class="obj__by">{{ o.lensBy }}</span>
          </p>
          <p class="obj__out">
            <span class="rv-visually-hidden">{{ t.columns[2] }}: </span>
            <a :href="o.href">
              <span>{{ o.output }}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </a>
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.obj { --num: 88px; position: relative; margin-top: clamp(36px, 4.4vw, 56px); }
.obj__cols, .obj__row {
  display: grid; grid-template-columns: var(--num) minmax(0, 5fr) minmax(0, 3fr) minmax(0, 3fr); column-gap: var(--rv-gap);
}
.obj__cols { padding-bottom: 12px; border-bottom: 1px solid var(--rv-ink); font: 500 11px/1.4 var(--rv-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rv-muted); }

/* the spine: a hairline through the numbers that fills red as you read down */
.obj__spine { position: absolute; left: 28px; top: 64px; bottom: 56px; width: 1px; background: var(--rv-line); }
.obj__spine > span { position: absolute; inset: 0; background: var(--rv-red); transform-origin: top; transform: scaleY(0); }

.obj__row { position: relative; align-items: start; padding: clamp(22px, 2.6vw, 32px) 0; border-bottom: 1px solid var(--rv-line); transition: background-color 200ms ease; }
.obj__row:hover { background: color-mix(in oklab, var(--rv-paper-2) 70%, transparent); }
.obj__num {
  position: relative; z-index: 1; justify-self: start; width: 56px; padding: 2px 0 6px; background: var(--rv-paper); text-align: center;
  font: italic 300 clamp(32px, 3vw, 44px)/1 var(--rv-serif); color: var(--rv-muted); font-variant-numeric: lining-nums;
  transition: color 300ms ease;
}
.obj__row:hover .obj__num { background: transparent; }
.obj__row.is-lit .obj__num { color: var(--rv-red); }
.obj__main { min-width: 0; }
.obj__title {
  margin: 0; font-family: var(--rv-serif); font-weight: 400; font-size: clamp(22px, 2vw, 28px);
  line-height: 1.15; letter-spacing: -0.012em; hyphens: manual;
}
html[lang^="zh"] .obj__title { letter-spacing: 0; font-weight: 500; }
.obj__body { margin: 8px 0 0; max-width: 54ch; font-size: 15px; line-height: 1.55; color: var(--rv-ink-2); }
.obj__lens, .obj__out { margin: 0; padding-top: 6px; }
.obj__lens { display: flex; flex-direction: column; gap: 4px; }
.obj__lens-name { font-size: 15px; font-weight: 600; }
.obj__by { font: 400 12px/1.4 var(--rv-mono); color: var(--rv-muted); }
.obj__out a {
  display: inline-flex; align-items: flex-start; gap: 10px; font-size: 15px; font-weight: 500;
  text-decoration: underline; text-decoration-color: var(--rv-line-strong); text-underline-offset: 4px;
  transition: text-decoration-color 160ms ease, color 160ms ease;
}
.obj__out svg { flex: none; width: 16px; height: 16px; margin-top: 3px; transition: translate 200ms ease; }
.obj__out a:hover { color: var(--rv-red); text-decoration-color: currentColor; }
.obj__out a:hover svg { translate: 4px 0; }

@media (max-width: 900px) {
  .obj { --num: 56px; }
  .obj__cols { display: none; }
  .obj__spine { left: 20px; top: 24px; }
  .obj__row { grid-template-columns: var(--num) minmax(0, 1fr) minmax(0, 1fr); row-gap: 14px; }
  .obj__num { width: 40px; }
  .obj__main { grid-column: 2 / -1; }
  .obj__lens { grid-column: 2; }
  .obj__out { grid-column: 3; }
}
@media (max-width: 520px) {
  .obj__row { grid-template-columns: var(--num) minmax(0, 1fr); }
  .obj__lens, .obj__out { grid-column: 2; }
}
@media (prefers-reduced-motion: reduce) { .obj__num { transition: none; } }
</style>
