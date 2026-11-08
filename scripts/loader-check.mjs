// Loader check: records video + screenshots of the loading screen and verifies the handoff.
// Usage: npm run build && npm run preview, then: npm run check:loader [-- --base http://localhost:4173] [--quick]
// Output: screenshots/loader/<scenario>/*.png|webm and screenshots/loader/report.json
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', process.env.BASE_URL || 'http://localhost:4173');
const OUT = path.resolve('screenshots', 'loader');
const QUICK = process.argv.includes('--quick');
const SLUG = 'spacezap-fitout-minutes';
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const VIEWS = { desktop: { viewport: { width: 1440, height: 900 } }, phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
const report = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const INIT = () => {
  window.__ld = { cls: 0, loaderAtFirstPaint: null, fp: null };
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ld.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (e.name !== 'first-paint' || window.__ld.fp != null) continue;
        window.__ld.fp = Math.round(e.startTime);
        const L = document.getElementById('loader'), c = L && getComputedStyle(L);
        window.__ld.loaderAtFirstPaint = !!L && c.display !== 'none' && c.position === 'fixed' && c.backgroundColor === 'rgb(2, 2, 26)';
      }
    }).observe({ type: 'paint', buffered: true });
  } catch (e) {}
};

async function run({ name, view, route, throttle = false, reduced = false, init, hash }) {
  const dir = path.join(OUT, name); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ ...VIEWS[view], reducedMotion: reduced ? 'reduce' : 'no-preference', recordVideo: { dir, size: { width: 720, height: view === 'phone' ? 1560 : 450 } } });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(INIT);
  if (init) await page.addInitScript(init);
  if (throttle) {
    const cdp = await ctx.newCDPSession(page); // Slow 4G + 4x CPU, as in Lighthouse mobile
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  const t0 = Date.now();
  await page.goto(`${BASE}/${route}`, { waitUntil: 'commit' });
  const shot = async (label) => { try { await page.screenshot({ path: path.join(dir, `${label}.png`) }); } catch (e) {} };
  const marks = [300, 1000, 2000], r = { name, view, route, throttle, reduced, errors };
  for (const m of marks) { await sleep(Math.max(0, m - (Date.now() - t0))); await shot(`${m}ms`); }
  // wait for the loader node to disappear (hard cap 8s + slack)
  let gone = null;
  while (Date.now() - t0 < 25000) {
    const present = await page.evaluate(() => !!document.getElementById('loader')).catch(() => true);
    if (!present) { gone = Date.now() - t0; break; }
    await sleep(100);
  }
  r.loaderGoneMs = gone;
  await sleep(1800); await shot('end');
  const f1 = await page.evaluate(() => window.__ldFrames || 0); await sleep(600);
  Object.assign(r, await page.evaluate((f1) => ({
    loaderAtFirstPaint: window.__ld.loaderAtFirstPaint, firstPaintMs: window.__ld.fp, cls: +window.__ld.cls.toFixed(4),
    nodeRemoved: !document.getElementById('loader'),
    scrollUnlocked: getComputedStyle(document.documentElement).overflow !== 'hidden' && !document.documentElement.classList.contains('is-loading'),
    rafStopped: (window.__ldFrames || 0) === f1, noWebgl: document.documentElement.classList.contains('no-webgl'),
    exitStartMs: Math.round((performance.getEntriesByName('ld-exit')[0] || {}).startTime || 0), doneMs: Math.round((performance.getEntriesByName('ld-done')[0] || {}).startTime || 0),
    ariaBusy: [...document.querySelectorAll('main')].map((m) => m.getAttribute('aria-busy')).join(','),
  }), f1));
  if (hash) r.hashTop = await page.evaluate((id) => { const e = document.getElementById(id); return e ? Math.round(e.getBoundingClientRect().top) : null; }, hash);
  await ctx.close();
  const vid = fs.readdirSync(dir).find((f) => f.endsWith('.webm'));
  if (vid) fs.renameSync(path.join(dir, vid), path.join(dir, 'load.webm'));
  report.push(r); console.log(JSON.stringify(r));
}

const matrix = [];
for (const view of ['desktop', 'phone']) for (const throttle of [false, true]) for (const [rn, route] of [['home', '#home'], ['blog', `#blog/${SLUG}`]]) {
  if (QUICK && (throttle || view === 'phone') && rn === 'blog') continue;
  matrix.push({ name: `${view}-${throttle ? 'slow4g' : 'fast'}-${rn}`, view, route, throttle });
}
for (const m of matrix) await run(m);
await run({ name: 'desktop-hash-sakshi', view: 'desktop', route: '#sakshi', hash: 'sakshi' });
await run({ name: 'phone-hash-contact', view: 'phone', route: '#contact', hash: 'contact' });
await run({ name: 'desktop-reduced-motion', view: 'desktop', route: '#home', reduced: true });
// hard cap: a task that never settles (fonts) must not hold the site past ~8s
await run({ name: 'desktop-cap-8s-fonts-stalled', view: 'desktop', route: '#home', init: () => { document.fonts.load = () => new Promise(() => {}); } });
// no-WebGL fallback: reveal as soon as fonts + images are ready
await run({ name: 'desktop-no-webgl', view: 'desktop', route: '#home', init: () => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : g.call(this, t, ...a); }; } });

await browser.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
const bad = report.filter((x) => !x.nodeRemoved || !x.scrollUnlocked || !x.rafStopped || x.loaderAtFirstPaint === false || x.cls > 0.01 || x.errors.length || x.exitStartMs > 7600 || (x.hashTop != null && Math.abs(x.hashTop) > 120));
console.log(`\n${report.length} runs -> ${OUT}`);
if (bad.length) { console.log('PROBLEMS:'); bad.forEach((x) => console.log(' ', x.name, JSON.stringify(x))); process.exitCode = 1; } else console.log('All loader checks passed.');
