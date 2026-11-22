<script setup>
import { computed } from 'vue';
import { dateLocale } from '../../i18n.js';

const props = defineProps({
  t: { type: Object, required: true },
  run: { type: Boolean, default: false },
});

const start = Date.parse(props.t.start);
const end = Date.parse(props.t.end);
const at = (ms) => ((ms - start) / (end - start)) * 100;

const turnaround = Date.parse(props.t.turnaround);
const now = Date.now();
// "today" shows only while the window is open
const showToday = now >= start && now <= end;

const day = new Intl.DateTimeFormat(dateLocale, { day: 'numeric', month: 'short', year: 'numeric' });
const month = new Intl.DateTimeFormat(dateLocale, { month: 'short', year: 'numeric' });

const months = computed(() => {
  const out = [];
  const d = new Date(start);
  for (let i = 1; i < 24; i++) {
    const m = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + i, 1);
    out.push({ pos: at(m), year: new Date(m).getUTCMonth() === 0, label: new Date(m).getUTCFullYear() });
  }
  return out;
});
const yearMark = computed(() => months.value.find((m) => m.year));
const todayPos = at(now);
</script>

<template>
  <figure class="tl" :class="{ 'is-in': run }">
    <figcaption class="rv-label">{{ t.label }}</figcaption>
    <div class="tl__track">
      <span class="tl__elapsed" :style="{ '--w': showToday ? todayPos / 100 : 1 }" aria-hidden="true"></span>
      <span
        v-for="m in months"
        :key="m.pos"
        class="tl__tick"
        :class="{ 'is-year': m.year }"
        :style="{ left: `${m.pos}%` }"
        aria-hidden="true"
      ></span>
      <span class="tl__event tl__event--turn" :style="{ left: `${at(turnaround)}%` }">
        <span class="tl__tag">{{ t.turnaroundLabel }} · {{ month.format(turnaround) }}</span>
      </span>
      <span v-if="showToday" class="tl__event tl__event--today" :class="{ 'is-end': todayPos > 75 }" :style="{ left: `${todayPos}%` }">
        <span class="tl__tag">{{ t.todayLabel }} · {{ day.format(now) }}</span>
      </span>
    </div>
    <div class="tl__ends">
      <span>{{ t.startLabel }}</span>
      <span v-if="yearMark" class="tl__year" :style="{ left: `${yearMark.pos}%` }" aria-hidden="true">{{ yearMark.label }}</span>
      <span>{{ t.endLabel }}</span>
    </div>
  </figure>
</template>

<style scoped>
.tl { margin: clamp(48px, 6vw, 80px) 0 0; display: flex; flex-direction: column; gap: 14px; }
.tl__track { position: relative; height: 4px; margin-top: 44px; background: color-mix(in oklab, var(--rv-ink) 10%, transparent); }
.tl__elapsed {
  position: absolute; inset: 0 auto 0 0; width: calc(var(--w) * 100%); background: var(--rv-ink);
  transform-origin: left; transform: scaleX(0); transition: transform 1400ms cubic-bezier(.2, .7, .2, 1);
}
.tl.is-in .tl__elapsed { transform: scaleX(1); }
.tl__tick { position: absolute; top: 100%; width: 1px; height: 6px; background: var(--rv-line-strong); }
.tl__tick.is-year { top: -8px; height: 20px; background: var(--rv-ink); }
.tl__event { position: absolute; top: 50%; }
.tl__event::before {
  content: ""; position: absolute; left: 0; top: 0; translate: -50% -50%;
  width: 14px; height: 14px; border-radius: 50%; background: var(--rv-red); box-shadow: 0 0 0 4px var(--rv-paper);
}
.tl__event--today::before { width: 10px; height: 10px; background: var(--rv-paper); border: 2px solid var(--rv-ink); }
.tl__tag {
  position: absolute; bottom: 18px; left: 0; translate: -50% 0; white-space: nowrap;
  font: 500 12px/1 var(--rv-mono); letter-spacing: 0.02em;
}
.tl__event--turn .tl__tag { color: var(--rv-red); }
.tl__event--today.is-end .tl__tag { translate: calc(-100% + 12px) 0; }
.tl__ends { position: relative; display: flex; justify-content: space-between; font: 400 12px/1 var(--rv-mono); color: var(--rv-muted); padding-top: 4px; }
.tl__year { position: absolute; top: 4px; translate: -50% 0; color: var(--rv-ink); }

@media (max-width: 520px) { .tl__tag { font-size: 11px; letter-spacing: 0; } }
@media (prefers-reduced-motion: reduce) { .tl__elapsed { transition: none; } }
</style>
