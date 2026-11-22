<script setup>
import PartHead from '../shared/PartHead.vue';
import QuestionsPart from './QuestionsPart.vue';

// Business insights (§5.1.6–7): six cards, one per AQ (the full question, the views it rests on, the answer to
// come), the five PARTS recommendation slots, then the six questions' working cards and the rules slider.
defineProps({
  t: { type: Object, required: true },
  questions: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const names = (q) => Object.fromEntries(q.aqs.map((a) => [a.code, a.name]));
</script>

<template>
  <div :id="t.id" class="rv-part insights">
    <PartHead :n="n" :total="total" :label="t.label" />
    <div class="ins__head">
      <h3 class="rv-h3">{{ t.title }}</h3>
      <p class="rv-body">{{ t.text }}</p>
    </div>

    <ol class="cards">
      <li v-for="c in t.cards" :key="c.code" class="card" :class="{ 'card--wide': c.forces }">
        <header class="card__head"><span class="card__code">{{ c.code }}</span><b>{{ names(questions)[c.code] }}</b><span class="card__lens">{{ c.lens }}</span></header>
        <p class="card__q">{{ c.q }}</p>
        <div v-if="c.forces" class="card__forces">
          <p class="rv-label">{{ t.forcesLabel }}</p>
          <ol><li v-for="(f, i) in t.forces" :key="f"><span>{{ i + 1 }}</span>{{ f }}</li></ol>
        </div>
        <p class="card__rests"><span class="rv-label">{{ t.restsOn }}</span><a v-for="v in c.views" :key="v" :href="`#${v}`">{{ t.viewNames[v] }}</a></p>
        <div class="card__answer"><span class="rv-label">{{ t.answer }}</span><span>{{ t.pending }}</span></div>
      </li>
    </ol>

    <figure class="parts">
      <figcaption class="rv-label">{{ t.partsLabel }}</figcaption>
      <ol>
        <li v-for="p in t.parts" :key="p.name"><span class="parts__letter">{{ p.name.slice(0, 1) }}</span><b>{{ p.name }}</b><span>{{ p.text }}</span></li>
      </ol>
      <p class="parts__pending">{{ t.partsPending }}</p>
    </figure>

    <QuestionsPart :t="questions" />
  </div>
</template>

<style scoped>
.ins__head { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 6vw, 96px); align-items: end; }
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: clamp(36px, 4.4vw, 56px); }
.card { display: flex; flex-direction: column; gap: 12px; padding: 20px; background: var(--rv-paper-2); border-top: 3px solid var(--rv-ink); }
.card__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
.card__code { font: 500 13px var(--rv-mono); color: var(--rv-red); }
.card__head b { font: 400 22px/1.15 var(--rv-serif); }
html[lang^="zh"] .card__head b { font-weight: 500; }
.card__lens { width: 100%; font: 400 11px var(--rv-mono); color: var(--rv-muted); }
.card__q { font-size: 15px; line-height: 1.55; color: var(--rv-ink); }
.card__forces { display: flex; flex-direction: column; gap: 8px; padding: 12px; background: var(--rv-paper); }
.card__forces ol { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 12px; }
.card__forces li { display: flex; gap: 8px; font-size: 13px; color: var(--rv-ink-2); }
.card__forces li span { font: 500 11px var(--rv-mono); color: var(--rv-red); }
.card__rests { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; margin-top: auto; }
.card__rests a { padding: 3px 10px; border-radius: 999px; border: 1px solid var(--rv-line-strong); font-size: 12px; font-weight: 500; transition: background-color 150ms ease, color 150ms ease; }
.card__rests a:hover { background: var(--rv-ink); color: var(--rv-paper); }
.card__answer { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border: 1px dashed var(--rv-line-strong); font-size: 13px; color: var(--rv-muted); }

.parts { margin-top: clamp(32px, 4vw, 48px); display: flex; flex-direction: column; gap: 14px; }
.parts ol { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.parts li { display: flex; flex-direction: column; gap: 6px; padding: 16px; border: 1px dashed var(--rv-line-strong); }
.parts__letter { font: 300 44px/1 var(--rv-serif); color: var(--rv-red); }
.parts li b { font-size: 15px; font-weight: 600; }
.parts li span:last-child { font-size: 13px; color: var(--rv-ink-2); }
.parts__pending { font: 400 12px var(--rv-mono); color: var(--rv-muted); }

@media (max-width: 1100px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } .parts ol { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 900px) { .ins__head { grid-template-columns: minmax(0, 1fr); gap: 16px; } }
@media (max-width: 640px) { .cards { grid-template-columns: minmax(0, 1fr); } .parts ol { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
