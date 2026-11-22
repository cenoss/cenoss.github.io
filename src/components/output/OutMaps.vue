<script setup>
import { computed, ref } from 'vue';
import PartHead from '../shared/PartHead.vue';

// The maps (§5.1.2–3): the Value Net game board (click a player for its panel, the platforms flip between
// complementor and competitor), and the competitor map, which places no rival until it is scored.
const props = defineProps({
  t: { type: Object, required: true },
  rows: { type: Array, required: true },         // the action log's rows, for the evidence in each panel
  n: { type: Number, required: true },
  total: { type: Number, required: true },
});
const picked = ref('platforms');
const player = computed(() => props.t.players.find((p) => p.key === picked.value));
const evidence = computed(() => player.value.rows.map((id) => props.rows.find((r) => r.id === id)).filter(Boolean));
// where each player sits on the board (grid areas around ETtoday)
const area = { readers: 'c1', advertisers: 'c2', rivals: 'l', platforms: 'r', partners: 's', regulators: 'x' };
const hotQ = ref(null);
</script>

<template>
  <div :id="t.id" class="rv-part maps">
    <PartHead :n="n" :total="total" :label="t.label" />
    <h3 class="rv-h3">{{ t.title }}</h3>

    <div class="board">
      <figure class="net">
        <figcaption class="net__cap"><span class="rv-label">{{ t.boardLabel }}</span><span class="net__hint">{{ t.boardHint }}</span></figcaption>
        <div class="net__grid">
          <svg class="net__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M50 50 L50 10" /><path d="M50 50 L12 50" /><path d="M50 50 L88 50" /><path d="M50 50 L50 88" />
          </svg>
          <span class="net__role net__role--top" aria-hidden="true">{{ t.roles.customer }}</span>
          <span class="net__role net__role--left" aria-hidden="true">{{ t.roles.competitor }}</span>
          <span class="net__role net__role--right" aria-hidden="true">{{ t.roles.complementor }}</span>
          <span class="net__role net__role--bottom" aria-hidden="true">{{ t.roles.supplier }}</span>
          <div class="net__core" aria-hidden="true">ETtoday</div>
          <button
            v-for="p in t.players"
            :key="p.key"
            type="button"
            class="chip"
            :class="[`chip--${p.role}`, { on: picked === p.key }]"
            :style="{ gridArea: area[p.key] }"
            :aria-pressed="picked === p.key"
            @click="picked = p.key"
          >
            <b>{{ p.name }}</b>
            <span v-if="p.both" class="chip__flip" aria-hidden="true"><span>{{ t.flip[0] }}</span><span>{{ t.flip[1] }}</span></span>
            <span v-else class="chip__role">{{ t.roles[p.role] }}</span>
          </button>
        </div>
      </figure>

      <aside class="panel" aria-live="polite">
        <p class="panel__role">{{ t.roles[player.role] }}</p>
        <h4 class="panel__name">{{ player.name }}</h4>
        <p v-if="player.members" class="panel__members">{{ player.members }}</p>
        <dl class="panel__dl">
          <dt>{{ t.panel.gives }}</dt><dd>{{ player.gives }}</dd>
          <dt>{{ t.panel.gets }}</dt><dd>{{ player.gets }}</dd>
          <dt>{{ t.panel.verdict }}</dt><dd class="panel__verdict">{{ player.verdict }}</dd>
          <dt>{{ t.panel.rows }}</dt>
          <dd>
            <ul v-if="evidence.length" class="panel__rows">
              <li v-for="r in evidence" :key="r.id"><span class="panel__badge">{{ r.badge }}</span><span>{{ r.move }}</span><span class="panel__date">{{ r.date }}</span></li>
            </ul>
            <span v-else class="panel__none">{{ t.panel.none }}</span>
          </dd>
        </dl>
        <p class="panel__note">{{ t.draftNote }}</p>
      </aside>
    </div>

    <figure class="cmap">
      <figcaption class="rv-label">{{ t.mapLabel }}</figcaption>
      <div class="cmap__grid">
        <div class="cmap__plot">
          <span class="cmap__y"><b>{{ t.axes.y }}</b><span>{{ t.axes.yNote }}</span></span>
          <div class="cmap__quads">
            <div
              v-for="q in [t.quadrants[1], t.quadrants[0], t.quadrants[3], t.quadrants[2]]"
              :key="q.key"
              class="quad"
              :class="[`quad--${q.key}`, { hot: hotQ === q.key }]"
              tabindex="0"
              @mouseenter="hotQ = q.key" @mouseleave="hotQ = null" @focus="hotQ = q.key" @blur="hotQ = null"
            >
              <b>{{ q.name }}</b><span>{{ q.text }}</span>
            </div>
          </div>
          <span class="cmap__x"><b>{{ t.axes.x }}</b><span>{{ t.axes.xNote }}</span></span>
        </div>
        <div class="tray">
          <p class="rv-label">{{ t.trayLabel }}</p>
          <ul><li v-for="a in t.actors" :key="a">{{ a }}</li></ul>
          <p class="tray__note">{{ t.trayNote }}</p>
        </div>
      </div>
    </figure>
  </div>
