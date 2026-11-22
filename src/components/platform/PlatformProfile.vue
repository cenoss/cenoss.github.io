<script setup>
import { ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import { useInView } from '../../composables/motion.js';

defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const box = ref(null);
const run = useInView(box, { threshold: 0.2 });
</script>

<template>
  <div :id="t.id" ref="box" class="rv-part profile" :class="{ 'is-in': run }">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div class="profile__grid">
      <!-- lineage: the company's dates, read down -->
      <ol class="lineage">
        <li v-for="(e, i) in t.lineage" :key="e.date" class="lineage__item rv-rise" :class="{ 'is-mark': e.mark }" :style="{ transitionDelay: `${i * 90}ms` }">
          <span class="lineage__date">{{ e.date }}</span>
          <span class="lineage__text">{{ e.text }}</span>
        </li>
      </ol>

      <!-- the group: listed parent, operating company, the platform, its siblings -->
      <figure class="group rv-rise">
        <figcaption class="rv-label">{{ t.group.label }}</figcaption>
        <div class="group__tree">
          <div class="node node--parent"><strong>{{ t.group.parent.name }}</strong><span>{{ t.group.parent.note }}</span></div>
          <div class="group__row">
            <div class="group__branch">
              <div class="node"><strong>{{ t.group.operator.name }}</strong><span>{{ t.group.operator.note }}</span></div>
              <div class="node node--focal"><strong>{{ t.group.focal.name }}</strong><span>{{ t.group.focal.note }}</span></div>
            </div>
            <ul class="group__siblings">
              <li v-for="s in t.group.siblings" :key="s.name" class="node node--sib"><strong>{{ s.name }}</strong><span>{{ s.note }}</span></li>
            </ul>
          </div>
        </div>
        <a class="rv-source" :href="t.group.href" target="_blank" rel="noopener">{{ t.group.source }}</a>
      </figure>
    </div>

    <!-- scale -->
    <div class="scale">
      <p class="rv-label">{{ t.scaleLabel }}</p>
      <ul class="scale__list">
        <li v-for="(s, i) in t.scale" :key="s.caption" class="scale__item rv-rise" :style="{ transitionDelay: `${200 + i * 80}ms` }">
          <span class="scale__value">{{ s.value }}</span>
          <span class="scale__caption">{{ s.caption }}</span>
          <a class="rv-source" :href="s.href" target="_blank" rel="noopener">{{ s.source }}</a>
        </li>
        <li class="scale__item scale__item--self rv-rise" :style="{ transitionDelay: '520ms' }">
          <span class="rv-tag rv-tag--warn">{{ t.selfLabel }}</span>
          <span v-for="s in t.self" :key="s.caption" class="scale__self"><b>{{ s.value }}</b> {{ s.caption }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.profile__grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 6vw, 96px); margin-top: clamp(36px, 4.4vw, 56px); align-items: start; }

.lineage { position: relative; border-left: 1px solid var(--rv-line-strong); margin-left: 6px; }
.lineage__item { position: relative; display: grid; gap: 4px; padding: 0 0 26px 24px; }
.lineage__item::before {
  content: ""; position: absolute; left: -6px; top: 4px; width: 11px; height: 11px; border-radius: 50%;
  background: var(--rv-paper); border: 1.5px solid var(--rv-ink);
}
.lineage__item.is-mark::before { background: var(--rv-red); border-color: var(--rv-red); }
.lineage__item:last-child { padding-bottom: 0; }
.lineage__date { font: 500 12px/1.4 var(--rv-mono); letter-spacing: 0.04em; color: var(--rv-muted); }
.is-mark .lineage__date { color: var(--rv-red); }
.lineage__text { font-family: var(--rv-serif); font-size: clamp(19px, 1.7vw, 23px); line-height: 1.3; }

.group { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.group__tree { width: 100%; padding: clamp(20px, 2.4vw, 28px); background: var(--rv-paper-2); display: flex; flex-direction: column; gap: 22px; }
.group__row { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 16px; position: relative; }
.group__branch { display: flex; flex-direction: column; gap: 22px; position: relative; }
.group__siblings { display: flex; flex-direction: column; gap: 8px; }
.node { position: relative; display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; background: var(--rv-paper); border: 1px solid var(--rv-line); }
.node strong { font-weight: 600; font-size: 16px; }
.node span { font: 400 12px/1.4 var(--rv-mono); color: var(--rv-muted); }
.node--parent { border-color: var(--rv-ink); }
.node--focal { background: var(--rv-ink); border-color: var(--rv-ink); color: var(--rv-paper); }
.node--focal strong { font: 400 24px/1.1 var(--rv-serif); }
.node--focal span { color: color-mix(in oklab, var(--rv-paper) 75%, transparent); }
.node--sib { padding: 8px 12px; }
.node--sib strong { font-size: 14px; }
/* connectors: parent down to each column, operator down to the platform */
.group__row::before { content: ""; position: absolute; left: 24px; right: 24px; top: -12px; height: 12px; border: 1px solid var(--rv-line-strong); border-bottom: 0; }
.group__branch > .node + .node::before { content: ""; position: absolute; left: 24px; top: -23px; height: 22px; width: 1px; background: var(--rv-line-strong); }

.scale { margin-top: clamp(40px, 5vw, 64px); padding-top: 20px; border-top: 1px solid var(--rv-line); }
.scale__list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(0, 1.2fr); gap: var(--rv-gap); margin-top: 18px; }
.scale__item { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.scale__value { font: 300 clamp(40px, 4.2vw, 60px)/0.95 var(--rv-serif); letter-spacing: -0.03em; font-variant-numeric: lining-nums; }
html[lang^="zh"] .scale__value { letter-spacing: -0.01em; }
.scale__caption { font-size: 15px; color: var(--rv-ink-2); }
.scale__item--self { padding: 14px 16px; border: 1px dashed var(--rv-line-strong); gap: 10px; }
.scale__self { font-size: 14px; color: var(--rv-muted); }
.scale__self b { font: 500 18px/1 var(--rv-serif); color: var(--rv-ink-2); margin-right: 4px; }

@media (max-width: 1100px) {
  .scale__list { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 32px; }
  .scale__item--self { grid-column: 1 / -1; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 10px 20px; }
}
@media (max-width: 900px) {
  .profile__grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 520px) {
  .group__row { grid-template-columns: minmax(0, 1fr); }
  .group__row::before { display: none; }
}
</style>
