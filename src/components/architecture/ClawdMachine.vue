<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { prefersReducedMotion } from '../../composables/motion.js';

// An 8-bit scene: Clawd, Claude Code's terminal mascot, in the cockpit of the data machine. A document drops from the sources, rides
// the belt in, Clawd works the controls, a row comes out, a member's stamp checks it, it lands in the JSON
// crate, and the site monitor rebuilds. Drawn on a small canvas scaled up with hard pixel edges.
// Emits the step (1–7) the current document is at, so the step strip can follow it.
const props = defineProps({
  label: { type: String, required: true },
  pauseLabel: { type: String, required: true },
  playLabel: { type: String, required: true },
});
const emit = defineEmits(['step']);

const W = 256;
const H = 112;
const CYCLE = 7.2;
const C = {
  bg: '#15161a', grid: '#1b1c21', floor: '#202128', floorDot: '#2a2b33',
  metal: '#3b3f4a', metalHi: '#5a5f6d', metalLo: '#2a2d35', rivet: '#6e7383',
  glass: '#0c0e14', glassHi: '#1c2030', desk: '#4a4f5c', deskHi: '#666c7b',
  amber: '#f0a65a', amberLo: '#7a4f2a', red: '#e5603f', redLo: '#4a2a22', green: '#6fbf73', greenLo: '#284a2c',
  blue: '#7d9fe0', paper: '#eee9de', paperLo: '#b9b2a4', ink: '#5d5850',
  belt: '#2c2e36', beltHi: '#454956', roller: '#6e7383',
  clawd: '#D97757', clawdLo: '#A95A3E', eye: '#1a1210',
  smoke: '#6e7383',
};
// the four channel colours a document can carry (records, reports, APIs, news)
const TABS = [C.paper, C.blue, C.amber, C.green];

// Clawd, Claude Code's terminal mascot, decoded from its welcome-screen logo
//    ▐▛███▜▌
//   ▝▜█████▛▘
//     ▘▘ ▝▝
// one block quadrant per cell ('e' an eye slit). A terminal cell is twice as tall as it is wide, so each cell is
// drawn 2 px wide and 4 px tall: Clawd is 36 × 20 on the canvas. The arms (row 2, outer two columns each side)
// are drawn on their own so they can work the levers.
const CLAWD = [
  '...############...',
  '...##e######e##...',
  '...############...',
  '...############...',
  '....#.#....#.#....',
];
const CELL_W = 2;
const CELL_H = 4;

const canvas = ref(null);
const wrap = ref(null);
const scale = ref(3);
const playing = ref(true);
let ctx;
let raf = 0;
let last = 0;
let t = 4.5;           // scene time in seconds (a still frame shows the stamp coming down)
let visible = false;
let reduced = false;
let io;
let ro;
let lastStep = 0;
let puffs = [];
let builds = 0;        // how many rows have reached the site
let crate = 0;         // rows in the crate

const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
const sprite = (rows, x, y, pal) => {
  rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const c = pal[row[i]]; if (c) px(x + i, y + j, 1, 1, c); } });
};
const lerp = (a, b, k) => a + (b - a) * Math.min(1, Math.max(0, k));
const phase = (s, a, b) => (s - a) / (b - a);

// which step the document is at, from the time in the cycle
function stepAt(s) {
  if (s < 0.7) return 1;
  if (s < 2.1) return 2;
  if (s < 4.3) return 3;
  if (s < 4.9) return 4;
  if (s < 5.9) return 5;
  if (s < 6.6) return 6;
  return 7;
}

function drawBackground() {
  px(0, 0, W, H, C.bg);
  for (let x = 0; x < W; x += 8) px(x, 0, 1, 96, C.grid);
  px(0, 96, W, 16, C.floor);
  for (let x = 3; x < W; x += 11) px(x, 100 + (x % 3) * 3, 1, 1, C.floorDot);
}

function drawBelt(x0, x1, y, offset) {
  px(x0, y, x1 - x0, 6, C.belt);
  px(x0, y, x1 - x0, 1, C.beltHi);
  for (let x = x0 - 8 + (offset % 8); x < x1; x += 8) if (x >= x0) px(x, y + 2, 3, 1, C.beltHi);
  for (let x = x0 + 4; x < x1; x += 10) { px(x, y + 6, 4, 3, C.roller); px(x + 1, y + 7, 2, 1, C.metalLo); }
  for (let x = x0 + 2; x < x1; x += 20) px(x, y + 9, 2, 96 - y - 9, C.metalLo);
}

