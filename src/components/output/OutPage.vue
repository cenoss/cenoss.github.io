<script setup>
import { ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import UiIcon from '../shared/UiIcon.vue';
import { lang } from '../../i18n.js';

// The deployed page, top to bottom (§5.1): a miniature of the page beside its nine sections (hovering either
// lights both), what visitors can and cannot do, how it gets built, and the checks before W16.
defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const hot = ref(null);
const heights = [2.2, 3, 2.6, 3, 3.6, 2, 3, 2.4, 1.2];
</script>

<template>
  <div :id="t.id" class="rv-part page">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div class="page__grid">
      <figure class="mock" :aria-label="t.mockLabel">
        <div class="mock__bar" aria-hidden="true">
          <i></i><i></i><i></i>
          <span class="mock__url">github.io/…</span>
          <span class="mock__lang"><b :class="{ on: lang === 'zh' }">中文</b><b :class="{ on: lang === 'en' }">EN</b></span>
        </div>
        <ol class="mock__page">
          <li
            v-for="(s, i) in t.sections"
            :key="s.name"
            :class="[`b${i}`, { hot: hot === i }]"
            :style="{ flexGrow: heights[i] }"
            @mouseenter="hot = i"
            @mouseleave="hot = null"
          >
            <a :href="s.href" :aria-label="s.name"><span>{{ i + 1 }}</span></a>
          </li>
        </ol>
      </figure>

      <ol class="list">
        <li v-for="(s, i) in t.sections" :key="s.name" :class="{ hot: hot === i }" @mouseenter="hot = i" @mouseleave="hot = null">
          <a :href="s.href">
            <span class="list__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="list__body">
              <span class="list__top"><b>{{ s.name }}</b><span v-if="s.tags" class="list__tags">{{ s.tags }}</span></span>
              <span class="list__text">{{ s.text }}</span>
            </span>
          </a>
        </li>
      </ol>
    </div>

    <div class="facts">
      <div class="facts__col">
        <p class="rv-label">{{ t.canLabel }}</p>
        <ul class="can"><li v-for="c in t.can" :key="c"><UiIcon name="check" :size="16" />{{ c }}</li></ul>
        <p class="rv-label facts__gap">{{ t.cannotLabel }}</p>
        <ul class="cannot"><li v-for="c in t.cannot" :key="c"><s>{{ c }}</s></li></ul>
        <p class="facts__note">{{ t.staticNote }}</p>
      </div>
      <div class="facts__col">
        <p class="rv-label">{{ t.buildLabel }}</p>
        <ol class="build">
          <li v-for="b in t.build" :key="b.week" :class="{ live: b.week === 'W16' }"><b>{{ b.week }}</b><span>{{ b.text }}</span></li>
        </ol>
        <p class="facts__note">{{ t.buildNote }}</p>
      </div>
      <div class="facts__col">
        <p class="rv-label">{{ t.checkLabel }}</p>
        <ul class="check"><li v-for="c in t.check" :key="c"><span class="check__box" aria-hidden="true"></span>{{ c }}</li></ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page__grid { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: clamp(32px, 6vw, 96px); margin-top: clamp(36px, 4.4vw, 56px); align-items: stretch; }
.mock { display: flex; flex-direction: column; border: 1px solid var(--rv-line-strong); background: #fbf9f4; box-shadow: 0 24px 60px -32px rgba(23, 21, 15, 0.35); min-height: 520px; }
.mock__bar { display: flex; align-items: center; gap: 6px; padding: 10px 12px; border-bottom: 1px solid var(--rv-line); }
.mock__bar i { width: 8px; height: 8px; border-radius: 50%; background: var(--rv-paper-3); }
.mock__url { margin-left: 8px; font: 400 11px var(--rv-mono); color: var(--rv-muted); }
.mock__lang { margin-left: auto; display: inline-flex; border: 1px solid var(--rv-line-strong); border-radius: 999px; overflow: hidden; }
.mock__lang b { padding: 2px 8px; font: 500 10px/1.4 var(--rv-sans); color: var(--rv-muted); }
.mock__lang b.on { background: var(--rv-ink); color: var(--rv-paper); }
.mock__page { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 10px; }
.mock__page li { flex-basis: 0; min-height: 24px; position: relative; background: var(--rv-paper-2); transition: background-color 150ms ease, outline-color 150ms ease; outline: 2px solid transparent; }
.mock__page li a { position: absolute; inset: 0; display: flex; align-items: flex-start; padding: 6px 8px; }
.mock__page li span { font: 500 10px var(--rv-mono); color: var(--rv-muted); }
/* a hint of each section's shape */
.mock__page .b0 { background: linear-gradient(90deg, var(--rv-paper-2) 60%, color-mix(in oklab, var(--rv-red) 25%, var(--rv-paper-2)) 60%); }
.mock__page .b1 { background: radial-gradient(circle at 50% 55%, var(--rv-ink) 0 9px, transparent 10px), var(--rv-paper-2); }
.mock__page .b2 { background: linear-gradient(var(--rv-line-strong), var(--rv-line-strong)) 50% 0 / 1px 100% no-repeat, linear-gradient(var(--rv-line-strong), var(--rv-line-strong)) 0 50% / 100% 1px no-repeat, var(--rv-paper-2); }
.mock__page .b3 { background: repeating-linear-gradient(transparent 0 9px, var(--rv-line) 9px 10px), var(--rv-paper-2); }
.mock__page .b4 { background: linear-gradient(90deg, transparent 24%, var(--rv-paper) 24% 26%, transparent 26% 49%, var(--rv-paper) 49% 51%, transparent 51% 74%, var(--rv-paper) 74% 76%, transparent 76%), linear-gradient(var(--rv-paper) 0 0) 0 50% / 100% 2px no-repeat, color-mix(in oklab, var(--rv-blue) 14%, var(--rv-paper-2)); }
.mock__page .b7 { background: radial-gradient(circle at 50% 50%, var(--rv-paper) 0 8px, transparent 9px), var(--rv-ink); }
.mock__page .b7 span { color: var(--rv-paper-3); }
.mock__page li.hot { outline-color: var(--rv-red); }

.list { display: flex; flex-direction: column; border-top: 1px solid var(--rv-ink); }
.list li { border-bottom: 1px solid var(--rv-line); transition: background-color 150ms ease; }
.list li.hot { background: color-mix(in oklab, var(--rv-paper-2) 70%, transparent); }
.list a { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 10px; padding: 12px 6px; }
.list__n { font: 500 12px/1.6 var(--rv-mono); color: var(--rv-red); }
.list__body { display: flex; flex-direction: column; gap: 3px; }
.list__top { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }
.list__top b { font: 400 20px/1.2 var(--rv-serif); }
html[lang^="zh"] .list__top b { font-weight: 500; }
.list__tags { font: 400 11px var(--rv-mono); color: var(--rv-muted); }
.list__text { font-size: 14px; color: var(--rv-ink-2); }
.list li.hot .list__top b { color: var(--rv-red); }

.facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(24px, 4vw, 56px); margin-top: clamp(40px, 5vw, 64px); padding-top: 22px; border-top: 1px solid var(--rv-line); }
.facts__col { display: flex; flex-direction: column; gap: 12px; }
.facts__gap { margin-top: 10px; }
.facts__note { font-size: 13px; color: var(--rv-muted); }
.can li, .check li { display: flex; gap: 10px; align-items: flex-start; padding: 5px 0; font-size: 15px; }
.can svg { color: var(--rv-blue); flex: none; margin-top: 2px; }
.cannot { display: flex; flex-wrap: wrap; gap: 8px; }
.cannot li { padding: 6px 12px; border: 1px dashed var(--rv-line-strong); font-size: 14px; color: var(--rv-muted); }
.cannot s { text-decoration-color: var(--rv-red); }
.build { display: flex; flex-direction: column; border-left: 2px solid var(--rv-ink); padding-left: 16px; gap: 12px; }
.build li { position: relative; display: flex; flex-direction: column; gap: 2px; font-size: 14px; color: var(--rv-ink-2); }
.build li::before { content: ""; position: absolute; left: -22px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--rv-paper); border: 2px solid var(--rv-ink); }
.build li.live::before { background: var(--rv-red); border-color: var(--rv-red); }
.build b { font: 500 12px var(--rv-mono); color: var(--rv-ink); }
.build li.live b { color: var(--rv-red); }
.check__box { flex: none; width: 16px; height: 16px; margin-top: 2px; border: 1.5px solid var(--rv-ink-2); border-radius: 3px; }

@media (max-width: 960px) {
  .page__grid { grid-template-columns: minmax(0, 1fr); }
  .mock { min-height: 360px; max-width: 420px; }
  .facts { grid-template-columns: minmax(0, 1fr); }
}
</style>
