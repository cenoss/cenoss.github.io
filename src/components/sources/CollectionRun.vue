<script setup>
import { ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import UiIcon from '../shared/UiIcon.vue';
import ToolMark from '../shared/ToolMark.vue';
import { useInView } from '../../composables/motion.js';

// The weekly run: four channels into the Work/Task Agent, candidate rows into the staging tab; what a row
// looks like; and the rules the agent cannot skip.
defineProps({
  t: { type: Object, required: true },
  channels: { type: Array, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const box = ref(null);
const run = useInView(box, { threshold: 0.3 });
</script>

<template>
  <div :id="t.id" class="rv-part run">
    <PartHead :n="n" :total="total" :label="t.label" />
    <div class="run__head">
      <h3 class="rv-h3">{{ t.title }}</h3>
      <div class="run__side">
        <p class="rv-body">{{ t.text }}</p>
        <p class="run__tbd"><span class="rv-tag rv-tag--warn">TBD</span>{{ t.tbd }}</p>
      </div>
    </div>

    <div ref="box" class="flow" :class="{ 'is-in': run }">
      <ul class="flow__in">
        <li v-for="c in channels" :key="c.key" class="flow__ch" :class="`is-${c.side}`"><UiIcon :name="c.icon" :size="16" />{{ c.name }}</li>
      </ul>
      <span class="flow__join" aria-hidden="true"></span>
      <div class="flow__agent">
        <ToolMark icon="claude" name="Claude" :size="36" />
        <span><b>{{ t.agent.name }}</b><span>{{ t.agent.sub }}</span></span>
        <span class="flow__week" aria-hidden="true">1×/wk</span>
      </div>
      <span class="flow__wire" aria-hidden="true"><span>{{ t.flowLabel }}</span></span>
      <div class="flow__stage">
        <ToolMark icon="google-sheets" name="Google Sheets" :size="36" />
        <span><b>{{ t.staging.name }}</b><span>{{ t.staging.sub }}</span></span>
      </div>
    </div>
    <p class="flow__next"><a class="rv-link" :href="t.next.href">{{ t.next.label }}</a></p>

    <!-- what a row looks like -->
    <div class="rows">
      <figure v-for="r in t.rows" :key="r.name" class="sheet">
        <figcaption class="rv-label">{{ r.name }}</figcaption>
        <div class="sheet__scroll">
          <table>
            <thead><tr><th v-for="f in r.fields" :key="f" scope="col">{{ f }}</th></tr></thead>
            <tbody><tr><td v-for="(v, i) in r.example" :key="i">{{ v }}</td></tr></tbody>
          </table>
        </div>
      </figure>
    </div>

    <div class="rules">
      <p class="rv-label">{{ t.rulesLabel }}</p>
      <ul>
        <li v-for="r in t.rules" :key="r"><UiIcon name="check" :size="18" />{{ r }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.run__head { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(32px, 6vw, 96px); align-items: end; }
.run__side { display: flex; flex-direction: column; gap: 14px; }
.run__tbd { display: flex; gap: 10px; align-items: baseline; font-size: 14px; color: var(--rv-muted); }

.flow { display: grid; grid-template-columns: minmax(0, 1.3fr) 56px minmax(0, 1.1fr) minmax(120px, 0.7fr) minmax(0, 1fr); align-items: center; margin-top: clamp(40px, 5vw, 64px); }
.flow__in { display: flex; flex-direction: column; gap: 8px; }
.flow__ch { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--rv-paper-2); font-size: 14px; font-weight: 500; border-left: 3px solid var(--rv-ink); }
.flow__ch.is-primary { border-left-color: var(--rv-blue); }
.flow__ch svg { color: var(--rv-muted); flex: none; }
/* four lines gather into one */
.flow__join { align-self: stretch; margin: 20px 0; border: 1.5px solid var(--rv-line-strong); border-left: 0; border-radius: 0 12px 12px 0; position: relative; }
.flow__join::after { content: ""; position: absolute; left: 100%; top: 50%; width: 0; height: 1.5px; }
.flow__agent, .flow__stage { position: relative; display: flex; align-items: center; gap: 12px; padding: 18px; border: 1px solid var(--rv-ink); background: #fbf9f4; }
.flow__agent > span:nth-child(2), .flow__stage > span:last-child { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.flow__agent b, .flow__stage b { font: 400 20px/1.15 var(--rv-serif); }
html[lang^="zh"] .flow__agent b, html[lang^="zh"] .flow__stage b { font-weight: 500; }
.flow__agent > span:nth-child(2) > span, .flow__stage > span:last-child > span { font: 400 12px/1.4 var(--rv-mono); color: var(--rv-muted); }
.flow__week { position: absolute; top: -11px; right: 12px; padding: 3px 8px; border-radius: 999px; background: var(--rv-red); color: #fff; font: 500 11px/1.2 var(--rv-mono); }
.flow__wire { position: relative; height: 2px; margin: 0 10px; background: repeating-linear-gradient(90deg, var(--rv-ink) 0 6px, transparent 6px 11px); background-size: 22px 2px; }
.flow.is-in .flow__wire { animation: run 1.2s linear infinite; }
@keyframes run { to { background-position: 22px 0; } }
.flow__wire::after { content: ""; position: absolute; right: -2px; top: -4px; border-left: 8px solid var(--rv-ink); border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
.flow__wire span { position: absolute; left: 50%; bottom: 10px; translate: -50% 0; white-space: nowrap; font: 500 11px var(--rv-mono); color: var(--rv-muted); }
.flow__next { margin-top: 18px; display: flex; justify-content: flex-end; }

.rows { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: var(--rv-gap); margin-top: clamp(40px, 5vw, 64px); }
.sheet { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.sheet__scroll { overflow-x: auto; border: 1px solid var(--rv-line-strong); background: #fbf9f4; }
.sheet table { border-collapse: collapse; min-width: 100%; }
.sheet th, .sheet td { padding: 9px 12px; border-right: 1px solid var(--rv-line); text-align: left; white-space: nowrap; font-size: 13px; }
.sheet th { background: var(--rv-paper-2); font: 500 11px/1.2 var(--rv-mono); color: var(--rv-ink-2); border-bottom: 1px solid var(--rv-line-strong); }
.sheet td { font-family: var(--rv-mono); font-size: 12px; color: var(--rv-ink); }

.rules { margin-top: clamp(32px, 4vw, 48px); display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 9fr); gap: 16px 32px; align-items: start; padding-top: 18px; border-top: 1px solid var(--rv-line); }
.rules ul { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px 24px; }
.rules li { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; line-height: 1.45; }
.rules li svg { flex: none; color: var(--rv-red); margin-top: 1px; }

@media (max-width: 1100px) {
  .flow { grid-template-columns: minmax(0, 1fr); gap: 0; }
  .flow__join { height: 28px; margin: 0 0 0 24px; width: 2px; border: 0; background: var(--rv-line-strong); border-radius: 0; }
  .flow__wire { height: 44px; width: 2px; margin: 0 0 0 24px; background: repeating-linear-gradient(180deg, var(--rv-ink) 0 6px, transparent 6px 11px); background-size: 2px 22px; }
  .flow.is-in .flow__wire { animation-name: rundown; }
  @keyframes rundown { to { background-position: 0 22px; } }
  .flow__wire::after { right: -4px; top: auto; bottom: -2px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 8px solid var(--rv-ink); border-bottom: 0; }
  .flow__wire span { left: 18px; bottom: 50%; translate: 0 50%; }
  .rows { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 900px) {
  .run__head { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .rules { grid-template-columns: minmax(0, 1fr); }
  .rules ul { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) { .flow.is-in .flow__wire { animation: none; } }
</style>
