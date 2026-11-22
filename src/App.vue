<script setup>
import BackgroundSection from './components/background/BackgroundSection.vue';
import PlatformSection from './components/platform/PlatformSection.vue';
import OutputSection from './components/output/OutputSection.vue';
import ArchitectureSection from './components/architecture/ArchitectureSection.vue';
import SourcesSection from './components/sources/SourcesSection.vue';
import FaqSection from './components/faq/FaqSection.vue';
import ClosingSection from './components/closing/ClosingSection.vue';
import { content } from './content/index.js';
import { lang } from './i18n.js';

const c = Object.fromEntries(Object.entries(content).map(([k, v]) => [k, v[lang]]));
</script>

<template>
  <main id="top">
    <BackgroundSection :t="c.background" />
    <PlatformSection :t="c.platform" />
    <SourcesSection :t="c.sources" />
    <ArchitectureSection :t="c.architecture" />
    <OutputSection :t="c.output" :site="c.site" :questions="c.questions" />
    <FaqSection :t="c.faq" />
  </main>
  <ClosingSection :t="c.closing" />
</template>
