<script setup>
import { computed, reactive, ref } from 'vue';
import { useInView } from '../../composables/motion.js';
import { formatMillions } from '../../i18n.js';

// Six Questions Through Three Lenses (a part of Expected Deployed Output): which lens answers which question,
// then the three working cards; the scenario card is the rules panel's slider.
const props = defineProps({ t: { type: Object, required: true } });

// card 1: sort each platform; the marker slides along a friend-to-foe scale
const sortCard = props.t.cards.sort;
const choice = reactive(Object.fromEntries(sortCard.items.map((i) => [i.name, 'both'])));
const sortedCount = computed(() => Object.values(choice).filter(Boolean).length);
const place = { friend: 8, both: 50, foe: 92 };

// card 3: the revenue-sharing scenario (a scenario, not a forecast)
const sc = props.t.cards.scenario;
const fund = ref(sc.fundRange.value);
const use = ref(sc.useRange.value);
const othersTotal = sc.others.reduce((a, b) => a + b, 0);
const share = computed(() => fund.value * (use.value / (use.value + othersTotal)));
const segments = computed(() => {
  const total = use.value + othersTotal;
  return [{ name: 'ETtoday', v: use.value, focal: true }, ...sc.names.map((name, i) => ({ name, v: sc.others[i] }))]
    .map((s) => ({ ...s, pct: (s.v / total) * 100 }));
});
const reset = () => { fund.value = sc.fundRange.value; use.value = sc.useRange.value; };

const cards = ref(null);
const run = useInView(cards, { threshold: 0.15 });
</script>

