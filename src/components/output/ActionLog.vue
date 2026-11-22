<script setup>
import { computed, ref } from 'vue';
import { useInView } from '../../composables/motion.js';
import { dateLocale } from '../../i18n.js';

// The action log (a part of Expected Deployed Output): a working window (filter, open a row), and the same
// rows on a 2025 timeline. Selecting in either selects in both. Text kept from the earlier site section.
const props = defineProps({ t: { type: Object, required: true } });

const filter = ref('all');
const selected = ref(props.t.detail.rowId);
const matches = (r, f) =>
  f === 'all' ? true
  : f === 'ettoday' ? r.group === 'ettoday'
  : f === 'rivals' ? r.group === 'rival' || r.group === 'platform'
  : r.type === f;
const shown = computed(() => props.t.rows.filter((r) => matches(r, filter.value)));
const countFor = (f) => props.t.rows.filter((r) => matches(r, f)).length;
const tagged = computed(() => props.t.rows.filter((r) => r.status === 'tagged').length);

const row = computed(() => props.t.rows.find((r) => r.id === selected.value));
const rowIndex = computed(() => props.t.rows.findIndex((r) => r.id === selected.value) + 1);
const isRich = computed(() => selected.value === props.t.detail.rowId);

// timeline: 2025, a dot per dated row (same-day rows stack), the undated ones in a bin
const y0 = Date.UTC(2025, 0, 1);
const y1 = Date.UTC(2026, 0, 1);
const pos = (iso) => ((Date.parse(iso) - y0) / (y1 - y0)) * 100;
const months = Array.from({ length: 12 }, (_, m) => ({
  pos: ((Date.UTC(2025, m, 1) - y0) / (y1 - y0)) * 100,
  label: new Intl.DateTimeFormat(dateLocale, { month: 'short', timeZone: 'UTC' }).format(Date.UTC(2025, m, 15)),
}));
const dated = computed(() => {
  const seen = {};
  return props.t.rows.filter((r) => r.iso).map((r) => ({ ...r, stack: (seen[r.iso] = (seen[r.iso] ?? -1) + 1) }));
});
const undated = computed(() => props.t.rows.filter((r) => !r.iso));

const win = ref(null);
const run = useInView(win, { threshold: 0.2 });
</script>

