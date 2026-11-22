<script setup>
import { computed } from 'vue';
import PartHead from '../shared/PartHead.vue';

// Updates and deployment (§4.3–4.4): the cadence, the repository layout, and the three feedback loops drawn as
// arcs back along the seven steps.
const props = defineProps({
  t: { type: Object, required: true },
  steps: { type: Array, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const N = computed(() => props.steps.length);
const cx = (k) => ((k - 0.5) / N.value) * 100;               // centre of step k, in % of the width
// each loop: an arc above the line, from its step back to the one it returns to; higher for longer loops
const arcs = computed(() => props.t.loops.map((l, i) => {
  const a = cx(l.from); const b = cx(l.to); const h = 30 + Math.abs(l.from - l.to) * 22 + i * 6;
  return { ...l, d: `M ${a} 96 C ${a} ${96 - h}, ${b} ${96 - h}, ${b} 96`, mid: (a + b) / 2, top: 96 - h * 0.75 };
}));
</script>

<template>
  <div :id="t.id" class="rv-part deploy">
    <PartHead :n="n" :total="total" :label="t.label" />
    <div class="deploy__head">
      <h3 class="rv-h3">{{ t.title }}</h3>
      <div class="deploy__side">
        <p class="rv-body">{{ t.text }}</p>
        <p class="deploy__tbd"><span class="rv-tag rv-tag--warn">TBD</span>{{ t.tbd }}</p>
      </div>
    </div>

    <div class="deploy__grid">
      <figure class="repo">
        <figcaption class="rv-label">{{ t.repoLabel }}</figcaption>
        <div class="repo__term">
          <p class="repo__root">&lt;{{ t.repoName }}&gt;/</p>
          <ul>
            <li v-for="(f, i) in t.tree" :key="f.path">
              <span class="repo__glyph" aria-hidden="true">{{ i === t.tree.length - 1 ? '└─' : '├─' }}</span>
              <b>{{ f.path }}</b><span class="repo__note">{{ f.note }}</span>
            </li>
          </ul>
        </div>
        <p class="repo__static">{{ t.static }}</p>
      </figure>

      <figure class="loops">
        <figcaption class="rv-label">{{ t.loopsLabel }}</figcaption>
        <div class="loops__chart" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path v-for="a in arcs" :key="a.key" :d="a.d" class="loops__arc" />
          </svg>
          <span v-for="a in arcs" :key="`l${a.key}`" class="loops__tag" :style="{ left: `${a.mid}%`, top: `${a.top}%` }">{{ a.key }}</span>
          <ol class="loops__line">
            <li v-for="s in steps" :key="s.n" :style="{ left: `${cx(s.n)}%` }"><span>{{ s.n }}</span></li>
          </ol>
        </div>
        <ul class="loops__list">
          <li v-for="l in t.loops" :key="l.key"><b>{{ l.key }}</b><span class="loops__route">{{ l.from }} → {{ l.to }}</span><span>{{ l.text }}</span></li>
        </ul>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.deploy__head { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(32px, 6vw, 96px); align-items: end; }
.deploy__side { display: flex; flex-direction: column; gap: 14px; }
.deploy__tbd { display: flex; gap: 10px; align-items: baseline; font-size: 14px; color: var(--rv-muted); }
.deploy__grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 6vw, 96px); margin-top: clamp(36px, 4.4vw, 56px); align-items: start; }

.repo { display: flex; flex-direction: column; gap: 14px; }
.repo__term { padding: 18px 20px; background: #0e0f12; border: 1px solid var(--rv-line-strong); font-family: var(--rv-mono); font-size: 13px; color: #eee9de; }
.repo__root { color: var(--rv-red); margin-bottom: 8px; }
.repo__term li { display: grid; grid-template-columns: 26px auto; column-gap: 8px; padding: 4px 0; }
.repo__glyph { color: #6e7383; grid-row: span 2; }
.repo__term b { font-weight: 500; color: #f0a65a; }
.repo__note { color: #a39c8f; font-size: 12px; }
.repo__static { font-size: 15px; line-height: 1.55; color: var(--rv-ink-2); }

.loops { display: flex; flex-direction: column; gap: 14px; }
.loops__chart { position: relative; height: 150px; margin: 6px 0 24px; }
.loops__chart svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.loops__arc { fill: none; stroke: var(--rv-red); stroke-width: 1.5px; vector-effect: non-scaling-stroke; stroke-dasharray: 5 5; }
.loops__tag { position: absolute; translate: -50% -50%; padding: 2px 8px; border-radius: 999px; background: var(--rv-red); color: #fff; font: 500 11px/1.4 var(--rv-mono); }
.loops__line { position: absolute; left: 0; right: 0; bottom: 0; height: 4%; border-top: 2px solid var(--rv-ink); }
.loops__line li { position: absolute; top: -13px; translate: -50% 0; }
.loops__line span { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--rv-paper); border: 1.5px solid var(--rv-ink); font: 500 11px/1 var(--rv-mono); }
.loops__list { display: flex; flex-direction: column; border-top: 1px solid var(--rv-line); }
.loops__list li { display: grid; grid-template-columns: 36px 52px minmax(0, 1fr); gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--rv-line); font-size: 14px; color: var(--rv-ink-2); align-items: baseline; }
.loops__list b { font: 500 13px var(--rv-mono); color: var(--rv-red); }
.loops__route { font: 400 12px var(--rv-mono); color: var(--rv-muted); }

@media (max-width: 900px) {
  .deploy__head, .deploy__grid { grid-template-columns: minmax(0, 1fr); gap: 24px; }
}
</style>
