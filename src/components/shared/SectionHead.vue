<script setup>
// A section's opening: the kicker line (with an optional item on its right), the title, and the words beside it.
defineProps({
  kicker: { type: String, required: true },
  track: { type: String, default: '' },
  title: { type: String, required: true },
  titleAfter: { type: String, default: '' },     // a second sentence, set quieter
  intro: { type: String, default: '' },
  headingId: { type: String, required: true },
  tag: { type: String, default: 'h2' },          // h1 for the section that opens the page
  size: { type: String, default: 'lg' },         // xl for the page's opening title
});
</script>

<template>
  <header class="head" :class="`head--${size}`">
    <div class="head__top">
      <p class="rv-kicker"><span>{{ kicker }}</span><span v-if="track">{{ track }}</span></p>
      <slot name="top" />
    </div>
    <component :is="tag" :id="headingId" class="head__title">{{ title }}<span v-if="titleAfter" class="head__after">{{ ' ' + titleAfter }}</span></component>
    <div class="head__side">
      <p v-if="intro" class="head__intro">{{ intro }}</p>
      <slot />
    </div>
  </header>
</template>

<style scoped>
.head { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); column-gap: clamp(32px, 6vw, 96px); align-items: end; }
.head__top {
  grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: baseline; gap: 16px;
  margin-bottom: clamp(48px, 7vw, 104px); padding-bottom: 14px; border-bottom: 1px solid var(--rv-line);
}
.head--xl .head__top { margin-bottom: clamp(64px, 10vw, 152px); }
.head__top .rv-kicker { margin: 0; }
.head__title {
  margin: 0; font-family: var(--rv-serif); font-weight: 400; font-optical-sizing: auto;
  font-size: clamp(40px, 5.4vw, 80px); line-height: 1; letter-spacing: -0.028em; text-wrap: balance; hyphens: manual;
}
.head--xl .head__title { font-size: clamp(44px, 6.6vw, 96px); line-height: 0.98; letter-spacing: -0.03em; }

.head__after { color: var(--rv-muted); }
html[lang^="zh"] .head__title { font-weight: 500; line-height: 1.2; letter-spacing: 0; }
.head__side { display: flex; flex-direction: column; gap: 28px; padding-bottom: 8px; }
.head__intro { margin: 0; font-size: 17px; line-height: 1.6; color: var(--rv-ink-2); }

@media (max-width: 900px) {
  .head { grid-template-columns: minmax(0, 1fr); row-gap: 28px; }
}
</style>
