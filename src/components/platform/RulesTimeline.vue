<script setup>
import { computed } from 'vue';

// The rule change on one dated track: numbered events, then the stretch since the drafts went to party
// negotiation, counted to today. Undated moves are listed under it.
const props = defineProps({ p: { type: Object, required: true } });

const now = Date.now();
const start = Date.parse(props.p.events[0].date);
const at = (ms) => ((ms - start) / (now - start)) * 100;
const since = Date.parse(props.p.stalled.since);
// numbers above the dots; two dots closer than 8% of the track push their numbers apart
const pins = computed(() => {
  const pos = props.p.events.map((e) => at(Date.parse(e.date)));
  return props.p.events.map((e, i) => {
    const near = (j) => j >= 0 && j < pos.length && Math.abs(pos[j] - pos[i]) < 8;
    return { ...e, pos: pos[i], shift: near(i + 1) ? -12 : near(i - 1) ? 12 : 0 };
  });
});
const months = computed(() => {
  const a = new Date(since); const b = new Date(now);
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) - (b.getDate() < a.getDate() ? 1 : 0);
});
</script>

<template>
  <figure class="rt">
    <div class="rt__track" aria-hidden="true">
      <span class="rt__stall" :style="{ left: `${at(since)}%` }"></span>
      <span v-for="(e, i) in pins" :key="e.date" class="rt__pin" :class="{ 'is-mark': e.mark }" :style="{ left: `${e.pos}%` }">
        <span class="rt__pin-n" :style="{ translate: `calc(-50% + ${e.shift}px) 0` }">{{ i + 1 }}</span>
      </span>
      <span class="rt__now" style="left: 100%"></span>
    </div>
    <p class="rt__count">
      <b>{{ months }}</b><span>{{ p.stalled.label }}</span><span class="rt__asof">{{ p.stalled.asOf }}</span>
    </p>

    <ol class="rt__list">
      <li v-for="(e, i) in p.events" :key="e.date" :class="{ 'is-mark': e.mark }">
        <span class="rt__n" aria-hidden="true">{{ i + 1 }}</span>
        <span class="rt__date">{{ e.label }}</span>
        <span class="rt__what"><b>{{ e.actor }}</b> {{ e.text }}</span>
      </li>
    </ol>
    <p class="rv-label rt__openlabel">{{ p.openLabel }}</p>
    <ul class="rt__open">
      <li v-for="o in p.open" :key="o.text"><b>{{ o.actor }}</b> {{ o.text }}</li>
    </ul>
  </figure>
</template>

<style scoped>
.rt { display: flex; flex-direction: column; gap: 14px; }
.rt__track { position: relative; height: 4px; margin: 26px 12px 8px; background: color-mix(in oklab, var(--rv-ink) 12%, transparent); }
.rt__stall {
  position: absolute; top: -5px; bottom: -5px; right: 0;
  background: repeating-linear-gradient(135deg, var(--rv-red) 0 2px, transparent 2px 6px); opacity: 0.55;
}
.rt__pin {
  position: absolute; top: 50%; translate: -50% -50%; width: 12px; height: 12px; border-radius: 50%;
  background: var(--rv-paper); border: 1.5px solid var(--rv-ink);
}
.rt__pin.is-mark { background: var(--rv-red); border-color: var(--rv-red); }
.rt__pin-n { position: absolute; left: 50%; bottom: 16px; font: 500 11px/1 var(--rv-mono); }
.rt__pin.is-mark .rt__pin-n { color: var(--rv-red); }
.rt__now { position: absolute; top: -10px; width: 2px; height: 24px; background: var(--rv-ink); translate: -1px 0; }
.rt__count { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; justify-content: flex-end; text-align: right; }
.rt__count b { font: 300 clamp(44px, 4.4vw, 64px)/0.9 var(--rv-serif); color: var(--rv-red); font-variant-numeric: lining-nums; }
.rt__count span { font-size: 15px; font-weight: 500; }
.rt__asof { font: 400 12px var(--rv-mono) !important; color: var(--rv-muted); }
.rt__list { display: flex; flex-direction: column; border-top: 1px solid var(--rv-line); }
.rt__list li { display: grid; grid-template-columns: 28px 112px minmax(0, 1fr); gap: 10px; align-items: baseline; padding: 10px 0; border-bottom: 1px solid var(--rv-line); font-size: 14px; }
.rt__n { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--rv-ink); font: 500 10px/1 var(--rv-mono); }
.is-mark .rt__n { background: var(--rv-red); border-color: var(--rv-red); color: #fff; }
.rt__date { font: 400 12px/1.4 var(--rv-mono); color: var(--rv-muted); }
.rt__what b, .rt__open b { font-weight: 600; margin-right: 4px; }
.rt__openlabel { margin-top: 6px; }
.rt__open { display: flex; flex-direction: column; gap: 8px; }
.rt__open li { padding: 10px 12px; border: 1px dashed var(--rv-line-strong); font-size: 14px; color: var(--rv-ink-2); }
@media (max-width: 480px) { .rt__list li { grid-template-columns: 28px minmax(0, 1fr); } .rt__date { grid-column: 2; } .rt__what { grid-column: 2; } }
</style>