function drawDoc(x, y, tab) {
  px(x, y, 12, 14, C.paper);
  px(x + 9, y, 3, 3, C.paperLo);             // folded corner
  px(x, y, 4, 2, tab === C.paper ? C.ink : tab);
  px(x + 2, y + 5, 8, 1, C.ink); px(x + 2, y + 8, 7, 1, C.ink); px(x + 2, y + 11, 5, 1, C.ink);
  px(x, y + 14, 12, 1, C.paperLo);
}

function drawRow(x, y, checked) {
  px(x, y, 14, 5, C.amber);
  px(x, y + 4, 14, 1, C.amberLo);
  px(x + 2, y + 2, 4, 1, C.amberLo); px(x + 7, y + 2, 5, 1, C.amberLo);
  if (checked) { px(x + 9, y + 1, 1, 1, C.green); px(x + 10, y + 2, 1, 1, C.green); px(x + 11, y + 1, 1, 1, C.green); px(x + 12, y, 1, 1, C.green); }
}

function drawGear(cx, cy, a, fast) {
  for (let k = 0; k < 8; k++) {
    const ang = a + (k * Math.PI) / 4;
    px(cx + Math.cos(ang) * 6.5 - 1, cy + Math.sin(ang) * 6.5 - 1, 2, 2, fast ? C.metalHi : C.rivet);
  }
  for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) {
    const d = dx * dx + dy * dy;
    if (d <= 25) px(cx + dx, cy + dy, 1, 1, d <= 3 ? C.metalLo : C.metalHi);
  }
}

function drawMachine(s, busy, clock) {
  // chimney and its light
  px(106, 12, 8, 16, C.metal); px(105, 10, 10, 3, C.metalHi);
  px(109, 7, 2, 3, Math.floor(clock * 2) % 2 ? C.red : C.redLo);
  // gear on the roof
  drawGear(140, 19, clock * (busy ? 6 : 1.2), busy);
  // body
  px(96, 26, 80, 70, C.metal);
  px(96, 26, 80, 3, C.metalHi);
  px(96, 26, 2, 70, C.metalHi);
  px(174, 26, 2, 70, C.metalLo);
  for (let x = 100; x < 174; x += 12) { px(x, 30, 1, 1, C.rivet); px(x, 92, 1, 1, C.rivet); }
  // cockpit window
  px(102, 29, 48, 35, C.metalLo);
  px(104, 31, 44, 31, C.glass);
  px(105, 32, 10, 1, C.glassHi); px(105, 33, 4, 1, C.glassHi);
}

function drawCockpit(clock, busy) {
  // Clawd works two levers, one arm down while the other lifts; faster while the machine works
  const rate = busy ? 9 : 3;
  const frame = Math.floor(clock * rate) % 2;           // 0: left arm down, 1: right arm down
  const blink = (clock % 3.4) > 3.25;
  const x0 = 108;
  const y0 = 35 + (busy && frame ? 1 : 0);              // a small bob while it works
  const cell = (cx, cy, c) => px(x0 + cx * CELL_W, y0 + cy * CELL_H, CELL_W, CELL_H, c);
  CLAWD.forEach((row, cy) => {
    for (let cx = 0; cx < row.length; cx++) {
      if (row[cx] === '#') cell(cx, cy, C.clawd);
      else if (row[cx] === 'e') cell(cx, cy, blink ? C.clawdLo : C.eye);
    }
  });
  // the arms and their levers: the pressing arm sits 2 px low on a pushed-down lever, the other 2 px high
  const leftDown = frame === 0;
  const armAt = (cx, down) => {
    const ax = x0 + cx * CELL_W;
    const ay = y0 + 2 * CELL_H + (down ? 2 : -2);
    px(ax, ay, CELL_W * 2, CELL_H, C.clawd);
    const knob = ay + CELL_H + 1;                       // the lever's knob, just under the arm
    px(ax + 1, knob + 2, 2, 51 - knob - 2, C.rivet);    // the stick, down into the desk
    px(ax, knob, 4, 2, down ? C.red : C.metalHi);       // the knob, red while pressed
  };
  armAt(1, leftDown);
  armAt(15, !leftDown);
  // the desk below it; the lights blink while it works, the one on the pressing side stays lit
  px(104, 51, 44, 11, C.desk);
  px(104, 51, 44, 1, C.deskHi);
  const lit = [leftDown, busy && Math.floor(clock * 6) % 2 === 0, busy && Math.floor(clock * 6) % 2 === 1, !leftDown];
  [117, 122, 127, 132].forEach((bx, i) => px(bx, 54, 3, 2, lit[i] ? (i % 3 === 0 ? C.green : C.amber) : C.metalLo));
  px(110, 58, 32, 2, C.metalLo);
  for (let i = 0; i < 6; i++) px(112 + i * 5, 58, 2, 1, busy && (Math.floor(clock * 8) + i) % 3 === 0 ? C.amber : C.metal);
}

