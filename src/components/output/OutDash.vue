<script setup>
import PartHead from '../shared/PartHead.vue';
import ActionLog from './ActionLog.vue';
import DashTile from './DashTile.vue';

// Timeline and dashboard (§5.1.4–5): the action log as it will work, then the eight-chart dashboard.
defineProps({
  t: { type: Object, required: true },
  site: { type: Object, required: true },
  statusNames: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
</script>

<template>
  <div :id="t.id" class="rv-part dash">
    <PartHead :n="n" :total="total" :label="t.label" />
    <ActionLog :t="site" />

    <div class="dash__head">
      <h3 class="rv-h3">{{ t.title }}</h3>
      <p class="rv-body">{{ t.text }}</p>
    </div>
    <div class="tiles">
      <DashTile v-for="tile in t.tiles" :key="tile.key" :tile="tile" :status-names="statusNames" :in-hand="t.inHand" :awaiting="t.awaiting" />
    </div>
  </div>
</template>

<style scoped>
.dash__head { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 6vw, 96px); align-items: end; margin-top: clamp(56px, 7vw, 96px); padding-top: 20px; border-top: 1px solid var(--rv-line); }
.dash__head .rv-h3 { margin-top: 0; }
.tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: clamp(28px, 3.4vw, 40px); }
@media (max-width: 1100px) { .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 900px) { .dash__head { grid-template-columns: minmax(0, 1fr); gap: 16px; } }
@media (max-width: 520px) { .tiles { grid-template-columns: minmax(0, 1fr); } }
</style>
