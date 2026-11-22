<script setup>
import PartHead from '../shared/PartHead.vue';
import ToolMark from '../shared/ToolMark.vue';
import UiIcon from '../shared/UiIcon.vue';

// AI tools and environment (§4.1): six layers, each tool by its real mark; what a visit touches.
defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <div :id="t.id" class="rv-part tools">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div class="table" role="table" :aria-label="t.label">
      <div class="row row--head" role="row">
        <span role="columnheader"></span><span role="columnheader">{{ t.columns[0] }}</span><span role="columnheader">{{ t.columns[1] }}</span><span role="columnheader">{{ t.columns[2] }}</span>
      </div>
      <div v-for="(l, i) in t.layers" :key="l.key" class="row" role="row">
        <span class="row__n" role="cell">{{ pad(i + 1) }}</span>
        <span class="row__layer" role="cell"><b>{{ l.name }}</b><span v-if="l.note">{{ l.note }}</span></span>
        <ul class="row__tools" role="cell">
          <li v-for="tool in l.tools" :key="tool.name"><ToolMark :icon="tool.icon" :name="tool.name" :size="34" />{{ tool.name }}</li>
        </ul>
        <span class="row__role" role="cell">{{ l.role }}</span>
      </div>
    </div>
    <p class="privacy"><UiIcon name="check" :size="18" />{{ t.privacy }}</p>

    <figure class="visit">
      <figcaption class="rv-label">{{ t.visit.label }}</figcaption>
      <div class="visit__path">
        <div class="visit__node"><UiIcon name="browser" :size="24" /><b>{{ t.visit.browser }}</b></div>
        <span class="visit__wire" aria-hidden="true"></span>
        <div class="visit__node is-host"><ToolMark icon="githubpages" name="GitHub Pages" :size="32" /><b>{{ t.visit.host }}</b><span>{{ t.visit.files }}</span></div>
        <span class="visit__wire is-cut" aria-hidden="true"></span>
        <div class="visit__none">
          <span v-for="(x, i) in t.visit.none" :key="x" class="visit__off"><UiIcon :name="i === 0 ? 'server' : 'database'" :size="20" /><s>{{ x }}</s></span>
        </div>
      </div>
    </figure>
  </div>
</template>

<style scoped>
.table { margin-top: clamp(36px, 4.4vw, 56px); display: flex; flex-direction: column; }
.row { display: grid; grid-template-columns: 44px minmax(150px, 2fr) minmax(0, 5fr) minmax(0, 3fr); gap: 20px; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--rv-line); }
.row--head { padding: 0 0 10px; border-bottom: 1px solid var(--rv-ink); font: 500 11px/1.3 var(--rv-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rv-muted); }
.row__n { font: italic 300 26px/1 var(--rv-serif); color: var(--rv-red); }
.row__layer { display: flex; flex-direction: column; gap: 3px; }
.row__layer b { font: 400 22px/1.15 var(--rv-serif); }
html[lang^="zh"] .row__layer b { font-weight: 500; }
.row__layer span { font: 400 11px/1.4 var(--rv-mono); color: var(--rv-muted); }
.row__tools { display: flex; flex-wrap: wrap; gap: 10px 20px; }
.row__tools li { display: inline-flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500; }
.row__role { font-size: 14px; color: var(--rv-ink-2); }
.privacy { display: flex; gap: 10px; align-items: center; margin-top: 18px; font-size: 15px; color: var(--rv-ink-2); }
.privacy svg { color: var(--rv-red); flex: none; }

.visit { margin-top: clamp(36px, 4.4vw, 56px); display: flex; flex-direction: column; gap: 16px; }
.visit__path { display: flex; align-items: center; flex-wrap: wrap; row-gap: 16px; }
.visit__node { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: 1px solid var(--rv-line-strong); background: var(--rv-paper-2); }
.visit__node svg { color: var(--rv-ink-2); }
.visit__node b { font-size: 15px; }
.visit__node span { font: 400 12px var(--rv-mono); color: var(--rv-muted); }
.visit__node.is-host { border-color: var(--rv-ink); }
.visit__wire { position: relative; width: 56px; height: 2px; background: var(--rv-ink); }
.visit__wire::after { content: ""; position: absolute; right: -2px; top: -4px; border-left: 7px solid var(--rv-ink); border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
.visit__wire.is-cut { background: repeating-linear-gradient(90deg, var(--rv-line-strong) 0 4px, transparent 4px 8px); }
.visit__wire.is-cut::after { content: "×"; border: 0; top: -11px; right: 22px; font: 500 16px/1 var(--rv-sans); color: var(--rv-red); }
.visit__none { display: flex; gap: 10px; flex-wrap: wrap; }
.visit__off { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border: 1px dashed var(--rv-line-strong); color: var(--rv-muted); font-size: 14px; }
.visit__off s { text-decoration-color: var(--rv-red); text-decoration-thickness: 1.5px; }

@media (max-width: 1000px) {
  .row { grid-template-columns: 36px minmax(0, 1fr); }
  .row--head { display: none; }
  .row__tools, .row__role { grid-column: 2; }
}
@media (max-width: 700px) {
  .visit__path { flex-direction: column; align-items: flex-start; }
  .visit__wire { width: 2px; height: 28px; margin-left: 30px; }
  .visit__wire::after { right: -4px; top: auto; bottom: -2px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid var(--rv-ink); border-bottom: 0; }
  .visit__wire.is-cut { background: repeating-linear-gradient(180deg, var(--rv-line-strong) 0 4px, transparent 4px 8px); }
  .visit__wire.is-cut::after { right: -14px; top: 6px; bottom: auto; border: 0; }
}
</style>
