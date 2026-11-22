<script setup>
import { computed } from 'vue';
import SectionHead from '../shared/SectionHead.vue';
import OutPage from './OutPage.vue';
import OutMaps from './OutMaps.vue';
import OutDash from './OutDash.vue';
import OutInsights from './OutInsights.vue';
import OutVideo from './OutVideo.vue';

// Expected Deployed Output (proposal §5): the deployed app's interactive features, previewed with the data
// already in hand. The action log (site.js) and the six questions (questions.js) are parts of it.
const props = defineProps({
  t: { type: Object, required: true },
  site: { type: Object, required: true },
  questions: { type: Object, required: true },
});
const parts = computed(() => [props.t.page, props.t.maps, props.t.dash, props.t.insights, props.t.video]);
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <section :id="t.id" class="rv" aria-labelledby="output-h">
    <div class="rv-wrap">
      <SectionHead :kicker="t.kicker" :track="t.track" :title="t.title" :intro="t.intro" heading-id="output-h">
        <ol class="rv-index">
          <li v-for="(p, i) in parts" :key="p.id"><a :href="`#${p.id}`"><span class="rv-index__n">{{ pad(i + 1) }}</span>{{ p.label }}</a></li>
        </ol>
      </SectionHead>
      <OutPage :t="t.page" :n="1" :total="5" />
      <OutMaps :t="t.maps" :rows="site.rows" :n="2" :total="5" />
      <OutDash :t="t.dash" :site="site" :status-names="t.statusNames" :n="3" :total="5" />
      <OutInsights :t="t.insights" :questions="questions" :n="4" :total="5" />
      <OutVideo :t="t.video" :n="5" :total="5" />
    </div>
  </section>
</template>
