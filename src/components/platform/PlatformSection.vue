<script setup>
import { computed } from 'vue';
import SectionHead from '../shared/SectionHead.vue';
import PlatformProfile from './PlatformProfile.vue';
import PlatformSides from './PlatformSides.vue';
import PlatformRivals from './PlatformRivals.vue';
import PlatformWhy from './PlatformWhy.vue';
import PlatformEvent from './PlatformEvent.vue';

// Chosen Firm / Platform & Strategic Rationale (proposal §2)
const props = defineProps({ t: { type: Object, required: true } });
const parts = computed(() => [props.t.profile, props.t.sides, props.t.rivals, props.t.why, props.t.event]);
const pad = (k) => String(k).padStart(2, '0');
</script>

<template>
  <section :id="t.id" class="rv" aria-labelledby="platform-h">
    <div class="rv-wrap">
      <SectionHead :kicker="t.kicker" :track="t.track" :title="t.title" :intro="t.intro" heading-id="platform-h">
        <ol class="rv-index">
          <li v-for="(p, i) in parts" :key="p.id"><a :href="`#${p.id}`"><span class="rv-index__n">{{ pad(i + 1) }}</span>{{ p.label }}</a></li>
        </ol>
      </SectionHead>
      <PlatformProfile :t="t.profile" :n="1" :total="5" />
      <PlatformSides :t="t.sides" :n="2" :total="5" />
      <PlatformRivals :t="t.rivals" :n="3" :total="5" />
      <PlatformWhy :t="t.why" :n="4" :total="5" />
      <PlatformEvent :t="t.event" :n="5" :total="5" />
    </div>
  </section>
</template>

<style scoped>
.rv { border-top: 1px solid var(--rv-line); }
</style>