function drawPanels(clock, busy) {
  // side screen: rows scrolling, fast while working
  px(152, 32, 20, 22, C.metalLo);
  px(153, 33, 18, 20, C.glass);
  const speed = busy ? 22 : 5;
  for (let i = 0; i < 6; i++) {
    const y = 33 + ((i * 4 - clock * speed) % 24 + 24) % 24;
    if (y < 51) px(155, y, 6 + ((i * 7) % 9), 2, i % 3 === 0 ? C.amber : C.amberLo);
  }
  // gauge
  px(152, 57, 20, 9, C.metalLo);
  px(153, 58, 18, 7, C.glass);
  const ang = Math.PI + (busy ? 0.6 + Math.sin(clock * 14) * 0.4 : 0.35 + Math.sin(clock * 2) * 0.1) * Math.PI / 2;
  for (let r = 0; r < 6; r++) px(162 + Math.cos(ang) * r, 64 + Math.sin(ang) * r, 1, 1, C.red);
  // LED strip
  for (let i = 0; i < 9; i++) {
    const on = busy ? (Math.floor(clock * 14) % 9) === i : (Math.floor(clock * 1.5) + i) % 4 === 0;
    px(104 + i * 8, 70, 4, 2, on ? C.red : C.redLo);
  }
  // intake and output slots
  px(96, 64, 4, 20, C.glass); px(172, 70, 4, 14, C.glass);
}

function drawStamp(down) {
  // bracket, rod and head; the member's stamp
  px(182, 38, 28, 3, C.metalHi); px(182, 38, 2, 50, C.metalLo); px(208, 38, 2, 50, C.metalLo);
  const headY = lerp(54, 70, down);
  px(194, 41, 3, headY - 41, C.rivet);
  px(188, headY, 15, 7, C.metalHi);
  px(188, headY + 6, 15, 1, C.green);
  px(192, headY + 2, 7, 2, C.metal);
}

function drawCrate() {
  px(230, 80, 22, 16, C.metal); px(230, 80, 22, 2, C.metalHi);
  // "{ }" on its front
  const b = C.amber;
  px(236, 85, 1, 7, b); px(235, 88, 1, 1, b); px(237, 85, 1, 1, b); px(237, 91, 1, 1, b);
  px(245, 85, 1, 7, b); px(246, 88, 1, 1, b); px(244, 85, 1, 1, b); px(244, 91, 1, 1, b);
  for (let i = 0; i < Math.min(crate, 3); i++) drawRow(234, 75 - i * 4, true);
}

function drawMonitor(s) {
  px(214, 4, 38, 30, C.metalHi);
  px(216, 6, 34, 26, C.glass);
  px(229, 34, 8, 4, C.metal); px(224, 38, 18, 2, C.metalHi);
  px(216, 6, 34, 3, C.metalLo);
  [218, 221, 224].forEach((x, i) => px(x, 7, 2, 1, [C.red, C.amber, C.green][i]));
  const building = s >= 5.9 && s < 6.6;
  const live = s >= 6.6;
  if (building) {
    px(220, 18, 26, 4, C.metalLo);
    px(220, 18, Math.round(26 * phase(s, 5.9, 6.5)), 4, C.amber);
  } else {
    const n = builds + (live ? 1 : 0);
    for (let i = 0; i < 6; i++) {
      const h = 3 + ((n + i) * 5) % 14;
      px(219 + i * 5, 30 - h, 3, h, i === 5 && live ? C.green : C.blue);
    }
  }
  if (live && s < 6.9) { px(214, 4, 38, 1, C.green); px(214, 33, 38, 1, C.green); }
}

function drawPuffs(dt, busy, clock) {
  if (busy && Math.random() < dt * 5) puffs.push({ x: 108 + Math.random() * 3, y: 6, life: 1 });
  puffs = puffs.filter((p) => (p.life -= dt * 0.9) > 0);
  for (const p of puffs) {
    p.y -= dt * 9; p.x += Math.sin(clock * 3 + p.y) * dt * 4;
    const sz = p.life > 0.6 ? 2 : 3;
    if (p.y > -3) { ctx.globalAlpha = Math.max(0, p.life); px(p.x, p.y, sz, sz, C.smoke); ctx.globalAlpha = 1; }
  }
}

