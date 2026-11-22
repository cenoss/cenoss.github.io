<script setup>
import { computed, ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import UiIcon from '../shared/UiIcon.vue';
import StatusMark from '../shared/StatusMark.vue';
import { useInView } from '../../composables/motion.js';

// The four acquisition channels (G4_Agent_Workflow.svg, stage 1), split into secondary (read) and primary
// (collected and coded by the group); then the indicative cross-checks.
const props = defineProps({
  t: { type: Object, required: true },
  statusNames: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const sides = computed(() => ['secondary', 'primary'].map((key) => ({ key, ...props.t.sides[key], channels: props.t.list.filter((c) => c.side === key) })));
const box = ref(null);
const run = useInView(box, { threshold: 0.1 });
</script>

<template>
  <div :id="t.id" class="rv-part channels">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div ref="box" class="sides" :class="{ 'is-in': run }">
      <div v-for="(side, si) in sides" :key="side.key" class="side" :class="`side--${side.key}`">
        <header class="side__head">
          <span class="side__name">{{ side.name }}</span>
          <p class="side__text">{{ side.text }}</p>
        </header>

        <article v-for="(c, ci) in side.channels" :key="c.key" class="ch rv-rise" :style="{ transitionDelay: `${(si * 2 + ci) * 110}ms` }">
          <div class="ch__head">
            <span class="ch__icon"><UiIcon :name="c.icon" :size="20" /></span>
            <h4 class="ch__name">{{ c.name }}</h4>
            <StatusMark v-if="c.status" :status="c.status" :label="statusNames[c.status]" />
          </div>
          <p class="ch__line">{{ c.line }}</p>
          <p class="ch__how"><span class="rv-label">{{ t.how }}</span><span class="ch__method">{{ c.method }}</span></p>
          <ul class="ch__items">
            <li v-for="it in c.items" :key="it.name" class="item">
              <div class="item__main">
                <a v-if="it.href" class="item__name" :href="it.href" target="_blank" rel="noopener">{{ it.name }}</a>
                <b v-else class="item__name">{{ it.name }}</b>
                <span class="item__what">{{ it.what }}</span>
              </div>
              <div class="item__meta">
                <StatusMark v-if="it.status" :status="it.status" :label="statusNames[it.status]" />
                <span v-if="it.used" class="item__used"><span class="rv-visually-hidden">{{ t.usedFor }}: </span>{{ it.used }}</span>
              </div>
            </li>
          </ul>
        </article>
      </div>
    </div>

    <aside class="ind">
      <div class="ind__head"><span class="rv-label">{{ t.indicative.label }}</span><span class="ind__text">{{ t.indicative.text }}</span></div>
      <ul class="ind__list">
        <li v-for="it in t.indicative.items" :key="it.name">
          <a v-if="it.href" :href="it.href" target="_blank" rel="noopener"><b>{{ it.name }}</b></a>
          <b v-else>{{ it.name }}</b>
          <span>{{ it.what }}</span>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.sides { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--rv-gap); margin-top: clamp(36px, 4.4vw, 56px); }
.side { display: flex; flex-direction: column; gap: var(--rv-gap); }
.side__head { display: flex; flex-direction: column; gap: 6px; padding: 16px 0 6px; border-top: 4px solid var(--rv-ink); }
.side--primary .side__head { border-top-color: var(--rv-blue); }
.side__name { font: 400 clamp(26px, 2.6vw, 36px)/1 var(--rv-serif); letter-spacing: -0.015em; }
html[lang^="zh"] .side__name { font-weight: 500; letter-spacing: 0; }
.side--primary .side__name { color: var(--rv-blue); }
.side__text { font-size: 15px; color: var(--rv-ink-2); max-width: 46ch; }

.ch { display: flex; flex-direction: column; gap: 12px; padding: clamp(20px, 2.4vw, 28px); background: var(--rv-paper-2); }
.ch__head { display: flex; align-items: center; gap: 12px; }
.ch__icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: var(--rv-paper); color: var(--rv-ink-2); flex: none; }
.ch__name { font: 400 clamp(22px, 2vw, 27px)/1.15 var(--rv-serif); letter-spacing: -0.01em; margin-right: auto; }
html[lang^="zh"] .ch__name { font-weight: 500; letter-spacing: 0; }
.ch__line { font-size: 14px; color: var(--rv-muted); }
.ch__how { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; padding: 10px 12px; background: var(--rv-paper); }
.ch__method { font: 500 13px/1.3 var(--rv-mono); color: var(--rv-ink); }
.ch__items { display: flex; flex-direction: column; }
.item { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 16px; padding: 12px 0; border-top: 1px solid var(--rv-line); }
.item__main { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.item__name { font-size: 15px; font-weight: 600; }
a.item__name { text-decoration: underline; text-decoration-color: var(--rv-line-strong); text-underline-offset: 3px; }
a.item__name:hover { color: var(--rv-red); text-decoration-color: currentColor; }
.item__what { font-size: 14px; line-height: 1.5; color: var(--rv-ink-2); }
.item__meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; padding-top: 2px; }
.item__used { font: 400 11px/1.3 var(--rv-mono); color: var(--rv-muted); text-align: right; max-width: 14ch; }

.ind { margin-top: var(--rv-gap); display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 9fr); gap: 20px clamp(24px, 4vw, 56px); padding: 20px 24px; border: 1px dashed var(--rv-line-strong); }
.ind__head { display: flex; flex-direction: column; gap: 6px; }
.ind__text { font-size: 14px; color: var(--rv-muted); }
.ind__list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px 24px; }
.ind__list li { display: flex; flex-direction: column; gap: 4px; font-size: 14px; color: var(--rv-ink-2); }
.ind__list b { font-weight: 600; color: var(--rv-ink); }
.ind__list a b { text-decoration: underline; text-decoration-color: var(--rv-line-strong); text-underline-offset: 3px; }

@media (max-width: 960px) {
  .sides { grid-template-columns: minmax(0, 1fr); }
  .ind { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 640px) {
  .ind__list { grid-template-columns: minmax(0, 1fr); }
  .item { grid-template-columns: minmax(0, 1fr); }
  .item__meta { flex-direction: row; align-items: center; gap: 12px; }
  .item__used { text-align: left; max-width: none; }
}
</style>
