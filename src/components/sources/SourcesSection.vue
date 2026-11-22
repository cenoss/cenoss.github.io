<script setup>
import { computed } from 'vue';
import SectionHead from '../shared/SectionHead.vue';
import SourceChannels from './SourceChannels.vue';
import CollectionRun from './CollectionRun.vue';
import SeriesCoverage from './SeriesCoverage.vue';
import SourceStatus from './SourceStatus.vue';

// Data Sources (proposal §3; acquisition channels from G4_Agent_Workflow.svg, stage 1)
const props = defineProps({ t: { type: Object, required: true } });
const parts = computed(() => [props.t.channels, props.t.run, props.t.series, props.t.status]);
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <section :id="t.id" class="rv" aria-labelledby="sources-h">
    <div class="rv-wrap">
      <SectionHead :kicker="t.kicker" :track="t.track" :title="t.title" :intro="t.intro" heading-id="sources-h">
        <ol class="rv-index">
          <li v-for="(p, i) in parts" :key="p.id"><a :href="`#${p.id}`"><span class="rv-index__n">{{ pad(i + 1) }}</span>{{ p.label }}</a></li>
        </ol>
      </SectionHead>
      <SourceChannels :t="t.channels" :status-names="t.statusNames" :n="1" :total="4" />
      <CollectionRun :t="t.run" :channels="t.channels.list" :n="2" :total="4" />
      <SeriesCoverage :t="t.series" :status-names="t.statusNames" :n="3" :total="4" />
      <SourceStatus :t="t.status" :channels="t.channels.list" :status-names="t.statusNames" :n="4" :total="4" />
    </div>
  </section>
</template>

<style scoped>
.rv { border-top: 1px solid var(--rv-line); }
</style>
