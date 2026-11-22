// Screenshots of one section at several widths and both languages, with the installed Chrome.
//   npm run build && npm run preview   (in another shell)
//   npm run shots -- [section-id] [base-url]
// Reduced motion is on, so every animation shows its end state.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const [id = 'background', base = 'http://localhost:4173/'] = process.argv.slice(2);
const widths = (process.env.WIDTHS || '1440,1024,820,390').split(',').map(Number);
const out = new URL(`../shots/${id}/`, import.meta.url);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
for (const lang of (process.env.LANGS || 'en,zh').split(',')) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(`${base}${lang === 'zh' ? '?lang=zh' : ''}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const el = page.locator(`#${id}`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const file = new URL(`${lang}-${width}.png`, out);
    await el.screenshot({ path: file.pathname });
    console.log(`${lang} ${width}: ${file.pathname}${errors.length ? `  errors: ${errors.join(' | ')}` : ''}`);
    await page.close();
  }
}
await browser.close();