<template>
  <div :id="t.id" class="al">
    <div class="al__head">
      <p class="rv-label">{{ t.track }}</p>
      <p class="rv-body">{{ t.intro }}</p>
      <a class="rv-link" :href="t.link.href">{{ t.link.label }}</a>
    </div>

      <div ref="win" class="win rv-rise" :class="{ 'is-in': run }">
        <div class="win__bar">
          <span class="win__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="win__title">{{ t.window.title }} <span>/ {{ t.window.range }}</span></span>
          <span class="win__tally">
            <span class="win__meter" aria-hidden="true"><span :style="{ width: `${(tagged / t.rows.length) * 100}%` }"></span></span>
            {{ tagged }} / {{ t.rows.length }} {{ t.tally }}
          </span>
        </div>

        <div class="win__body">
          <!-- filters -->
          <nav class="side" :aria-label="t.window.title">
            <button v-for="f in t.filters" :key="f.key" type="button" class="side__f" :class="{ 'is-on': filter === f.key }" :aria-pressed="filter === f.key" @click="filter = f.key">
              {{ f.label }}<span>{{ countFor(f.key) }}</span>
            </button>
            <p class="side__label">{{ t.typesLabel }}</p>
            <button v-for="f in t.types" :key="f.key" type="button" class="side__f" :class="{ 'is-on': filter === f.key }" :aria-pressed="filter === f.key" @click="filter = f.key">
              {{ f.label }}<span>{{ countFor(f.key) }}</span>
            </button>
          </nav>

          <!-- the rows -->
          <div class="log">
            <div class="log__head" aria-hidden="true"><span>{{ t.columns[0] }}</span><span>{{ t.columns[1] }}</span><span>{{ t.columns[2] }}</span><span>{{ t.columns[3] }}</span></div>
            <ul class="log__rows">
              <li v-for="r in shown" :key="r.id">
                <button type="button" class="log__row" :class="{ 'is-on': selected === r.id }" :aria-pressed="selected === r.id" @click="selected = r.id">
                  <span class="log__actor"><span class="badge" :class="`is-${r.group}`">{{ r.badge }}</span>{{ r.actor }}</span>
                  <span class="log__move">{{ r.move }}</span>
                  <span class="log__status"><span class="rv-tag" :class="r.status === 'tagged' ? 'rv-tag--on' : 'rv-tag--warn'">{{ t.status[r.status] }}</span></span>
                  <span class="log__date">{{ r.date }}</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- the opened row -->
          <article class="detail" aria-live="polite">
            <template v-if="isRich">
              <p class="detail__head">{{ t.detail.head }}</p>
              <h3 class="detail__title">{{ t.detail.title }}</h3>
              <p v-for="(para, i) in t.detail.paras" :key="i" class="detail__p">
                <template v-for="(seg, j) in para" :key="j"><mark v-if="seg.mark">{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template>
              </p>
              <ul class="detail__notes"><li v-for="n in t.detail.notes" :key="n">{{ n }}</li></ul>
              <p class="detail__tag"><span class="rv-tag rv-tag--on">{{ t.detail.tag }}</span>{{ t.detail.tagNote }}</p>
              <p class="detail__foot">{{ t.detail.foot }}</p>
            </template>
            <template v-else-if="row">
              <p class="detail__head">{{ t.rowLabel.replace('{n}', rowIndex) }} · {{ row.actor }} · {{ row.date }}</p>
              <h3 class="detail__title">{{ row.move }}</h3>
              <p class="detail__p">{{ t.pending[row.status] }}</p>
              <p v-if="row.type" class="detail__tag"><span class="rv-tag">{{ t.typeNames[row.type] }}</span></p>
            </template>
          </article>
        </div>
      </div>

      <!-- the same rows in time -->
      <figure class="when">
        <figcaption class="rv-label">{{ t.timeline.label }}</figcaption>
        <div class="when__grid">
          <div class="when__track">
            <span v-for="m in months" :key="m.pos" class="when__month" :style="{ left: `${m.pos}%` }">{{ m.label }}</span>
            <button
              v-for="r in dated"
              :key="r.id"
              type="button"
              class="when__dot"
              :class="[`is-${r.group}`, { 'is-on': selected === r.id, 'is-out': !matches(r, filter) }]"
              :style="{ left: `${pos(r.iso)}%`, '--k': r.stack }"
              :aria-label="`${r.actor}: ${r.move}, ${r.date}`"
              @click="selected = r.id"
            >{{ r.badge }}</button>
          </div>
          <div class="when__bin">
            <span class="when__binlabel">{{ t.timeline.undated }}</span>
            <div class="when__binrow">
              <button
                v-for="r in undated"
                :key="r.id"
                type="button"
                class="when__dot is-static"
                :class="[`is-${r.group}`, { 'is-on': selected === r.id, 'is-out': !matches(r, filter) }]"
                :aria-label="`${r.actor}: ${r.move}, ${r.date}`"
                @click="selected = r.id"
              >{{ r.badge }}</button>
            </div>
          </div>
        </div>
      </figure>
  </div>
</template>

<style scoped>
.al { margin-top: clamp(40px, 5vw, 64px); }
.al__head { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 6fr) auto; gap: 16px 32px; align-items: baseline; }
@media (max-width: 900px) { .al__head { grid-template-columns: minmax(0, 1fr); } }

/* ---------------------------------------------------------------- the window */
.win { margin-top: clamp(24px, 3vw, 36px); background: #fbf9f4; border: 1px solid var(--rv-line-strong); box-shadow: 0 24px 60px -32px rgba(23, 21, 15, 0.35); }
.win__bar { display: flex; align-items: center; gap: 16px; padding: 12px 18px; border-bottom: 1px solid var(--rv-line); }
.win__dots { display: flex; gap: 6px; }
.win__dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--rv-paper-3); }
.win__title { font-size: 14px; font-weight: 600; }
.win__title span { font-weight: 400; color: var(--rv-muted); }
.win__tally { margin-left: auto; display: inline-flex; align-items: center; gap: 10px; font: 400 12px var(--rv-mono); color: var(--rv-muted); }
.win__meter { width: 72px; height: 6px; background: var(--rv-paper-2); border-radius: 3px; overflow: hidden; }
.win__meter span { display: block; height: 100%; background: var(--rv-ink); }

.win__body { display: grid; grid-template-columns: 180px minmax(0, 1fr) minmax(0, 360px); min-height: 480px; }
.side { display: flex; flex-direction: column; gap: 2px; padding: 14px 10px; border-right: 1px solid var(--rv-line); }
.side__f {
  display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 8px 10px; border: 0; border-radius: 6px;
  background: transparent; text-align: left; font-size: 14px; color: var(--rv-ink-2); transition: background-color 150ms ease;
}
.side__f span { font: 400 12px var(--rv-mono); color: var(--rv-muted); }
.side__f:hover { background: var(--rv-paper-2); }
.side__f.is-on { background: var(--rv-ink); color: var(--rv-paper); }
.side__f.is-on span { color: color-mix(in oklab, var(--rv-paper) 70%, transparent); }
.side__label { margin: 14px 10px 4px; font: 500 11px/1.4 var(--rv-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rv-muted); }

