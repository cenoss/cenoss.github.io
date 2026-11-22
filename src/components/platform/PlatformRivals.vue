<script setup>
import PartHead from '../shared/PartHead.vue';
import BarChart from '../shared/BarChart.vue';

defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
</script>

<template>
  <div :id="t.id" class="rv-part rivals">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div class="rivals__grid">
      <figure class="rivals__group">
        <figcaption class="rivals__cap"><span class="rv-label">{{ t.brands.label }}</span><span class="rivals__unit">{{ t.brands.unit }}</span></figcaption>
        <BarChart :rows="t.brands.rows" :unit="t.brands.unit" />
        <p class="rivals__also">{{ t.brands.also }}</p>
      </figure>
      <div class="rivals__vs" aria-hidden="true"></div>
      <figure class="rivals__group">
        <figcaption class="rivals__cap"><span class="rv-label">{{ t.platforms.label }}</span><span class="rivals__unit">{{ t.platforms.unit }}</span></figcaption>
        <BarChart :rows="t.platforms.rows" :unit="t.platforms.unit" :tag="t.both" />
        <p class="rivals__also">{{ t.platforms.also }}</p>
      </figure>
    </div>
    <a class="rv-source" :href="t.href" target="_blank" rel="noopener">{{ t.source }}</a>
  </div>
</template>

<style scoped>
.rivals__grid { display: grid; grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr); gap: clamp(28px, 4vw, 56px); margin: clamp(36px, 4.4vw, 56px) 0 24px; }
.rivals__vs { background: var(--rv-line); }
.rivals__group { display: flex; flex-direction: column; gap: 20px; }
.rivals__cap { display: flex; flex-direction: column; gap: 4px; min-height: 3.2em; }
.rivals__unit { font-size: 14px; color: var(--rv-muted); }
.rivals__also { font-size: 14px; color: var(--rv-muted); max-width: 46ch; }
.rivals__group :deep(.bars) { --name: 168px; }
@media (max-width: 860px) {
  .rivals__grid { grid-template-columns: minmax(0, 1fr); }
  .rivals__vs { height: 1px; }
}
@media (max-width: 480px) { .rivals__group :deep(.bars) { --name: 112px; } }
</style>
