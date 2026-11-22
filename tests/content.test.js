// The page's words (src/content/*.js) are one shape in two languages: same keys, same list lengths, same
// figures and links. Every in-page link lands on an id, every figure in §1–2 has a source, no placeholders.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { content } from '../src/content/index.js';

// data, not words, must match exactly across languages: every number and boolean, and these keys
// (a figure written for reading, like NT$66.2B and NT$662 億, is words)
const SAME = new Set(['id', 'href', 'tone', 'key', 'start', 'end', 'turnaround', 'mark', 'name', 'icon', 'kind', 'group', 'type', 'iso', 'status', 'badge', 'date', 'since', 'rowId']);
// keys whose values are words in one language and may legitimately differ even though listed above
const WORDY = new Set(['name', 'date', 'badge']);

function sameShape(a, b, path) {
  if (Array.isArray(a)) {
    assert.ok(Array.isArray(b), `${path}: zh is not a list`);
    assert.equal(b.length, a.length, `${path}: ${a.length} items in en, ${b.length} in zh`);
    a.forEach((x, i) => sameShape(x, b[i], `${path}[${i}]`));
  } else if (a && typeof a === 'object') {
    assert.deepEqual(Object.keys(b).sort(), Object.keys(a).sort(), `${path}: keys differ`);
    for (const k of Object.keys(a)) {
      const v = a[k];
      if (typeof v === 'number' || typeof v === 'boolean' || (SAME.has(k) && !WORDY.has(k) && typeof v === 'string')) assert.equal(b[k], v, `${path}.${k} differs`);
      else sameShape(v, b[k], `${path}.${k}`);
    }
  } else {
    assert.equal(typeof b, typeof a, `${path}: type differs`);
    if (typeof a === 'string') assert.ok(a.trim() && b.trim(), `${path}: empty text`);
  }
}

const walk = (o, f, key = '') => {
  if (Array.isArray(o)) o.forEach((x) => walk(x, f, key));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { f(k, v); walk(v, f, k); }
};
const strings = (o) => (typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(strings) : []);

for (const [name, mod] of Object.entries(content)) {
  test(`${name}: English and Chinese have the same shape and the same figures`, () => sameShape(mod.en, mod.zh, name));
}

test('every in-page link lands on an id', () => {
  for (const lang of ['en', 'zh']) {
    const ids = new Set(['top']);
    const hrefs = [];
    for (const mod of Object.values(content)) {
      walk(mod[lang], (k, v) => {
        if (k === 'id' && typeof v === 'string') ids.add(v);
        if (k === 'href' && typeof v === 'string' && v.startsWith('#')) hrefs.push(v);
      });
    }
    for (const href of new Set(hrefs)) assert.ok(ids.has(href.slice(1)), `${lang}: ${href} has no target`);
  }
});

test('every external link is https or mailto', () => {
  walk(content, (k, v) => {
    if (k === 'href' && typeof v === 'string' && !v.startsWith('#')) assert.match(v, /^(https:\/\/|mailto:)/, v);
  });
});

test('background and platform: every figure has a source link', () => {
  for (const lang of ['en', 'zh']) {
    const p = content.background[lang].problem;
    for (const s of p.columns.flatMap((c) => c.stats)) assert.match(s.href, /^https:\/\//, `${lang}: ${s.caption}`);
    const pf = content.platform[lang];
    for (const s of pf.profile.scale) assert.match(s.href, /^https:\/\//, `${lang}: ${s.caption}`);
    for (const p2 of pf.why.pillars) assert.match(p2.href, /^https:\/\//, `${lang}: ${p2.name}`);
    for (const c of pf.event.cards) assert.match(c.href, /^https:\/\//, `${lang}: ${c.who}`);
  }
});

// (line icons drawn by shared/UiIcon.vue are not files)
test('every tool mark the page shows is in public/icons', () => {
  walk(content, (k, v) => {
    if (k === 'icon' && typeof v === 'string' && !['globe', 'sheets', 'table', 'timer', 'check', 'code', 'publish', 'browser', 'server', 'database', 'mail', 'file'].includes(v)) {
      assert.ok(existsSync(new URL(`../public/icons/${v}.svg`, import.meta.url)), `missing public/icons/${v}.svg`);
    }
  });
});

test('no placeholder text', () => {
  for (const s of strings(content)) assert.doesNotMatch(s, /\[[A-Za-z][^\]]*\]|lorem ipsum|\b__\b/i);
});
