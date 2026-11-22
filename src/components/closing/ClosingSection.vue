<script setup>
import { computed } from 'vue';
import { otherLang } from '../../i18n.js';

// The close and the footer: the claim, the milestones from W9 to W16 with this week marked, the name, the links.
const props = defineProps({ t: { type: Object, required: true } });
const { first, last, w9Monday } = props.t.weeks;
const at = (w) => ((w - first) / (last - first)) * 100;
const weekNow = computed(() => first + Math.floor((Date.now() - Date.parse(w9Monday)) / (7 * 864e5)));
const showNow = computed(() => weekNow.value >= first && weekNow.value <= last);
const label = (w) => props.t.week.replace('{n}', w);
const ticks = Array.from({ length: last - first + 1 }, (_, i) => first + i);
</script>

<template>
  <footer :id="t.id" class="rv close" aria-labelledby="close-h">
    <div class="rv-wrap">
      <div class="close__top">
        <div>
          <h2 id="close-h" class="close__title">{{ t.title }}</h2>
          <p class="close__text">{{ t.text }}</p>
        </div>
        <a class="close__cta" :href="t.cta.href">{{ t.cta.label }}<span aria-hidden="true">→</span></a>
      </div>

      <!-- the weeks to the contest -->
      <ol class="weeks">
        <li v-for="w in ticks" :key="`t${w}`" class="weeks__tick" :style="{ left: `${at(w)}%` }" aria-hidden="true">{{ label(w) }}</li>
        <li v-for="m in t.milestones" :key="m.week" class="weeks__m" :class="{ 'is-mark': m.mark, 'is-past': showNow && m.week < weekNow }" :style="{ left: `${at(m.week)}%` }">
          <span class="rv-visually-hidden">{{ label(m.week) }}: </span><b>{{ m.label }}</b><span v-if="m.note">{{ m.note }}</span>
        </li>
        <li v-if="showNow" class="weeks__now" :style="{ left: `${at(weekNow)}%` }"><span>{{ t.thisWeek }}</span></li>
      </ol>

      <p class="close__word" aria-hidden="true">{{ t.wordmark }}</p>

      <div class="foot">
        <p class="foot__lede"><b>{{ t.wordmark }}</b>{{ t.lede }}</p>
        <nav v-for="col in t.columns" :key="col.title" class="foot__col" :aria-label="col.title">
          <h3>{{ col.title }}</h3>
          <ul>
            <li v-for="l in col.links" :key="l.label">
              <a v-if="l.lang" :href="otherLang.href" :hreflang="otherLang.hreflang" :lang="otherLang.hreflang">{{ l.label }}</a>
              <a v-else :href="l.href">{{ l.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
      <p class="foot__legal">{{ t.legal }}</p>
    </div>
  </footer>
</template>

<style scoped>
.close { background: var(--rv-paper-2); padding-bottom: 40px; }
.close__top { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; flex-wrap: wrap; }
.close__title { font: 400 clamp(40px, 5.4vw, 80px)/1 var(--rv-serif); letter-spacing: -0.028em; max-width: 14ch; }
html[lang^="zh"] .close__title { font-weight: 500; letter-spacing: 0; line-height: 1.2; }
.close__text { margin-top: 18px; font-size: 17px; color: var(--rv-ink-2); max-width: 48ch; }
.close__cta {
  display: inline-flex; align-items: center; gap: 12px; padding: 14px 22px; border-radius: 999px; background: var(--rv-ink); color: var(--rv-paper);
  font-size: 15px; font-weight: 500; transition: background-color 160ms ease;
}
.close__cta span { transition: translate 200ms ease; }
.close__cta:hover { background: var(--rv-red); }
.close__cta:hover span { translate: 4px 0; }

.weeks { position: relative; height: 128px; margin: clamp(56px, 7vw, 96px) 16px 56px; border-bottom: 2px solid var(--rv-ink); }
.weeks__tick { position: absolute; bottom: -24px; translate: -50% 0; font: 400 11px var(--rv-mono); color: var(--rv-muted); white-space: nowrap; }
.weeks__tick::before { content: ""; position: absolute; left: 50%; bottom: 20px; width: 1px; height: 8px; background: var(--rv-line-strong); }
/* the label stands above its dot; the dot sits on the line (every other label stands higher, so neighbours never touch) */
.weeks__m { position: absolute; bottom: 0; padding-bottom: 16px; translate: -50% 0; display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; width: 120px; }
.weeks__m::after { content: ""; position: absolute; bottom: -7px; left: 50%; translate: -50% 0; width: 12px; height: 12px; border-radius: 50%; background: var(--rv-paper-2); border: 2px solid var(--rv-ink); }
.weeks__m::before { content: ""; position: absolute; bottom: 0; left: 50%; width: 1px; height: 12px; background: var(--rv-line-strong); }
.weeks__m b { font-size: 13px; font-weight: 600; line-height: 1.25; }
.weeks__m span:not(.rv-visually-hidden) { font: 400 11px/1.3 var(--rv-mono); color: var(--rv-muted); }
.weeks__m:nth-of-type(even) { padding-bottom: 60px; }
.weeks__m:nth-of-type(even)::before { height: 56px; }
.weeks__m.is-past::after { background: var(--rv-ink); }
.weeks__m.is-mark::after { background: var(--rv-red); border-color: var(--rv-red); width: 16px; height: 16px; bottom: -9px; }
.weeks__m.is-mark b { color: var(--rv-red); }
/* this week: a short red line down from the axis to its tag, under the week labels */
.weeks__now { position: absolute; top: 100%; height: 30px; width: 2px; background: var(--rv-red); translate: -1px 0; }
.weeks__now span { position: absolute; top: 100%; left: 50%; translate: -50% 0; padding: 3px 8px; border-radius: 999px; background: var(--rv-red); color: #fff; font: 500 11px/1.2 var(--rv-mono); white-space: nowrap; }

.close__word { margin-top: clamp(64px, 8vw, 120px); font: 400 clamp(88px, 22vw, 340px)/0.82 var(--rv-serif); letter-spacing: -0.05em; white-space: nowrap; }

.foot { display: grid; grid-template-columns: minmax(0, 4fr) repeat(4, minmax(0, 2fr)); gap: var(--rv-gap); margin-top: clamp(40px, 5vw, 64px); padding-top: 28px; border-top: 1px solid var(--rv-ink); }
.foot__lede { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: var(--rv-ink-2); }
.foot__lede b { font: 400 22px/1 var(--rv-serif); color: var(--rv-ink); }
.foot__col h3 { font: 500 11px/1.4 var(--rv-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rv-muted); margin-bottom: 10px; }
.foot__col ul { display: flex; flex-direction: column; gap: 6px; }
.foot__col a { font-size: 14px; transition: color 160ms ease; }
.foot__col a:hover { color: var(--rv-red); }
.foot__legal { margin-top: 48px; font: 400 12px var(--rv-mono); color: var(--rv-muted); }

@media (max-width: 900px) {
  .foot { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 28px; }
  .foot__lede { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  /* a phone: the milestones as a list down a line */
  .weeks { height: auto; margin: 48px 0 0; padding-left: 22px; border-bottom: 0; border-left: 2px solid var(--rv-ink); display: flex; flex-direction: column; gap: 18px; }
  .weeks__tick { display: none; }
  .weeks__m, .weeks__m:nth-of-type(even) { position: relative; left: auto !important; bottom: auto; translate: none; width: auto; align-items: flex-start; text-align: left; }
  .weeks__m, .weeks__m:nth-of-type(even) { padding-bottom: 0; }
  .weeks__m::before, .weeks__m:nth-of-type(even)::before { display: none; }
  .weeks__m::after, .weeks__m.is-mark::after { left: -29px; bottom: auto; top: 3px; translate: none; }
  .weeks__m .rv-visually-hidden { position: static !important; width: auto; height: auto; clip: auto; clip-path: none; font: 400 11px var(--rv-mono); color: var(--rv-muted); }
  .weeks__now { display: none; }
}
</style>
