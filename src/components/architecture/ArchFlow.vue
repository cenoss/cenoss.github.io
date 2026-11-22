<script setup>
import { ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import UiIcon from '../shared/UiIcon.vue';
import ToolMark from '../shared/ToolMark.vue';
import ClawdMachine from './ClawdMachine.vue';

// The data flow: Clawd at the controls of the machine, and the seven steps lighting as a document passes.
defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const step = ref(0);
const ui = ['globe', 'check'];
</script>

<template>
  <div :id="t.id" class="rv-part flow">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }} <span class="flow__after">{{ t.titleAfter }}</span></h3>

    <figure class="screen">
      <div class="screen__bezel">
        <ClawdMachine :label="t.sceneLabel" :pause-label="t.pause" :play-label="t.play" @step="step = $event" />
      </div>
      <figcaption class="screen__cap">{{ t.sceneCaption }}</figcaption>
    </figure>

    <ol class="steps">
      <li v-for="s in t.steps" :key="s.n" class="step" :class="{ 'is-on': step === s.n, 'is-past': step > s.n }">
        <span class="step__top">
          <span class="step__n">{{ s.n }}</span>
          <UiIcon v-if="ui.includes(s.icon)" :name="s.icon" :size="22" />
          <ToolMark v-else :icon="s.icon" :name="s.name" :size="28" />
        </span>
        <b class="step__name">{{ s.name }}</b>
        <span class="step__sub">{{ s.sub }}</span>
        <p v-if="s.text" class="step__text">{{ s.text }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.flow__after { color: var(--rv-muted); }
.screen { margin-top: clamp(36px, 4.4vw, 56px); display: flex; flex-direction: column; gap: 12px; }
/* an arcade-cabinet bezel: thick, pixel-stepped corners */
.screen__bezel {
  position: relative; padding: clamp(10px, 1.6vw, 20px); background: #0e0f12;
  border: 4px solid #2c2e36; box-shadow: 0 0 0 4px #0e0f12, 0 0 0 8px #2c2e36, 0 30px 60px -30px rgba(0, 0, 0, 0.8);
  clip-path: polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px));
}
.screen__cap { font: 400 12px/1.5 var(--rv-mono); color: var(--rv-muted); text-align: center; }

.steps { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 10px; margin-top: clamp(28px, 3.4vw, 40px); counter-reset: s; }
.step {
  position: relative; display: flex; flex-direction: column; gap: 6px; padding: 14px; background: var(--rv-paper-2);
  border-top: 3px solid var(--rv-line-strong); transition: border-color 250ms ease, background-color 250ms ease, transform 250ms ease;
}
.step:not(:last-child)::after {
  content: ""; position: absolute; top: 26px; right: -10px; width: 10px; height: 2px; background: var(--rv-line-strong);
}
.step.is-past { border-top-color: color-mix(in oklab, var(--rv-red) 45%, transparent); }
.step.is-on { border-top-color: var(--rv-red); background: color-mix(in oklab, var(--rv-red) 14%, var(--rv-paper-2)); transform: translateY(-4px); }
.step__top { display: flex; align-items: center; justify-content: space-between; }
.step__top svg { color: var(--rv-ink-2); }
.step__n { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--rv-line-strong); font: 500 11px/1 var(--rv-mono); }
.step.is-on .step__n { background: var(--rv-red); border-color: var(--rv-red); color: #fff; }
.step__name { font: 400 18px/1.15 var(--rv-serif); }
html[lang^="zh"] .step__name { font-weight: 500; }
.step__sub { font: 400 11px/1.4 var(--rv-mono); color: var(--rv-muted); }
.step__text { font-size: 13px; line-height: 1.5; color: var(--rv-ink-2); }

@media (max-width: 1100px) { .steps { grid-template-columns: repeat(4, minmax(0, 1fr)); } .step::after { display: none; } }
@media (max-width: 640px) { .steps { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (prefers-reduced-motion: reduce) { .step { transition: none; } .step.is-on { transform: none; } }
</style>