<template>
  <div :id="t.id" class="qp">
    <div class="qp__head">
      <h4 class="qp__title">{{ t.title }}</h4>
      <ul class="lenses">
        <li v-for="(l, i) in t.lenses" :key="l.key"><span class="lenses__n">{{ i + 1 }}</span><b>{{ l.name }}</b><span>{{ l.by }}</span></li>
      </ul>
    </div>

      <!-- which lens answers which question -->
      <figure class="matrix">
        <figcaption class="rv-label">{{ t.matrixLabel }}</figcaption>
        <table>
          <thead>
            <tr>
              <th scope="col"><span class="rv-visually-hidden">AQ</span></th>
              <th v-for="(l, i) in t.lenses" :key="l.key" scope="col"><span class="matrix__n">{{ i + 1 }}</span>{{ l.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in t.aqs" :key="a.code">
              <th scope="row"><span class="matrix__code">{{ a.code }}</span><span class="matrix__name">{{ a.name }}</span><span class="matrix__sub">{{ a.sub }}</span></th>
              <td v-for="l in t.lenses" :key="l.key">
                <span v-if="a.lens === l.key" class="matrix__dot is-main" role="img" :aria-label="l.name"></span>
                <span v-else-if="a.also === l.key" class="matrix__dot" role="img" :aria-label="l.name"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </figure>

      <!-- the three cards -->
      <div ref="cards" class="cards" :class="{ 'is-in': run }">
        <!-- 1 friend or foe -->
        <article class="card rv-rise">
          <h3 class="card__title">{{ sortCard.title }}</h3>
          <p class="card__text">{{ sortCard.text }}</p>
          <div class="widget">
            <div class="widget__head"><span>{{ sortCard.widget }}</span><span class="widget__meta">{{ sortedCount }} {{ sortCard.sorted }}</span></div>
            <div class="scale" aria-hidden="true"><span>{{ sortCard.options[0].label }}</span><span>{{ sortCard.options[2].label }}</span></div>
            <ul class="sorter">
              <li v-for="item in sortCard.items" :key="item.name" class="sorter__row">
                <div class="sorter__top"><b>{{ item.name }}</b><span>{{ item.sub }}</span></div>
                <div class="sorter__track" aria-hidden="true"><span class="sorter__pin" :style="{ left: `${place[choice[item.name]]}%` }"></span></div>
                <div class="seg" role="radiogroup" :aria-label="item.name">
                  <button
                    v-for="o in sortCard.options"
                    :key="o.key"
                    type="button"
                    role="radio"
                    :aria-checked="choice[item.name] === o.key"
                    :class="{ 'is-on': choice[item.name] === o.key }"
                    @click="choice[item.name] = o.key"
                  >{{ o.label }}</button>
                </div>
              </li>
            </ul>
          </div>
        </article>

        <!-- 2 moves and responses -->
        <article class="card rv-rise" style="transition-delay: 120ms">
          <h3 class="card__title">{{ t.cards.moves.title }}</h3>
          <p class="card__text">{{ t.cards.moves.text }}</p>
          <ol class="widget moves">
            <li v-for="m in t.cards.moves.items" :key="m.title" class="moves__item">
              <span class="moves__badge">{{ m.badge }}</span>
              <div class="moves__body"><b>{{ m.title }}</b><span>{{ m.sub }}</span></div>
              <span class="moves__date">{{ m.date }}</span>
            </li>
          </ol>
        </article>

        <!-- 3 the scenario -->
        <article class="card rv-rise" style="transition-delay: 240ms">
          <h3 class="card__title">{{ sc.title }}</h3>
          <p class="card__text">{{ sc.text }}</p>
          <div class="widget">
            <div class="widget__head">
              <span>{{ sc.widget }}<span class="widget__meta widget__meta--block">{{ sc.meta }}</span></span>
              <button type="button" class="widget__reset" @click="reset">{{ sc.reset }}</button>
            </div>
            <label class="slider">
              <span class="slider__top"><span>{{ sc.fund }}</span><output>{{ formatMillions(fund, 0) }}</output></span>
              <input v-model.number="fund" type="range" :min="sc.fundRange.min" :max="sc.fundRange.max" :step="sc.fundRange.step" :style="{ '--v': (fund - sc.fundRange.min) / (sc.fundRange.max - sc.fundRange.min) }" />
            </label>
            <label class="slider">
              <span class="slider__top"><span>{{ sc.use }}</span><output>{{ use }}%</output></span>
              <input v-model.number="use" type="range" :min="sc.useRange.min" :max="sc.useRange.max" :step="sc.useRange.step" :style="{ '--v': (use - sc.useRange.min) / (sc.useRange.max - sc.useRange.min) }" />
            </label>
            <div class="result">
              <span class="result__label">{{ sc.result }}</span>
              <output class="result__value" aria-live="polite">{{ formatMillions(share, 1) }}</output>
            </div>
            <div class="split" aria-hidden="true">
              <span v-for="s in segments" :key="s.name" class="split__seg" :class="{ 'is-focal': s.focal }" :style="{ width: `${s.pct}%` }" :title="`${s.name} ${s.v}%`"></span>
            </div>
            <p class="widget__note">{{ sc.assumption }}</p>
          </div>
        </article>
      </div>
  </div>
</template>

<style scoped>
.qp { margin-top: clamp(56px, 7vw, 96px); padding-top: 20px; border-top: 1px solid var(--rv-line); }
.qp__head { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(32px, 6vw, 96px); align-items: end; }
.qp__title { font: 400 clamp(28px, 3.2vw, 44px)/1.1 var(--rv-serif); letter-spacing: -0.015em; }
html[lang^="zh"] .qp__title { font-weight: 500; letter-spacing: 0; }
@media (max-width: 900px) { .qp__head { grid-template-columns: minmax(0, 1fr); gap: 20px; } }
.lenses { display: flex; flex-direction: column; border-top: 1px solid var(--rv-ink); }
.lenses li { display: grid; grid-template-columns: 24px auto; column-gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--rv-line); }
.lenses__n { grid-row: span 2; font: 500 12px/1.6 var(--rv-mono); color: var(--rv-red); }
.lenses b { font-size: 15px; font-weight: 600; }
.lenses span:last-child { font: 400 12px/1.4 var(--rv-mono); color: var(--rv-muted); }

/* ---------------------------------------------------------------- matrix */
.matrix { margin-top: clamp(48px, 6vw, 80px); display: flex; flex-direction: column; gap: 14px; }
.matrix table { width: 100%; border-collapse: collapse; }
.matrix th, .matrix td { padding: 12px 10px; border-bottom: 1px solid var(--rv-line); text-align: left; font-weight: 400; }
.matrix thead th { border-bottom: 1px solid var(--rv-ink); font: 500 12px/1.3 var(--rv-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--rv-muted); text-align: center; width: 18%; }
.matrix thead th:first-child { width: auto; }
.matrix__n { display: block; color: var(--rv-red); margin-bottom: 2px; }
.matrix tbody th { display: grid; grid-template-columns: 52px minmax(120px, 0.6fr) minmax(0, 1fr); gap: 4px 12px; align-items: baseline; }
.matrix__code { font: 500 13px var(--rv-mono); color: var(--rv-red); }
.matrix__name { font: 400 22px/1.15 var(--rv-serif); }
html[lang^="zh"] .matrix__name { font-weight: 500; }
.matrix__sub { font-size: 14px; color: var(--rv-muted); }
.matrix td { text-align: center; }
.matrix__dot { display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid var(--rv-ink); vertical-align: middle; }
.matrix__dot.is-main { background: var(--rv-ink); width: 18px; height: 18px; }
.matrix tbody tr:hover { background: color-mix(in oklab, var(--rv-paper-2) 60%, transparent); }

/* ---------------------------------------------------------------- cards */
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--rv-gap); margin-top: clamp(48px, 6vw, 80px); align-items: stretch; }
.card { display: flex; flex-direction: column; gap: 12px; padding: clamp(22px, 2.4vw, 30px); background: var(--rv-paper-2); border-top: 3px solid var(--rv-ink); }
.card__title { font: 400 clamp(22px, 2vw, 28px)/1.15 var(--rv-serif); letter-spacing: -0.012em; }
html[lang^="zh"] .card__title { font-weight: 500; letter-spacing: 0; }
.card__text { font-size: 15px; line-height: 1.55; color: var(--rv-ink-2); }
.widget { margin-top: 8px; display: flex; flex-direction: column; gap: 14px; padding: 18px; background: #fbf9f4; border: 1px solid var(--rv-line); }
.widget__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; font-size: 14px; font-weight: 600; }
.widget__meta { font: 400 12px var(--rv-mono); color: var(--rv-muted); }
.widget__meta--block { display: block; margin-top: 2px; }
.widget__reset { border: 1px solid var(--rv-line-strong); background: transparent; border-radius: 999px; padding: 4px 10px; font-size: 12px; }
.widget__reset:hover { background: var(--rv-ink); color: var(--rv-paper); border-color: var(--rv-ink); }
.widget__note { font-size: 12px; line-height: 1.5; color: var(--rv-muted); }

