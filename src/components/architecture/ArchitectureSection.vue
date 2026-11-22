<script setup>
import { computed } from 'vue';
import SectionHead from '../shared/SectionHead.vue';
import ArchFlow from './ArchFlow.vue';
import ArchAgent from './ArchAgent.vue';
import ArchTools from './ArchTools.vue';
import ArchDeploy from './ArchDeploy.vue';

// Tech Architecture: Data-to-Web Specifications & Agent Design (proposal §4). The page's dark band.
const props = defineProps({ t: { type: Object, required: true } });
const parts = computed(() => [props.t.flow, props.t.agent, props.t.tools, props.t.deploy]);
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <section :id="t.id" class="rv rv--night" aria-labelledby="architecture-h">
    <div class="rv-wrap">
      <SectionHead :kicker="t.kicker" :track="t.track" :title="t.title" :intro="t.intro" heading-id="architecture-h">
        <ol class="rv-index">
          <li v-for="(p, i) in parts" :key="p.id"><a :href="`#${p.id}`"><span class="rv-index__n">{{ pad(i + 1) }}</span>{{ p.label }}</a></li>
        </ol>
      </SectionHead>
      <ArchFlow :t="t.flow" :n="1" :total="4" />
      <ArchAgent :t="t.agent" :n="2" :total="4" />
      <ArchTools :t="t.tools" :n="3" :total="4" />
      <ArchDeploy :t="t.deploy" :steps="t.flow.steps" :n="4" :total="4" />
    </div>
  </section>
</template>