</template>

<style scoped>
.board { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: clamp(24px, 4vw, 56px); margin-top: clamp(36px, 4.4vw, 56px); align-items: start; }
.net { display: flex; flex-direction: column; gap: 14px; }
.net__cap { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.net__hint { font: 400 12px var(--rv-mono); color: var(--rv-red); }
.net__grid {
  position: relative; display: grid; gap: 14px; padding: 36px 24px; background: var(--rv-paper-2);
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: auto auto auto;
  grid-template-areas: "c1 . c2" "l core r" ". s x"; align-items: center;
}
.net__lines { position: absolute; inset: 0; width: 100%; height: 100%; }
.net__lines path { stroke: var(--rv-line-strong); stroke-width: 1.5px; vector-effect: non-scaling-stroke; stroke-dasharray: 4 4; fill: none; }
.net__role { position: absolute; font: 500 10px var(--rv-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--rv-muted); }
.net__role--top { top: 10px; left: 50%; translate: -50% 0; }
.net__role--bottom { bottom: 10px; left: 50%; translate: -50% 0; }
.net__role--left { left: 8px; top: 50%; translate: 0 -50%; writing-mode: vertical-rl; rotate: 180deg; }
.net__role--right { right: 8px; top: 50%; translate: 0 -50%; writing-mode: vertical-rl; }
.net__core {
  grid-area: core; justify-self: center; position: relative; display: grid; place-items: center; width: 112px; aspect-ratio: 1; border-radius: 50%;
  background: var(--rv-ink); color: var(--rv-paper); font: 400 20px/1 var(--rv-serif); box-shadow: 0 0 0 8px var(--rv-paper-2);
}
.chip {
  position: relative; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; padding: 12px 14px; text-align: left;
  border: 1px solid var(--rv-line-strong); background: #fbf9f4; transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.chip b { font-size: 15px; font-weight: 600; }
.chip__role { font: 400 11px var(--rv-mono); color: var(--rv-muted); }
.chip:hover { transform: translateY(-2px); }
.chip.on { border-color: var(--rv-red); box-shadow: 0 0 0 2px var(--rv-red); }
.chip--rules { border-style: dashed; }
.chip--complementor { border-color: var(--rv-blue); }
/* the platforms flip between their two roles */
.chip__flip { position: relative; display: block; height: 14px; overflow: hidden; font: 500 11px/14px var(--rv-mono); }
.chip__flip span { display: block; animation: flip 3.2s steps(1) infinite; }
.chip__flip span:first-child { color: var(--rv-blue); }
.chip__flip span:last-child { color: var(--rv-red); }
@keyframes flip { 0%, 49% { transform: translateY(0); } 50%, 100% { transform: translateY(-14px); } }

.panel { display: flex; flex-direction: column; gap: 10px; padding: clamp(20px, 2.4vw, 28px); background: #fbf9f4; border: 1px solid var(--rv-line-strong); border-top: 3px solid var(--rv-red); }
.panel__role { font: 500 11px var(--rv-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rv-red); }
.panel__name { font: 400 28px/1.1 var(--rv-serif); }
html[lang^="zh"] .panel__name { font-weight: 500; }
.panel__members { font-size: 13px; color: var(--rv-muted); }
.panel__dl { display: grid; grid-template-columns: minmax(0, 1fr); gap: 4px; margin-top: 6px; }
.panel__dl dt { margin-top: 8px; font: 500 11px var(--rv-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--rv-muted); }
.panel__dl dd { font-size: 14px; line-height: 1.5; color: var(--rv-ink-2); }
.panel__verdict { font-weight: 600; color: var(--rv-ink) !important; }
.panel__rows { display: flex; flex-direction: column; gap: 6px; }
.panel__rows li { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; gap: 8px; align-items: center; font-size: 13px; }
.panel__badge { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 6px; background: var(--rv-paper-2); font: 600 10px var(--rv-sans); }
.panel__date { font: 400 11px var(--rv-mono); color: var(--rv-muted); }
.panel__none { font-size: 13px; color: var(--rv-muted); }
.panel__note { margin-top: 6px; padding-top: 10px; border-top: 1px dashed var(--rv-line-strong); font-size: 12px; color: var(--rv-muted); }

.cmap { margin-top: clamp(40px, 5vw, 64px); display: flex; flex-direction: column; gap: 14px; }
.cmap__grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: clamp(24px, 4vw, 56px); align-items: start; }
.cmap__plot { display: grid; grid-template-columns: 44px minmax(0, 1fr); grid-template-rows: auto auto; gap: 10px; }
.cmap__y { grid-row: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; writing-mode: vertical-rl; rotate: 180deg; font-size: 12px; }
.cmap__y b, .cmap__x b { font-weight: 600; }
/* Chinese reads top to bottom with upright characters: no half-turn (it would stand them on their heads) */
html[lang^="zh"] .cmap__y, html[lang^="zh"] .net__role--left { rotate: none; }
.cmap__y span, .cmap__x span { font: 400 11px var(--rv-mono); color: var(--rv-muted); }
.cmap__x { grid-column: 2; display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; font-size: 12px; }
.cmap__quads { position: relative; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(120px, auto)); gap: 4px; border-left: 2px solid var(--rv-ink); border-bottom: 2px solid var(--rv-ink); padding: 0 0 4px 4px; }
/* arrowheads at the far ends of the axes (not in the rotated label, where a glyph would turn) */
.cmap__quads::before { content: ""; position: absolute; left: -7px; top: -8px; border: 6px solid transparent; border-bottom: 9px solid var(--rv-ink); border-top: 0; }
.cmap__quads::after { content: ""; position: absolute; right: -8px; bottom: -7px; border: 6px solid transparent; border-left: 9px solid var(--rv-ink); border-right: 0; }
.quad { display: flex; flex-direction: column; gap: 6px; padding: 16px; background: var(--rv-paper-2); transition: background-color 150ms ease; outline: none; }
.quad b { font: 400 18px/1.2 var(--rv-serif); }
html[lang^="zh"] .quad b { font-weight: 500; }
.quad span { font-size: 13px; color: var(--rv-ink-2); }
.quad--hh { background: color-mix(in oklab, var(--rv-red) 14%, var(--rv-paper-2)); }
.quad--ll { background: color-mix(in oklab, var(--rv-paper-2) 50%, var(--rv-paper)); }
.quad.hot, .quad:focus-visible { background: color-mix(in oklab, var(--rv-red) 24%, var(--rv-paper-2)); }
.tray { display: flex; flex-direction: column; gap: 12px; padding: 18px; border: 1px dashed var(--rv-line-strong); }
.tray ul { display: flex; flex-wrap: wrap; gap: 6px; }
.tray li { padding: 5px 10px; border-radius: 999px; border: 1px dashed var(--rv-line-strong); font-size: 13px; color: var(--rv-ink-2); }
.tray__note { font-size: 13px; color: var(--rv-muted); }

@media (max-width: 960px) {
  .board, .cmap__grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 600px) {
  .net__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-areas: "core core" "c1 c2" "l r" "s x"; padding: 32px 16px; }
  .net__lines, .net__role { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  /* no flipping: both roles, side by side */
  .chip__flip { height: auto; display: flex; gap: 8px; }
  .chip__flip span { animation: none; }
  .chip:hover { transform: none; }
}
</style>
