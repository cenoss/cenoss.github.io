<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import PartHead from '../shared/PartHead.vue';
import ToolMark from '../shared/ToolMark.vue';
import { lang } from '../../i18n.js';

// The pitch video (§5.2). Once a YouTube id is set it is embedded (unlisted, no-cookie). Until then the
// storyboard plays as a two-minute animatic: chapters, a scrubber, and subtitles in either language.
const props = defineProps({
  t: { type: Object, required: true },
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const DURATION = props.t.beats[props.t.beats.length - 1].to;
const time = ref(0);
const playing = ref(false);
const subs = ref(lang);
let raf = 0;
let last = 0;

const beat = computed(() => props.t.beats.find((b) => time.value >= b.from && time.value < b.to) ?? props.t.beats[props.t.beats.length - 1]);
const local = computed(() => time.value - beat.value.from);                 // seconds into the current beat
const line = computed(() => (subs.value === 'off' ? '' : beat.value[subs.value]));
const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function frame(now) {
  time.value = Math.min(DURATION, time.value + (now - last) / 1000);
  last = now;
  if (time.value >= DURATION) { playing.value = false; raf = 0; return; }
  raf = requestAnimationFrame(frame);
}
function play() {
  if (time.value >= DURATION) time.value = 0;
  playing.value = true; last = performance.now(); raf = requestAnimationFrame(frame);
}
function pause() { playing.value = false; cancelAnimationFrame(raf); raf = 0; }
const toggle = () => (playing.value ? pause() : play());
const seek = (s) => { time.value = Math.max(0, Math.min(DURATION - 0.01, s)); };
onBeforeUnmount(pause);

// the traffic lines for "The numbers" beat
const traffic = { direct: [[0, 63], [60, 40], [72, 56], [84, 30]], social: [[0, 27], [60, 47], [72, 61]] };
const path = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${20 + x * 2.6} ${y + 10}`).join(' ');
</script>

<template>
  <div :id="t.id" class="rv-part video">
    <PartHead :n="n" :total="total" :label="t.label" />
    <div class="video__head">
      <h3 class="rv-h3">{{ t.title }}</h3>
      <ul class="specs"><li v-for="s in t.specs" :key="s">{{ s }}</li></ul>
    </div>

    <div class="player">
      <!-- the real video, once it exists -->
      <iframe
        v-if="t.videoId"
        class="player__frame"
        :src="`https://www.youtube-nocookie.com/embed/${t.videoId}?cc_load_policy=1&hl=${lang === 'zh' ? 'zh-TW' : 'en'}`"
        :title="t.title"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>

      <!-- until then: the storyboard -->
      <template v-else>
        <div class="stage" :class="`stage--${beat.key}`" role="img" :aria-label="`${beat.name}: ${t.beats.find((b) => b.key === beat.key).screen}`">
          <span class="stage__chip">{{ clock(beat.from) }} · {{ beat.name }}</span>

          <div v-if="beat.key === 'puzzle'" class="s-numbers">
            <span v-for="(nmb, i) in t.stage.numbers" :key="nmb.l" :class="{ on: local > i * 1.6 || !playing }"><b>{{ nmb.v }}</b>{{ nmb.l }}</span>
          </div>

          <div v-else-if="beat.key === 'board'" class="s-board">
            <span class="s-board__core">ETtoday</span>
            <span v-for="(b, i) in t.stage.board" :key="b" class="s-board__p" :class="[`p${i}`, { flip: i === 4 && Math.floor(local / 1.5) % 2 === 1 }]">{{ b }}</span>
          </div>

          <div v-else-if="beat.key === 'moves'" class="s-map">
            <span class="s-map__q"></span><span class="s-map__q hot"></span><span class="s-map__q"></span><span class="s-map__q"></span>
            <span class="s-map__ping" :style="{ '--k': (local % 2) / 2 }"></span>
            <span class="s-map__amc">AMC</span>
          </div>

          <svg v-else-if="beat.key === 'numbers'" class="s-lines" viewBox="0 0 260 90" aria-hidden="true">
            <path :d="path(traffic.direct)" class="d" :style="{ '--p': Math.min(1, local / 6) }" pathLength="1" />
            <path :d="path(traffic.social)" class="s" :style="{ '--p': Math.min(1, local / 6) }" pathLength="1" />
          </svg>

          <div v-else-if="beat.key === 'verdict'" class="s-parts">
            <span v-for="(l, i) in ['P', 'A', 'R', 'T', 'S']" :key="l" :class="{ on: local > 4 + i * 2 || !playing }">{{ l }}</span>
          </div>

          <ul v-else class="s-credits"><li v-for="c in t.stage.credits" :key="c">{{ c }}</li></ul>

          <p v-if="line" class="stage__sub" :lang="subs === 'zh' ? 'zh-Hant' : 'en'">{{ line }}</p>
          <button type="button" class="stage__play" :aria-label="playing ? t.pause : t.play" @click="toggle">
            <span aria-hidden="true">{{ playing ? '❚❚' : '▶' }}</span>
          </button>
        </div>

        <div class="bar">
          <button type="button" class="bar__btn" @click="toggle">{{ playing ? t.pause : t.play }}</button>
          <div class="bar__scrub">
            <span class="bar__segs" aria-hidden="true">
              <span v-for="b in t.beats" :key="b.key" :style="{ flexGrow: b.to - b.from }" :class="{ on: b.key === beat.key }"></span>
            </span>
            <span class="bar__fill" :style="{ width: `${(time / DURATION) * 100}%` }" aria-hidden="true"></span>
            <input type="range" min="0" :max="DURATION" step="0.5" :value="time" :aria-label="t.chapters" @input="seek(+$event.target.value)" />
          </div>
          <span class="bar__time">{{ clock(time) }} / {{ clock(DURATION) }}</span>
          <span class="bar__subs" role="group" :aria-label="t.subtitles">
            <button v-for="o in ['en', 'zh', 'off']" :key="o" type="button" :class="{ on: subs === o }" :aria-pressed="subs === o" @click="subs = o">{{ o === 'en' ? 'EN' : o === 'zh' ? '中文' : t.off }}</button>
          </span>
        </div>
        <p class="player__note">{{ t.preview }}</p>
      </template>
    </div>

    <div class="below">
      <ol class="chapters" :aria-label="t.chapters">
        <li v-for="b in t.beats" :key="b.key" :class="{ on: !t.videoId && b.key === beat.key }">
          <button type="button" @click="seek(b.from)" :disabled="!!t.videoId">
            <span class="chapters__time">{{ clock(b.from) }}–{{ clock(b.to) }}</span>
            <span class="chapters__body"><b>{{ b.name }}</b><span><span class="rv-visually-hidden">{{ t.onScreen }}: </span>{{ b.screen }}</span></span>
          </button>
        </li>
      </ol>
      <div class="production">
        <p class="rv-label">{{ t.productionLabel }}</p>
        <ul><li v-for="p in t.production" :key="p.name"><ToolMark :icon="p.icon" :name="p.name" :size="34" /><span><b>{{ p.name }}</b><span>{{ p.text }}</span></span></li></ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video__head { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(32px, 6vw, 96px); align-items: end; }
.specs { display: flex; flex-wrap: wrap; gap: 8px; }
.specs li { padding: 6px 12px; border: 1px solid var(--rv-line-strong); border-radius: 999px; font: 500 12px var(--rv-mono); }

.player { margin-top: clamp(36px, 4.4vw, 56px); display: flex; flex-direction: column; gap: 10px; }
.player__frame { width: 100%; aspect-ratio: 16 / 9; border: 0; background: #000; }
.stage { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #15161a; color: #eee9de; display: grid; place-items: center; }
.stage__chip { position: absolute; left: 16px; top: 14px; font: 500 11px var(--rv-mono); letter-spacing: 0.06em; color: #a39c8f; }
.stage__sub {
  position: absolute; left: 50%; bottom: 7%; translate: -50% 0; max-width: 80%; padding: 6px 14px; background: rgba(0, 0, 0, 0.72);
  font: 500 clamp(13px, 1.6vw, 20px)/1.4 var(--rv-sans); text-align: center; color: #fff;
}
.stage__play {
  position: absolute; right: 16px; top: 12px; width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(238, 233, 222, 0.4);
  background: rgba(21, 22, 26, 0.6); color: #eee9de; font-size: 12px;
}
.stage__play:hover { background: #e5603f; border-color: #e5603f; }

.s-numbers { display: flex; gap: clamp(12px, 3vw, 40px); flex-wrap: wrap; justify-content: center; padding: 0 6%; }
.s-numbers span { display: flex; flex-direction: column; align-items: center; gap: 6px; font: 400 12px var(--rv-mono); color: #a39c8f; opacity: 0; translate: 0 10px; transition: opacity 500ms ease, translate 500ms ease; }
.s-numbers span.on { opacity: 1; translate: 0 0; }
.s-numbers b { font: 300 clamp(28px, 5vw, 64px)/1 var(--rv-serif); color: #eee9de; }
.s-board { position: relative; width: min(70%, 520px); aspect-ratio: 2 / 1; }
.s-board__core { position: absolute; left: 50%; top: 50%; translate: -50% -50%; padding: 14px 18px; border-radius: 50%; background: #eee9de; color: #15161a; font: 400 clamp(14px, 2vw, 22px) var(--rv-serif); }
.s-board__p { position: absolute; translate: -50% -50%; padding: 6px 12px; border: 1px solid rgba(238, 233, 222, 0.4); font-size: clamp(11px, 1.3vw, 15px); transition: background-color 300ms ease, border-color 300ms ease; }
.p0 { left: 30%; top: 4%; } .p1 { left: 70%; top: 4%; } .p2 { left: 50%; top: 96%; } .p3 { left: 6%; top: 50%; } .p4 { left: 94%; top: 50%; border-color: #7d9fe0 !important; } .p5 { left: 92%; top: 96%; border-style: dashed; }
.s-board__p.flip { background: #e5603f; border-color: #e5603f !important; }
.s-map { position: relative; display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; width: min(50%, 360px); aspect-ratio: 4 / 3; border-left: 2px solid #eee9de; border-bottom: 2px solid #eee9de; padding: 0 0 4px 4px; }
.s-map__q { background: #24262d; }
.s-map__q.hot { background: #4a2a22; }
.s-map__ping { position: absolute; right: 24%; top: 26%; width: 14px; height: 14px; border-radius: 50%; background: #e5603f; box-shadow: 0 0 0 calc(var(--k) * 24px) rgba(229, 96, 63, calc(0.5 - var(--k) * 0.5)); }
.s-map__amc { position: absolute; right: -54px; top: 0; font: 500 12px var(--rv-mono); color: #f0a65a; }
.s-lines { width: min(70%, 560px); }
.s-lines path { fill: none; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: calc(1 - var(--p)); }
.s-lines .d { stroke: #7d9fe0; } .s-lines .s { stroke: #e5603f; }
.s-parts { display: flex; gap: clamp(8px, 2vw, 20px); }
.s-parts span { display: grid; place-items: center; width: clamp(44px, 8vw, 96px); aspect-ratio: 1; border: 1px solid rgba(238, 233, 222, 0.3); font: 300 clamp(24px, 4vw, 52px)/1 var(--rv-serif); opacity: 0.2; transition: opacity 400ms ease, background-color 400ms ease; }
.s-parts span.on { opacity: 1; background: #e5603f; border-color: #e5603f; }
.s-credits { display: flex; flex-direction: column; gap: 10px; text-align: center; font-size: clamp(12px, 1.5vw, 17px); color: #cfc9bd; }
.s-credits li:first-child { font: 400 clamp(18px, 2.4vw, 30px) var(--rv-serif); color: #eee9de; }

.bar { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; gap: 14px; align-items: center; }
.bar__btn { padding: 7px 14px; border-radius: 999px; border: 0; background: var(--rv-ink); color: var(--rv-paper); font-size: 13px; font-weight: 500; min-width: 72px; }
.bar__scrub { position: relative; height: 18px; }
.bar__segs { position: absolute; inset: 6px 0; display: flex; gap: 3px; }
.bar__segs span { flex-basis: 0; background: var(--rv-paper-3); transition: background-color 150ms ease; }
.bar__segs span.on { background: color-mix(in oklab, var(--rv-red) 35%, var(--rv-paper-3)); }
.bar__fill { position: absolute; left: 0; top: 6px; height: 6px; background: var(--rv-red); pointer-events: none; }
.bar__scrub input { position: absolute; inset: 0; width: 100%; opacity: 0; cursor: pointer; }
.bar__time { font: 500 12px var(--rv-mono); font-variant-numeric: tabular-nums; }
.bar__subs { display: inline-flex; border: 1px solid var(--rv-line-strong); border-radius: 999px; overflow: hidden; }
.bar__subs button { border: 0; background: transparent; padding: 5px 10px; font-size: 12px; }
.bar__subs button.on { background: var(--rv-ink); color: var(--rv-paper); }
.player__note { font: 400 12px var(--rv-mono); color: var(--rv-muted); }

.below { display: grid; grid-template-columns: minmax(0, 8fr) minmax(0, 4fr); gap: clamp(32px, 6vw, 96px); margin-top: clamp(28px, 3.4vw, 40px); }
.chapters { display: flex; flex-direction: column; border-top: 1px solid var(--rv-ink); }
.chapters li { border-bottom: 1px solid var(--rv-line); }
.chapters button { width: 100%; display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 12px; padding: 12px 6px; border: 0; background: transparent; text-align: left; transition: background-color 150ms ease; }
.chapters button:hover:not(:disabled) { background: color-mix(in oklab, var(--rv-paper-2) 70%, transparent); }
.chapters li.on button { background: color-mix(in oklab, var(--rv-red) 10%, var(--rv-paper)); }
.chapters__time { font: 500 12px/1.6 var(--rv-mono); color: var(--rv-red); }
.chapters__body { display: flex; flex-direction: column; gap: 2px; }
.chapters__body b { font: 400 19px/1.2 var(--rv-serif); }
html[lang^="zh"] .chapters__body b { font-weight: 500; }
.chapters__body > span { font-size: 13px; color: var(--rv-ink-2); }
.production { display: flex; flex-direction: column; gap: 14px; }
.production ul { display: flex; flex-direction: column; gap: 12px; }
.production li { display: flex; gap: 12px; align-items: center; }
.production li > span { display: flex; flex-direction: column; }
.production b { font-size: 15px; }
.production b + span { font-size: 13px; color: var(--rv-ink-2); }

@media (max-width: 900px) {
  .video__head, .below { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .bar { grid-template-columns: auto minmax(0, 1fr) auto; }
  .bar__subs { grid-column: 1 / -1; justify-self: start; }
}
/* a phone: the storyboard (not the final video) takes a 4:3 frame so each beat fits, numbers on one line */
@media (max-width: 600px) {
  .stage { aspect-ratio: 4 / 3; }
  .s-numbers { gap: 10px; flex-wrap: nowrap; padding: 0 3%; }
  .s-numbers span { font-size: 8px; gap: 4px; text-align: center; }
  .s-numbers b { font-size: clamp(16px, 5.4vw, 24px); }
  .stage__sub { bottom: 5%; max-width: 92%; font-size: 12px; padding: 5px 10px; }
  .s-board { width: 80%; }
  .s-map__amc { right: -40px; }
}
@media (prefers-reduced-motion: reduce) {
  .s-numbers span, .s-parts span, .s-board__p { transition: none; }
}
</style>
