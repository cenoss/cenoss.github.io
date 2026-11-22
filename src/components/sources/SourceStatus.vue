<script setup>
import { computed, ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import StatusMark from '../shared/StatusMark.vue';
import ToolMark from '../shared/ToolMark.vue';
import { useInView } from '../../composables/motion.js';

// Where collection stands: every source counted by status (one bar), the same sources as a grid per channel,
// the files read so far, and how each one is checked and cited.
const props = defineProps({
  t: { type: Object, required: true },
  channels: { type: Array, required: true },
  statusNames: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const order = ['opened', 'partial', 'todo', 'context'];
// a channel with one status for all (the news corpus) counts as one source
const perChannel = computed(() => props.channels.map((c) => ({
  ...c, marks: c.status ? [{ name: c.name, status: c.status }] : c.items.map((i) => ({ name: i.name, status: i.status })),
})));
const all = computed(() => perChannel.value.flatMap((c) => c.marks));
const counts = computed(() => order.map((s) => ({ status: s, n: all.value.filter((m) => m.status === s).length })).filter((c) => c.n));
const box = ref(null);
const run = useInView(box, { threshold: 0.3 });
</script>

<template>
  <div :id="t.id" class="rv-part status">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div ref="box" class="board" :class="{ 'is-in': run }">
      <figure class="tally">
        <figcaption class="rv-label">{{ t.asOf }}</figcaption>
        <p class="tally__total"><b>{{ all.length }}</b> {{ t.sourcesLabel }}</p>
        <div class="tally__bar" aria-hidden="true">
          <span v-for="(c, i) in counts" :key="c.status" class="tally__seg" :class="`is-${c.status}`" :style="{ flexGrow: c.n, '--d': `${i * 120}ms` }"></span>
        </div>
        <ul class="tally__keys">
          <li v-for="c in counts" :key="c.status"><b>{{ c.n }}</b><StatusMark :status="c.status" :label="statusNames[c.status]" /></li>
        </ul>
      </figure>

      <ul class="grid">
        <li v-for="c in perChannel" :key="c.key" class="grid__row">
          <span class="grid__name">{{ c.name }}</span>
          <span class="grid__marks">
            <span v-for="(m, i) in c.marks" :key="i" class="grid__mark" :class="`is-${m.status}`" :title="`${m.name}: ${statusNames[m.status]}`">
              <span class="rv-visually-hidden">{{ m.name }}: {{ statusNames[m.status] }}</span>
            </span>
          </span>
        </li>
      </ul>
    </div>

    <div class="read">
      <div class="read__files">
        <p class="rv-label">{{ t.filesLabel }}</p>
        <ul>
          <li v-for="f in t.files" :key="f.name" class="file"><ToolMark :icon="f.icon" :name="f.name" :size="30" /><span><b>{{ f.name }}</b><span>{{ f.by }}</span></span></li>
        </ul>
      </div>
      <div class="read__verify">
        <p class="rv-body">{{ t.verify }}</p>
        <a class="rv-link" :href="t.link.href">{{ t.link.label }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); gap: clamp(32px, 6vw, 96px); margin-top: clamp(36px, 4.4vw, 56px); align-items: start; }
.tally { display: flex; flex-direction: column; gap: 14px; }
.tally__total { font-size: 15px; color: var(--rv-ink-2); }
.tally__total b { font: 300 clamp(48px, 5vw, 72px)/0.9 var(--rv-serif); color: var(--rv-ink); margin-right: 8px; font-variant-numeric: lining-nums; }
.tally__bar { display: flex; gap: 3px; height: 18px; }
.tally__seg { flex-basis: 0; border: 1.5px solid var(--rv-blue); transform-origin: left; transform: scaleX(0); transition: transform 700ms cubic-bezier(.2, .7, .2, 1) var(--d); }
.tally__seg:last-child { border-radius: 0 4px 4px 0; }
.tally__seg.is-opened { background: var(--rv-blue); }
.tally__seg.is-partial { background: repeating-linear-gradient(90deg, var(--rv-blue) 0 4px, transparent 4px 8px); }
.tally__seg.is-todo { background: transparent; }
.tally__seg.is-context { border-color: var(--rv-muted); background: color-mix(in oklab, var(--rv-muted) 35%, transparent); }
.board.is-in .tally__seg { transform: scaleX(1); }
.tally__keys { display: flex; flex-wrap: wrap; gap: 10px 22px; }
.tally__keys li { display: inline-flex; align-items: center; gap: 8px; }
.tally__keys b { font: 500 15px var(--rv-mono); }

.grid { display: flex; flex-direction: column; border-top: 1px solid var(--rv-ink); }
.grid__row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--rv-line); }
.grid__name { font-size: 15px; font-weight: 500; }
.grid__marks { display: flex; gap: 6px; }
.grid__mark { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--rv-blue); }
.grid__mark.is-opened { background: var(--rv-blue); }
.grid__mark.is-partial { background: linear-gradient(90deg, var(--rv-blue) 50%, transparent 50%); }
.grid__mark.is-context { border-color: var(--rv-muted); background: color-mix(in oklab, var(--rv-muted) 35%, transparent); }

.read { display: grid; grid-template-columns: minmax(0, 8fr) minmax(0, 4fr); gap: clamp(32px, 6vw, 96px); margin-top: clamp(40px, 5vw, 64px); padding-top: 22px; border-top: 1px solid var(--rv-line); align-items: start; }
.read__files { display: flex; flex-direction: column; gap: 14px; }
.read__files ul { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.file { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: var(--rv-paper-2); min-width: 0; }
.file > span { display: flex; flex-direction: column; min-width: 0; }
.file b { font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
.file b + span { font: 400 11px/1.3 var(--rv-mono); color: var(--rv-muted); }
.read__verify { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }

@media (max-width: 960px) {
  .board, .read { grid-template-columns: minmax(0, 1fr); }
  .read__files ul { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 480px) { .read__files ul { grid-template-columns: minmax(0, 1fr); } }
@media (prefers-reduced-motion: reduce) { .tally__seg { transition: none; transform: none; } }
</style>
