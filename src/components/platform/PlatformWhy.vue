<script setup>
import { ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import BarChart from '../shared/BarChart.vue';
import TrafficChart from './TrafficChart.vue';
import RulesTimeline from './RulesTimeline.vue';
import { useInView } from '../../composables/motion.js';

const props = defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const pad = (k) => String(k).padStart(2, '0');
const model = props.t.pillars.find((p) => p.key === 'model');
const staffCut = model.staff.from - model.staff.to;
const staffPct = Math.round((staffCut / model.staff.from) * 100);
const modelBox = ref(null);
const modelIn = useInView(modelBox, { threshold: 0.4 });
const streakBox = ref(null);
const streakIn = useInView(streakBox, { threshold: 0.6 });
</script>

<template>
  <div :id="t.id" class="rv-part why">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <ol class="pillars">
      <li v-for="(p, i) in t.pillars" :key="p.key" class="pillar">
        <div class="pillar__text">
          <span class="pillar__n">{{ pad(i + 1) }}</span>
          <h4 class="pillar__name">{{ p.name }}</h4>
          <p class="pillar__body">{{ p.text }}</p>
          <a class="rv-source" :href="p.href" target="_blank" rel="noopener">{{ p.source }}</a>
        </div>

        <div class="pillar__viz">
          <!-- 01 market position: the streak, and trust against the average -->
          <template v-if="p.key === 'position'">
            <div ref="streakBox" class="streak" :class="{ 'is-in': streakIn }">
              <div class="streak__marks" aria-hidden="true">
                <span v-for="k in p.streak.count" :key="k" :style="{ transitionDelay: `${k * 70}ms` }"></span>
              </div>
              <p class="streak__label"><b>{{ p.streak.count }}</b> {{ p.streak.label }}</p>
            </div>
            <p class="rv-label viz-label">{{ p.trust.label }}</p>
            <BarChart :rows="p.trust.rows" :unit="p.trust.label" />
          </template>

          <!-- 02 business model: loss years to profit, the staff cut, the revenue shift -->
          <div v-else-if="p.key === 'model'" ref="modelBox" class="model" :class="{ 'is-in': modelIn }">
            <div class="years" role="img" :aria-label="`${p.years.lossCount} × ${p.years.loss}, ${p.years.profit}`">
              <span v-for="k in p.years.lossCount" :key="k" class="years__loss" :style="{ transitionDelay: `${k * 90}ms` }">−</span>
              <span class="years__arrow" aria-hidden="true">→</span>
              <span class="years__profit">+</span>
            </div>
            <div class="years__legend"><span class="is-loss">{{ p.years.loss }}</span><span class="is-profit">{{ p.years.profit }}</span></div>

            <div class="staff">
              <p class="rv-label viz-label">{{ p.staff.label }}</p>
              <div class="staff__row"><span class="staff__bar is-from" :style="{ '--w': 1 }"></span><b>{{ p.staff.from }}</b></div>
              <div class="staff__row"><span class="staff__bar is-to" :style="{ '--w': p.staff.to / p.staff.from }"></span><b>{{ p.staff.to }}</b></div>
              <p class="staff__delta">−{{ staffCut }} ({{ staffPct }}% {{ p.staff.change }})</p>
            </div>

            <div class="shift">
              <p class="rv-label viz-label">{{ p.revenue.label }}</p>
              <div class="shift__flow">
                <span class="shift__chip is-from">{{ p.revenue.from }}</span>
                <span class="shift__arrow" aria-hidden="true">→</span>
                <span v-for="to in p.revenue.to" :key="to" class="shift__chip is-to">+ {{ to }}</span>
              </div>
            </div>
          </div>

          <!-- 03 network effects: where visits come from, over time -->
          <TrafficChart v-else-if="p.key === 'network'" :chart="p.chart" />

          <!-- 04 rules: the dated track and what is still open -->
          <RulesTimeline v-else-if="p.key === 'rules'" :p="p" />
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.pillars { margin-top: clamp(36px, 4.4vw, 56px); border-top: 1px solid var(--rv-ink); }
.pillar {
  display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 6vw, 96px);
  padding: clamp(36px, 4.4vw, 56px) 0; border-bottom: 1px solid var(--rv-line);
}
.pillar__text { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.pillar__n { font: italic 300 clamp(36px, 3.4vw, 48px)/1 var(--rv-serif); color: var(--rv-red); }
.pillar__name { font: 400 clamp(26px, 2.6vw, 36px)/1.1 var(--rv-serif); letter-spacing: -0.015em; }
html[lang^="zh"] .pillar__name { font-weight: 500; letter-spacing: 0; }
.pillar__body { font-size: 16px; line-height: 1.6; color: var(--rv-ink-2); max-width: 48ch; }
.pillar__viz { min-width: 0; display: flex; flex-direction: column; gap: 16px; justify-content: center; }
.viz-label { margin-top: 8px; }

/* streak */
.streak { display: flex; flex-direction: column; gap: 14px; }
.streak__marks { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 6px; max-width: 420px; }
.streak__marks span { aspect-ratio: 1; background: var(--rv-ink); opacity: 0; scale: 0.6; transition: opacity 300ms ease, scale 400ms cubic-bezier(.2, .7, .2, 1); }
.streak__marks span:last-child { background: var(--rv-red); }
.streak.is-in .streak__marks span { opacity: 1; scale: 1; }
.streak__label { font-size: 15px; color: var(--rv-ink-2); }
.streak__label b { font: 300 40px/1 var(--rv-serif); color: var(--rv-ink); margin-right: 6px; vertical-align: -0.1em; }

/* business model */
.model { display: flex; flex-direction: column; gap: 22px; }
.years { display: flex; align-items: center; gap: 8px; }
.years__loss, .years__profit {
  display: grid; place-items: center; flex: 1 1 0; max-width: 88px; aspect-ratio: 1.4; font: 300 28px/1 var(--rv-serif);
}
.years__loss { background: var(--rv-red-wash); color: var(--rv-red); opacity: 0; translate: 0 8px; transition: opacity 400ms ease, translate 500ms ease; }
.model.is-in .years__loss { opacity: 1; translate: 0 0; }
.years__profit { background: var(--rv-blue); color: #fff; }
.years__arrow { font-size: 22px; color: var(--rv-muted); padding: 0 4px; }
.years__legend { display: flex; justify-content: space-between; gap: 16px; font: 400 12px var(--rv-mono); color: var(--rv-muted); margin-top: -12px; }
.years__legend .is-loss { color: var(--rv-red); }
.years__legend .is-profit { color: var(--rv-blue); }
.staff { display: flex; flex-direction: column; gap: 8px; }
.staff__row { display: grid; grid-template-columns: minmax(0, 1fr) 48px; gap: 12px; align-items: center; }
.staff__row b { font: 500 15px var(--rv-mono); text-align: right; }
.staff__bar { height: 14px; width: calc(var(--w) * 100%); border-radius: 0 4px 4px 0; transform-origin: left; transform: scaleX(0); transition: transform 900ms cubic-bezier(.2, .7, .2, 1); }
.staff__bar.is-from { background: color-mix(in oklab, var(--rv-ink) 22%, transparent); }
.staff__bar.is-to { background: var(--rv-ink); transition-delay: 200ms; }
.model.is-in .staff__bar { transform: scaleX(1); }
.staff__delta { font: 500 13px var(--rv-mono); color: var(--rv-red); }
.shift__flow { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.shift__chip { padding: 8px 12px; font-size: 14px; font-weight: 500; border: 1px solid var(--rv-line-strong); }
.shift__chip.is-from { color: var(--rv-ink-2); background: transparent; }
.shift__chip.is-to { background: var(--rv-ink); color: var(--rv-paper); border-color: var(--rv-ink); }
.shift__arrow { color: var(--rv-muted); }

@media (max-width: 900px) { .pillar { grid-template-columns: minmax(0, 1fr); gap: 28px; } }
@media (prefers-reduced-motion: reduce) {
  .streak__marks span, .years__loss, .staff__bar { transition: none; opacity: 1; scale: 1; translate: none; transform: none; }
}
</style>