function draw(dt) {
  const s = t % CYCLE;
  const clock = t;
  const busy = s >= 2.1 && s < 3.5;
  drawBackground();
  // the chute the documents fall from
  px(4, 4, 30, 3, C.metalHi); px(8, 7, 22, 3, C.metal); px(13, 10, 12, 16, C.metalLo); px(12, 10, 1, 16, C.metalHi); px(25, 10, 1, 16, C.metalHi);
  drawBelt(4, 98, 80, clock * 16);
  drawBelt(176, 230, 84, clock * 16);
  drawMachine(s, busy, clock);
  drawCockpit(clock, busy);
  drawPanels(clock, busy);
  drawPuffs(dt, busy, clock);

  const tab = TABS[Math.floor(t / CYCLE) % TABS.length];
  // the document: falls, rides in
  if (s < 0.7) drawDoc(13, lerp(10, 66, phase(s, 0, 0.7) ** 2), tab);
  else if (s < 2.1) drawDoc(lerp(13, 92, phase(s, 0.7, 2.1)), 66, tab);
  // the row: comes out, is stamped, rides on, drops into the crate
  const stampDown = s >= 4.3 && s < 4.8 ? Math.sin(phase(s, 4.3, 4.8) * Math.PI) : 0;
  if (s >= 3.5 && s < 4.3) drawRow(lerp(172, 188, phase(s, 3.5, 4.3)), 79, false);
  else if (s >= 4.3 && s < 4.8) drawRow(188, 79, s >= 4.5);
  else if (s >= 4.8 && s < 5.6) drawRow(lerp(188, 232, phase(s, 4.8, 5.6)), 79, true);
  else if (s >= 5.6 && s < 5.9) drawRow(234, lerp(79, 75 - Math.min(crate, 2) * 4, phase(s, 5.6, 5.9)), true);
  drawStamp(stampDown);
  drawCrate();
  drawMonitor(s);
  // the machine's front edge over the belt ends
  px(96, 84, 4, 12, C.metal); px(172, 88, 4, 8, C.metal);
}

function tick(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0);
  last = now;
  const before = t % CYCLE;
  t += dt;
  const after = t % CYCLE;
  if (after < before) { builds++; }                          // a cycle closed: the site has one more build
  if (before < 5.9 && after >= 5.9) crate = (crate % 3) + 1; // a row landed in the crate
  draw(dt);
  const step = stepAt(after);
  if (step !== lastStep) { lastStep = step; emit('step', step); }
  raf = requestAnimationFrame(tick);
}

function start() {
  if (raf || reduced || !playing.value || !visible) return;
  last = performance.now();
  raf = requestAnimationFrame(tick);
}
function stop() { cancelAnimationFrame(raf); raf = 0; }
function toggle() { playing.value = !playing.value; }
watch(playing, (on) => { if (on) start(); else { stop(); emit('step', 0); lastStep = 0; } });

function fit() {
  const w = wrap.value?.clientWidth || W * 3;
  scale.value = Math.max(1, Math.floor(w / W));
}

onMounted(() => {
  ctx = canvas.value.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  reduced = prefersReducedMotion();
  crate = 2; builds = 3;
  draw(0);                                  // a still frame first (and the only one with reduced motion)
  fit();
  if (typeof ResizeObserver === 'function') { ro = new ResizeObserver(fit); ro.observe(wrap.value); }
  if (reduced) return;
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); }, { threshold: 0.1 });
  io.observe(wrap.value);
});
onBeforeUnmount(() => { stop(); io?.disconnect(); ro?.disconnect(); });
</script>

<template>
  <div ref="wrap" class="clawd">
    <canvas
      ref="canvas"
      :width="W"
      :height="H"
      :style="{ width: `${W * scale}px` }"
      role="img"
      :aria-label="label"
    ></canvas>
    <button type="button" class="clawd__toggle" :aria-pressed="!playing" @click="toggle">
      <span aria-hidden="true">{{ playing ? '❚❚' : '▶' }}</span>{{ playing ? pauseLabel : playLabel }}
    </button>
  </div>
</template>

<style scoped>
.clawd { position: relative; display: flex; justify-content: center; width: 100%; overflow: hidden; }
.clawd canvas { display: block; image-rendering: pixelated; image-rendering: crisp-edges; max-width: 100%; height: auto; }
.clawd__toggle {
  position: absolute; right: 10px; bottom: 10px; display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px; border: 1px solid rgba(238, 233, 222, 0.3); border-radius: 999px; background: rgba(21, 22, 26, 0.75);
  color: #eee9de; font: 500 11px/1 var(--rv-mono); letter-spacing: 0.04em;
}
.clawd__toggle:hover { background: #eee9de; color: #15161a; }
.clawd__toggle span { font-size: 9px; }
</style>
