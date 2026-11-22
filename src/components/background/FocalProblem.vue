<script setup>
import { computed, ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import StatFigure from './StatFigure.vue';
import { useInView, useScrollProgress } from '../../composables/motion.js';

const props = defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});

const ledger = ref(null);
const ledgerIn = useInView(ledger);
const bars = ref(null);
const barsIn = useInView(bars, { threshold: 0.5 });
const hovered = ref(null);

// The research question lights up as it is read: a Latin word, or one CJK character, at a time
const question = ref(null);
const progress = useScrollProgress(question, { start: 0.9, end: 0.55 });
const CJK = '　-〿㐀-鿿＀-￯';
const TOKEN = new RegExp(`[${CJK}]|[^\\s${CJK}]+|\\s+`, 'g');
const tokens = computed(() =>
  props.t.question.segments.flatMap((seg) => seg.text.match(TOKEN).map((w) => ({ w, mark: !!seg.mark, space: /^\s+$/.test(w) }))),
);
const wordCount = computed(() => tokens.value.filter((x) => !x.space).length);
const lit = computed(() => Math.round(progress.value * wordCount.value));
const litFlags = computed(() => {
  let k = 0;
  return tokens.value.map((x) => (x.space ? true : k++ < lit.value));
});
</script>

<template>
  <div :id="t.id" class="rv-part problem">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <!-- the ledger: what readers say beside what the accounts said -->
    <div ref="ledger" class="ledger" :class="{ 'is-in': ledgerIn }">
      <div v-for="col in t.columns" :key="col.tone" class="ledger__col" :class="`is-${col.tone}`">
        <p class="ledger__heading">{{ col.heading }}</p>
        <div class="ledger__stats">
          <StatFigure v-for="s in col.stats" :key="s.caption" :stat="s" :run="ledgerIn" />
        </div>
      </div>
      <span class="ledger__seam" aria-hidden="true">{{ t.seam }}</span>
    </div>

    <!-- meanwhile: where the audience went, and where the ad money went -->
    <div class="meanwhile">
      <figure ref="bars" class="bars" :class="{ 'is-in': barsIn }">
        <figcaption class="rv-label">{{ t.meanwhile.label }}</figcaption>
        <ul class="bars__list">
          <li
            v-for="b in t.meanwhile.bars"
            :key="b.name"
            class="bars__row"
            :class="{ 'is-dim': hovered && hovered !== b.name }"
            :title="`${b.name}: ${b.value}% ${t.meanwhile.unit}`"
            @mouseenter="hovered = b.name"
            @mouseleave="hovered = null"
          >
            <span class="bars__name">{{ b.name }}</span>
            <span class="bars__track" aria-hidden="true"><span class="bars__fill" :style="{ '--v': b.value / 100 }"></span></span>
            <span class="bars__value">{{ b.value }}%<span class="rv-visually-hidden"> {{ t.meanwhile.unit }}</span></span>
          </li>
        </ul>
        <div class="bars__axis" aria-hidden="true"><span>0</span><span>50%</span><span>100%</span></div>
        <a class="rv-source" :href="t.meanwhile.href" target="_blank" rel="noopener">{{ t.meanwhile.source }}</a>
      </figure>

      <div class="market">
        <p class="market__value">{{ t.meanwhile.market.value }}</p>
        <p class="market__caption">{{ t.meanwhile.market.caption }}</p>
        <a class="rv-source" :href="t.meanwhile.market.href" target="_blank" rel="noopener">{{ t.meanwhile.market.source }}</a>
      </div>
    </div>

    <!-- the research question -->
    <div ref="question" class="question">
      <p class="rv-label question__label">{{ t.question.label }}</p>
      <p class="question__text">
        <span class="rv-visually-hidden">{{ t.question.segments.map((s) => s.text).join('') }}</span>
        <span aria-hidden="true"><span
          v-for="(x, i) in tokens"
          :key="i"
          class="question__w"
          :class="{ 'is-lit': litFlags[i], 'is-mark': x.mark }"
        >{{ x.w }}</span></span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ---------------------------------------------------------------- ledger */
.ledger {
  position: relative; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: clamp(40px, 5vw, 64px); background: var(--rv-paper-2);
}
.ledger__col { padding: clamp(24px, 3.4vw, 44px) clamp(24px, 3.4vw, 48px) clamp(28px, 3.4vw, 44px); border-top: 4px solid var(--rv-ink); }
.ledger__col.is-no { border-top-color: var(--rv-red); }
.ledger__col + .ledger__col { border-left: 1px solid var(--rv-line); }
.ledger__heading { margin: 0 0 clamp(24px, 3vw, 40px); font: 500 12px/1.4 var(--rv-mono); letter-spacing: 0.08em; text-transform: uppercase; }
.ledger__col.is-no .ledger__heading { color: var(--rv-red); }
.ledger__stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--rv-gap); }
.ledger__seam {
  position: absolute; left: 50%; top: 50%; translate: -50% -50%;
  display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%;
  background: var(--rv-paper); border: 1px solid var(--rv-line-strong);
  font: italic 400 22px/1 var(--rv-serif); color: var(--rv-red);
}
html[lang^="zh"] .ledger__seam { font-style: normal; font-weight: 500; }
.ledger .stat { opacity: 0; translate: 0 16px; transition: opacity 600ms ease, translate 600ms cubic-bezier(.2, .7, .2, 1); }
.ledger.is-in .stat { opacity: 1; translate: 0 0; }
.ledger.is-in .is-yes .stat:nth-child(2) { transition-delay: 120ms; }
.ledger.is-in .is-no .stat:nth-child(1) { transition-delay: 240ms; }
.ledger.is-in .is-no .stat:nth-child(2) { transition-delay: 360ms; }