/* sorter */
.scale { display: flex; justify-content: space-between; font: 500 11px var(--rv-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--rv-muted); }
.sorter { display: flex; flex-direction: column; gap: 16px; }
.sorter__row { display: flex; flex-direction: column; gap: 8px; }
.sorter__top { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; }
.sorter__top span { font: 400 12px var(--rv-mono); color: var(--rv-muted); text-align: right; }
.sorter__track { position: relative; height: 6px; border-radius: 3px; background: linear-gradient(90deg, var(--rv-blue), var(--rv-paper-3) 50%, var(--rv-red)); }
.sorter__pin { position: absolute; top: 50%; width: 16px; height: 16px; border-radius: 50%; background: #fbf9f4; border: 2px solid var(--rv-ink); translate: -50% -50%; transition: left 360ms cubic-bezier(.2, .7, .2, 1); }
.seg { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--rv-line-strong); border-radius: 999px; padding: 2px; }
.seg button { border: 0; background: transparent; border-radius: 999px; padding: 5px 4px; font-size: 12px; color: var(--rv-ink-2); }
.seg button.is-on { background: var(--rv-ink); color: var(--rv-paper); }

/* moves */
.moves { position: relative; gap: 0; padding: 6px 18px; }
.moves__item { position: relative; display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; gap: 12px; align-items: start; padding: 14px 0; }
.moves__item + .moves__item { border-top: 1px solid var(--rv-line); }
.moves__badge { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--rv-ink); color: var(--rv-paper); font: 600 11px/1 var(--rv-sans); }
.moves__body { display: flex; flex-direction: column; gap: 2px; font-size: 14px; }
.moves__body span { font-size: 13px; color: var(--rv-muted); }
.moves__date { font: 400 12px var(--rv-mono); color: var(--rv-muted); }

/* scenario */
.slider { display: flex; flex-direction: column; gap: 8px; }
.slider__top { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; color: var(--rv-ink-2); }
.slider__top output { font: 500 13px var(--rv-mono); color: var(--rv-ink); }
.slider input { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; margin: 6px 0;
  background: linear-gradient(90deg, var(--rv-ink) calc(var(--v) * 100%), var(--rv-paper-3) calc(var(--v) * 100%)); }
.slider input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fbf9f4; border: 2px solid var(--rv-ink); cursor: grab; }
.slider input::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #fbf9f4; border: 2px solid var(--rv-ink); cursor: grab; }
.result { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding-top: 12px; border-top: 1px solid var(--rv-line); }
.result__label { font-size: 13px; font-weight: 600; }
.result__value { font: 300 36px/1 var(--rv-serif); color: var(--rv-red); font-variant-numeric: lining-nums tabular-nums; }
.split { display: flex; gap: 2px; height: 12px; }
.split__seg { background: color-mix(in oklab, var(--rv-ink) 28%, transparent); transition: width 300ms ease; }
.split__seg:last-child { border-radius: 0 4px 4px 0; }
.split__seg.is-focal { background: var(--rv-red); }

@media (max-width: 1100px) { .cards { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 760px) {
  .matrix tbody th { grid-template-columns: 44px minmax(0, 1fr); }
  .matrix__sub { grid-column: 2; }
  .matrix thead th { font-size: 10px; letter-spacing: 0.02em; }
  .matrix th, .matrix td { padding: 10px 4px; }
}
@media (prefers-reduced-motion: reduce) { .sorter__pin, .split__seg { transition: none; } }
</style>
