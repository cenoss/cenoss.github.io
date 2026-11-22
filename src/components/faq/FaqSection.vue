<script setup>
import SectionHead from '../shared/SectionHead.vue';
import ToolMark from '../shared/ToolMark.vue';
import UiIcon from '../shared/UiIcon.vue';

// Frequently Asked Questions: the answers fold open; the email and the tools sit beside the title.
defineProps({ t: { type: Object, required: true } });
</script>

<template>
  <section :id="t.id" class="rv" aria-labelledby="faq-h">
    <div class="rv-wrap">
      <SectionHead :kicker="t.kicker" :track="t.track" :title="t.title" :intro="t.intro" heading-id="faq-h">
        <a class="mail" :href="t.email.href"><UiIcon name="mail" :size="18" />{{ t.email.label }}</a>
      </SectionHead>

      <div class="faq">
        <div class="faq__list">
          <details v-for="(item, i) in t.items" :key="item.q" class="qa" :open="i === 0">
            <summary><span class="qa__n">{{ String(i + 1).padStart(2, '0') }}</span><span class="qa__q">{{ item.q }}</span><span class="qa__sign" aria-hidden="true"></span></summary>
            <p class="qa__a">{{ item.a }}</p>
          </details>
        </div>
        <aside class="tools" :aria-label="t.toolsLabel">
          <p class="rv-label">{{ t.toolsLabel }}</p>
          <ul>
            <li v-for="tool in t.tools" :key="tool.name"><ToolMark :icon="tool.icon" :name="tool.name" :size="40" /><span><b>{{ tool.name }}</b><span>{{ tool.note }}</span></span></li>
          </ul>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rv { border-top: 1px solid var(--rv-line); }
.mail {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 10px; padding: 12px 18px; border-radius: 999px;
  background: var(--rv-ink); color: var(--rv-paper); font-size: 15px; font-weight: 500; transition: background-color 160ms ease;
}
.mail:hover { background: var(--rv-red); }
.faq { display: grid; grid-template-columns: minmax(0, 8fr) minmax(0, 3fr); gap: clamp(32px, 6vw, 96px); margin-top: clamp(48px, 6vw, 80px); align-items: start; }
.faq__list { border-top: 1px solid var(--rv-ink); }
.qa { border-bottom: 1px solid var(--rv-line); }
.qa summary { display: grid; grid-template-columns: 44px minmax(0, 1fr) 24px; gap: 12px; align-items: center; padding: 22px 0; cursor: pointer; list-style: none; }
.qa summary::-webkit-details-marker { display: none; }
.qa__n { font: 500 12px var(--rv-mono); color: var(--rv-red); }
.qa__q { font: 400 clamp(22px, 2.2vw, 30px)/1.2 var(--rv-serif); letter-spacing: -0.01em; transition: color 160ms ease; }
html[lang^="zh"] .qa__q { font-weight: 500; letter-spacing: 0; }
.qa summary:hover .qa__q { color: var(--rv-red); }
.qa__sign { position: relative; width: 16px; height: 16px; justify-self: end; }
.qa__sign::before, .qa__sign::after { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1.5px; background: currentColor; transition: rotate 200ms ease; }
.qa__sign::after { rotate: 90deg; }
.qa[open] .qa__sign::after { rotate: 0deg; }
.qa__a { padding: 0 36px 24px 56px; font-size: 16px; line-height: 1.65; color: var(--rv-ink-2); max-width: 70ch; }
.tools { display: flex; flex-direction: column; gap: 14px; }
.tools ul { display: flex; flex-direction: column; gap: 10px; }
.tools li { display: flex; align-items: center; gap: 12px; }
.tools li > span { display: flex; flex-direction: column; }
.tools b { font-size: 15px; }
.tools b + span { font: 400 12px var(--rv-mono); color: var(--rv-muted); }
@media (max-width: 900px) {
  .faq { grid-template-columns: minmax(0, 1fr); }
  .tools ul { flex-direction: row; flex-wrap: wrap; gap: 14px 24px; }
  .qa__a { padding: 0 0 22px 56px; }
}
@media (max-width: 480px) { .qa summary { grid-template-columns: 32px minmax(0, 1fr) 20px; } .qa__a { padding-left: 44px; } }
</style>