/* ---------------------------------------------------------------- meanwhile */
.meanwhile {
  display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: clamp(32px, 6vw, 96px);
  margin-top: clamp(40px, 5vw, 64px); padding-top: clamp(24px, 3vw, 32px); border-top: 1px solid var(--rv-line);
}
.bars { margin: 0; display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.bars__list { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 8px; }
.bars__row {
  display: grid; grid-template-columns: 96px minmax(0, 1fr) 48px; align-items: center; gap: 16px;
  transition: opacity 160ms ease;
}
.bars__row.is-dim { opacity: 0.4; }
.bars__name { font-size: 15px; font-weight: 500; }
.bars__track { position: relative; height: 12px; background: color-mix(in oklab, var(--rv-ink) 7%, transparent); border-radius: 0 4px 4px 0; }
.bars__fill {
  position: absolute; inset: 0 auto 0 0; width: calc(var(--v) * 100%); background: var(--rv-ink);
  border-radius: 0 4px 4px 0; transform-origin: left; transform: scaleX(0);
  transition: transform 900ms cubic-bezier(.2, .7, .2, 1);
}
.bars.is-in .bars__fill { transform: scaleX(1); }
.bars__row:nth-child(2) .bars__fill { transition-delay: 90ms; }
.bars__row:nth-child(3) .bars__fill { transition-delay: 180ms; }
.bars__value { font: 500 15px/1 var(--rv-mono); font-variant-numeric: tabular-nums; text-align: right; }
.bars__axis {
  display: flex; justify-content: space-between; width: calc(100% - 96px - 48px - 32px); margin-left: calc(96px + 16px);
  margin-top: -6px; font: 400 11px/1 var(--rv-mono); color: var(--rv-muted);
}
.market { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.market__value {
  margin: 28px 0 0; font-family: var(--rv-serif); font-weight: 300; font-size: clamp(48px, 5vw, 72px);
  line-height: 0.95; letter-spacing: -0.03em; font-variant-numeric: lining-nums;
}
html[lang^="zh"] .market__value { letter-spacing: -0.01em; }
.market__caption { margin: 0; max-width: 34ch; font-size: 15px; color: var(--rv-ink-2); }

/* ---------------------------------------------------------------- question */
.question { margin-top: clamp(72px, 9vw, 128px); display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 10fr); gap: var(--rv-gap); }
.question__label { margin: 0; padding-top: 0.9em; color: var(--rv-red); }
.question__text {
  margin: 0; font-family: var(--rv-serif); font-weight: 300; font-optical-sizing: auto;
  font-size: clamp(30px, 3.9vw, 56px); line-height: 1.16; letter-spacing: var(--rv-track-display);
  text-wrap: pretty;
}
html[lang^="zh"] .question__text { font-weight: 400; line-height: 1.45; }
.question__w { color: color-mix(in oklab, var(--rv-ink) 18%, transparent); transition: color 240ms ease; }
.question__w.is-lit { color: var(--rv-ink); }
.question__w.is-mark { font-style: italic; }
html[lang^="zh"] .question__w.is-mark { font-style: normal; font-weight: 500; }
.question__w.is-mark.is-lit {
  color: var(--rv-red);
  background: linear-gradient(var(--rv-red), var(--rv-red)) no-repeat 0 92% / 100% 2px;
}

/* ---------------------------------------------------------------- smaller screens */
@media (max-width: 1100px) {
  .ledger__stats { grid-template-columns: minmax(0, 1fr); row-gap: 32px; }
}
@media (max-width: 760px) {
  .ledger { grid-template-columns: minmax(0, 1fr); }
  .ledger__col + .ledger__col { border-left: 0; }
  .ledger__seam { top: auto; bottom: auto; position: relative; left: auto; translate: none; margin: -32px auto; z-index: 1; grid-row: 2; }
  .ledger__col.is-no { grid-row: 3; }
  .ledger__stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .meanwhile { grid-template-columns: minmax(0, 1fr); }
  .market__value { margin-top: 0; }
  .question { grid-template-columns: minmax(0, 1fr); }
  .question__label { padding-top: 0; }
}
@media (max-width: 480px) {
  .ledger__stats { grid-template-columns: minmax(0, 1fr); }
  .bars__row { grid-template-columns: 80px minmax(0, 1fr) 40px; gap: 12px; }
  .bars__axis { width: calc(100% - 80px - 40px - 24px); margin-left: calc(80px + 12px); }
}
@media (prefers-reduced-motion: reduce) {
  .ledger .stat, .bars__fill, .question__w { transition: none; }
}
</style>