.log { min-width: 0; }
.log__head, .log__row { display: grid; grid-template-columns: 132px minmax(0, 1fr) 92px 64px; gap: 12px; align-items: center; padding: 0 18px; }
.log__head { height: 40px; border-bottom: 1px solid var(--rv-line); font: 500 11px/1 var(--rv-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--rv-muted); }
.log__row {
  width: 100%; min-height: 50px; border: 0; border-bottom: 1px solid var(--rv-line); background: transparent; text-align: left;
  font-size: 14px; transition: background-color 150ms ease;
}
.log__row:hover { background: var(--rv-paper); }
.log__row.is-on { background: var(--rv-red-wash); }
.log__actor { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; }
.log__move { color: var(--rv-ink-2); }
.log__date { font: 400 12px var(--rv-mono); color: var(--rv-muted); text-align: right; }
.badge {
  flex: none; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 6px;
  font: 600 11px/1 var(--rv-sans); background: var(--rv-paper-2); color: var(--rv-ink);
}
.badge.is-ettoday { background: var(--rv-ink); color: var(--rv-paper); }
.badge.is-rival, .badge.is-platform { background: var(--rv-red-wash); color: var(--rv-red); }

.detail { padding: 22px 24px; border-left: 1px solid var(--rv-line); background: var(--rv-paper); display: flex; flex-direction: column; gap: 14px; }
.detail__head { font: 400 12px var(--rv-mono); color: var(--rv-muted); }
.detail__title { font: 400 clamp(22px, 2vw, 28px)/1.2 var(--rv-serif); letter-spacing: -0.01em; }
html[lang^="zh"] .detail__title { font-weight: 500; letter-spacing: 0; }
.detail__p { font-size: 15px; line-height: 1.6; color: var(--rv-ink-2); }
.detail__p mark { background: linear-gradient(transparent 55%, var(--rv-red-wash) 55%); color: var(--rv-ink); padding: 0 2px; }
.detail__notes { display: flex; flex-direction: column; gap: 6px; padding-top: 12px; border-top: 1px solid var(--rv-line); font-size: 13px; color: var(--rv-muted); }
.detail__tag { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13px; color: var(--rv-ink-2); }
.detail__foot { margin-top: auto; font: 400 12px var(--rv-mono); color: var(--rv-muted); }

/* ---------------------------------------------------------------- the timeline */
.when { margin-top: clamp(32px, 4vw, 48px); display: flex; flex-direction: column; gap: 16px; }
.when__grid { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 32px; align-items: end; }
.when__track { position: relative; height: 104px; border-bottom: 1px solid var(--rv-ink); }
.when__month { position: absolute; bottom: -22px; font: 400 11px var(--rv-mono); color: var(--rv-muted); }
.when__month::before { content: ""; position: absolute; left: 0; bottom: 18px; width: 1px; height: 6px; background: var(--rv-line-strong); }
.when__dot {
  position: absolute; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border-radius: 50%;
  border: 1.5px solid var(--rv-paper); background: var(--rv-paper-3); font: 600 10px/1 var(--rv-sans); color: var(--rv-ink);
  transition: transform 160ms ease, opacity 160ms ease, box-shadow 160ms ease;
}
.when__track .when__dot { bottom: calc(6px + var(--k) * 32px); translate: -50% 0; }
.when__dot.is-ettoday { background: var(--rv-ink); color: var(--rv-paper); }
.when__dot.is-rival, .when__dot.is-platform { background: var(--rv-red-wash); color: var(--rv-red); }
.when__dot:hover { transform: scale(1.12); }
.when__dot.is-on { box-shadow: 0 0 0 2px var(--rv-red); }
.when__dot.is-out { opacity: 0.25; }
.when__bin { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border: 1px dashed var(--rv-line-strong); }
.when__binlabel { font: 500 11px/1.3 var(--rv-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--rv-muted); }
.when__binrow { display: flex; gap: 6px; }
.when__dot.is-static { position: relative; }

@media (max-width: 1100px) {
  .win__body { grid-template-columns: 160px minmax(0, 1fr); }
  .detail { grid-column: 1 / -1; border-left: 0; border-top: 1px solid var(--rv-line); }
}
@media (max-width: 760px) {
  .win__body { grid-template-columns: minmax(0, 1fr); min-height: 0; }
  .side { flex-direction: row; flex-wrap: wrap; gap: 6px; border-right: 0; border-bottom: 1px solid var(--rv-line); }
  .side__label { display: none; }
  .side__f { border: 1px solid var(--rv-line); border-radius: 999px; padding: 6px 12px; }
  .log__head { display: none; }
  .log__row { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "actor status" "move move" "date date"; row-gap: 4px; padding: 12px 16px; }
  .log__actor { grid-area: actor; }
  .log__move { grid-area: move; }
  .log__status { grid-area: status; }
  .log__date { grid-area: date; text-align: left; }
  .win__tally .win__meter { display: none; }
  .when__grid { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .when__month:nth-child(even) { visibility: hidden; }
}
</style>
