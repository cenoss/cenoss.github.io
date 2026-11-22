<script setup>
import PartHead from '../shared/PartHead.vue';
import UiIcon from '../shared/UiIcon.vue';

// Agent purpose and scope (§4.2): five verbs, the fixed codebook, the two rules and the version line.
defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <div :id="t.id" class="rv-part agent">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <ol class="verbs">
      <li v-for="(v, i) in t.verbs" :key="v.name" class="verb">
        <span class="verb__n">{{ pad(i + 1) }}</span>
        <b class="verb__name">{{ v.name }}</b>
        <p class="verb__text">{{ v.text }}</p>
      </li>
    </ol>

    <div class="below">
      <div class="codebook">
        <p class="rv-label">{{ t.codebookLabel }}</p>
        <ul><li v-for="(c, i) in t.codebook" :key="c"><span>{{ i + 1 }}</span>{{ c }}</li></ul>
      </div>
      <div class="rules">
        <p class="rv-label">{{ t.rulesLabel }}</p>
        <ul><li v-for="r in t.rules" :key="r"><UiIcon name="check" :size="18" />{{ r }}</li></ul>
        <p class="rules__version">{{ t.version }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verbs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--rv-gap); margin-top: clamp(36px, 4.4vw, 56px); }
.verb { display: flex; flex-direction: column; gap: 10px; padding-top: 14px; border-top: 2px solid var(--rv-ink); }
.verb__n { font: italic 300 32px/1 var(--rv-serif); color: var(--rv-red); }
.verb__name { font: 400 26px/1.1 var(--rv-serif); }
html[lang^="zh"] .verb__name { font-weight: 500; }
.verb__text { font-size: 14px; line-height: 1.55; color: var(--rv-ink-2); }
.below { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(32px, 6vw, 96px); margin-top: clamp(36px, 4.4vw, 56px); padding-top: 22px; border-top: 1px solid var(--rv-line); }
.codebook, .rules { display: flex; flex-direction: column; gap: 14px; }
.codebook ul { display: flex; flex-wrap: wrap; gap: 8px; }
.codebook li { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--rv-paper-2); font-size: 14px; font-weight: 500; }
.codebook li span { font: 500 11px var(--rv-mono); color: var(--rv-red); }
.rules ul { display: flex; flex-direction: column; gap: 10px; }
.rules li { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; line-height: 1.45; }
.rules li svg { flex: none; color: var(--rv-red); margin-top: 1px; }
.rules__version { font: 400 12px/1.5 var(--rv-mono); color: var(--rv-muted); padding-top: 10px; border-top: 1px dashed var(--rv-line-strong); }
@media (max-width: 1100px) { .verbs { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 32px; } }
@media (max-width: 760px) { .verbs { grid-template-columns: minmax(0, 1fr); } .below { grid-template-columns: minmax(0, 1fr); } }
</style>
