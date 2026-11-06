// Responsive check: screenshots every route at many viewports and reports horizontal overflow.
// Usage: node scripts/responsive-check.mjs [before|after] [--base http://localhost:4173]
// Needs a running server (npm run build && npm run preview) and Chrome (CHROME_PATH or /usr/bin/google-chrome).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const label = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'after';
const baseIdx = process.argv.indexOf('--base');
const BASE = baseIdx > 0 ? process.argv[baseIdx + 1] : process.env.BASE_URL || 'http://localhost:4173';
const OUT = path.resolve('screenshots', label);
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [[320, 568], [360, 780], [375, 812], [390, 844], [414, 896], [667, 375], [768, 1024], [820, 1180], [1024, 768], [1280, 800], [1440, 900]];
const STAGES = ['spacezap', 'furniture', 'gfc', 'mep', 'boq', 'sakshi', 'datadime', 'platform', 'faq', 'contact'];
const FIRST_SLUG = 'spacezap-fitout-minutes';
const ROUTES = [
  ...['home', ...STAGES].map((id) => ({ name: id === 'home' ? 'home' : 'home-' + id, hash: id, viewport: id !== 'home' })),
  { name: 'about', hash: 'about' }, { name: 'events', hash: 'events' }, { name: 'careers', hash: 'careers' },
  { name: 'privacy-policy', hash: 'privacy-policy' }, { name: 'blog', hash: 'blog' }, { name: 'blog-article', hash: 'blog/' + FIRST_SLUG },
];

// Elements whose right edge sticks out past the viewport and are not clipped by a scroll/overflow container.
const findOverflow = () => {
  const W = document.documentElement.clientWidth, out = [];
  const sel = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '');
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || r.right <= W + 1) continue;
    let clipped = false;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(o.overflowX) && p.getBoundingClientRect().right <= W + 1) { clipped = true; break; }
      if (getComputedStyle(p).display === 'none') { clipped = true; break; }
    }
    if (!clipped) out.push(`${sel(el)} right=${Math.round(r.right)} width=${Math.round(r.width)}`);
  }
  const docOver = document.documentElement.scrollWidth > W ? `document scrollWidth=${document.documentElement.scrollWidth} > ${W}` : null;
  return { docOver, els: out.slice(0, 6), count: out.length };
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const report = [];
let shots = 0;
for (const [w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 1000, isMobile: w < 800 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const r of ROUTES) {
    await page.goto(`${BASE}/#${r.hash}`, { waitUntil: 'load' });
    await page.waitForTimeout(r.viewport ? 700 : 400);
    if (!r.viewport) { // trigger lazy-loaded images before a full-page capture
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 60)); } scrollTo({ top: 0, behavior: 'instant' }); });
      await page.waitForTimeout(250);
    }
    const o = await page.evaluate(findOverflow);
    if (o.docOver || o.count) report.push({ viewport: `${w}x${h}`, route: '#' + r.hash, ...o });
    await page.screenshot({ path: path.join(OUT, `${w}x${h}-${r.name}.png`), fullPage: !r.viewport });
    shots++;
  }
  if (errors.length) report.push({ viewport: `${w}x${h}`, route: '*', errors });
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'overflow-report.json'), JSON.stringify(report, null, 2));
console.log(`${shots} screenshots -> ${OUT}`);
if (report.length) {
  for (const x of report) console.log(`${x.viewport} ${x.route}`, x.docOver || '', x.count ? `(${x.count} overflowing)` : '', ...(x.els || []).slice(0, 3), x.errors || '');
  process.exitCode = 1;
} else console.log('No horizontal overflow. OK');
