<script setup>
import { computed } from 'vue';
import SectionHead from '../shared/SectionHead.vue';
import FocalProblem from './FocalProblem.vue';
import ResearchScope from './ResearchScope.vue';
import ProjectObjectives from './ProjectObjectives.vue';
import { otherLang } from '../../i18n.js';

// Background (Project Track & Topic Statement): 01 focal problem, 02 research scope, 03 project objectives.
// The page opens with it, so its title is the page's h1.
const props = defineProps({ t: { type: Object, required: true } });
const parts = computed(() => [props.t.problem, props.t.scope, props.t.objectives]);
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <section :id="t.id" class="rv rv-bg" aria-labelledby="background-h">
    <div class="rv-wrap">
      <SectionHead :kicker="t.kicker" :track="t.track" :title="t.title" :intro="t.intro" heading-id="background-h" tag="h1" size="xl">
        <template #top>
          <a class="lang" :href="otherLang.href" :hreflang="otherLang.hreflang" :lang="otherLang.hreflang">{{ otherLang.label }}</a>
        </template>
        <ol class="rv-index">
          <li v-for="(p, i) in parts" :key="p.id">
            <a :href="`#${p.id}`"><span class="rv-index__n">{{ pad(i + 1) }}</span>{{ p.label }}</a>
          </li>
        </ol>
      </SectionHead>

      <FocalProblem :t="t.problem" :n="1" :total="3" />
      <ResearchScope :t="t.scope" :n="2" :total="3" />
      <ProjectObjectives :t="t.objectives" :n="3" :total="3" />
    </div>
  </section>
</template>

<style scoped>
.rv-bg { padding-top: clamp(32px, 4vw, 56px); }
.lang {
  flex: none; font: 500 13px/1 var(--rv-sans); padding: 8px 14px; border: 1px solid var(--rv-line-strong); border-radius: 999px;
  transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease;
}
.lang:hover { background: var(--rv-ink); border-color: var(--rv-ink); color: var(--rv-paper); }
</style>
