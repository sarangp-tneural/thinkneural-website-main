/* Loading screen controller.
   Markup + critical CSS are inline in index.html (src/components/layout/loader*.{html,css,js}); the blueprint outline
   draws in pure CSS while the bundle downloads. This module takes over progress, stage labels and the exit.

   API:  loader.track(promise, { weight, label })   register a real task (a rejection counts as done)
         loader.ready()                              force finish (still honours the minimum show time)
         loader.onDone(cb)                           after the overlay is gone and scrolling is unlocked
         loader.onExit(cb)                           the moment the exit/handoff starts (camera dolly hooks here)
         loader.active / loader.mode                 'full' (home) | 'short' (other pages) | 'fast' (repeat visit)

   Stage -> progress mapping (displayed %, which eases toward the real weighted %):
     0-35 outline draws (CSS) . 35-65 fixtures (.s2) . 65-95 scan + people (.s3) . 100 Ready -> exit */

const html = document.documentElement;
const root = document.getElementById('loader');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEBUG = import.meta.env.DEV ? new URLSearchParams(location.search).get('loader') : null; // 'hold' | 'slow' (dev only)

const booted = !!root && html.classList.contains('is-loading') && !window.__tnLd;
if (root && !booted) root.remove(); // static SEO page, HMR re-evaluation or stray markup: never show it
if (booted) window.__tnLd = 1;

const mode = html.classList.contains('ld-short') ? 'short' : html.classList.contains('ld-fast') ? 'fast' : 'full';
const MIN = { full: 900, fast: 400, short: 600 }[mode];   // never flash on fast connections
const CAP = { full: 7000, fast: 4000, short: 5000 }[mode]; // hard cap on when the exit starts (+<1s exit => gone by ~8s): reveal whatever state the site is in
const EXIT = reduce ? 300 : mode === 'full' ? 800 : 400;
const LABELS = mode === 'full' ? ['Reading site outline', 'Placing fixtures', 'Turning cameras into data'] : mode === 'fast' ? ['Loading', 'Loading', 'Loading'] : ['Reading site outline', 'Reading site outline', 'Reading site outline'];
const MAX_SPEED = DEBUG === 'slow' ? 12 : 120; // displayed %/s, so a fast load still plays its stages but is never stretched

const tasks = [], doneCbs = [], exitCbs = [];
let state = booted ? 'loading' : 'done', forced = false, ready = false;
let shown = 0, rendered = -1, stage = -1, raf = 0;
/* timers run from navigation start (rAF timestamps share that origin): the cap covers the whole load, the minimum counts from first paint */
const tShow = (performance.getEntriesByName('first-paint')[0] || { startTime: 0 }).startTime;
let last = performance.now();

const statusEl = booted && document.getElementById('ldStatus');
const pctEl = booted && document.getElementById('ldPct');
const mains = booted ? [...document.querySelectorAll('main')] : [];
mains.forEach((m) => m.setAttribute('aria-busy', 'true'));

function render() {
  const v = state === 'loading' ? Math.min(99, Math.floor(shown)) : 100;
  if (v !== rendered) {
    rendered = v;
    root.style.setProperty('--p', (v / 100).toFixed(3));
    pctEl.textContent = v + '%';
  }
  const st = state !== 'loading' ? 3 : shown < 35 ? 0 : shown < 65 ? 1 : 2;
  if (st === stage) return;
  stage = st;
  if (st >= 1) root.classList.add('s2');
  if (st >= 2) root.classList.add('s3');
  const text = st === 3 ? 'Ready' : LABELS[st];
  if (statusEl.textContent !== text) statusEl.textContent = text; // announced by the live region: stage changes only
}

function frame(now) {
  raf = requestAnimationFrame(frame);
  window.__ldFrames = (window.__ldFrames || 0) + 1;
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  const total = tasks.reduce((a, t) => a + t.w, 0), got = tasks.reduce((a, t) => a + (t.done ? t.w : 0), 0);
  const allDone = (tasks.length > 0 && got >= total) || ready;
  const elapsed = now - tShow, sinceNav = now;
  if (!forced && sinceNav >= CAP && DEBUG !== 'hold') { forced = true; console.warn('[loader] hard cap reached, revealing the site in its current state'); }
  const finishing = forced || (allDone && elapsed >= MIN && DEBUG !== 'hold');
  const real = total ? (got / total) * 100 : 0;
  const target = finishing ? 100 : Math.min(real, 99);
  if (forced) shown = 100;
  else {
    let inc = (target - shown) * Math.min(1, dt * 7);
    inc = Math.max(finishing ? 0.35 : 0, Math.min(inc, MAX_SPEED * dt)); // never backwards, never past the speed cap
    shown = Math.min(target, shown + inc);
  }
  render();
  if (finishing && shown >= 99.5) exit();
}

function exit() {
  if (state !== 'loading') return;
  cancelAnimationFrame(raf); raf = 0;
  state = 'exiting'; shown = 100; stage = -1; render();
  root.classList.add('ready');
  setTimeout(begin, reduce ? 0 : 160);
}

function begin() {
  performance.mark('ld-exit');
  root.classList.add('exit');
  html.classList.add('ld-exit'); // lets the 3D canvas fade in underneath
  exitCbs.forEach(safe);
  stagger();
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    root.remove();
    html.classList.remove('is-loading', 'ld-exit');
    try { sessionStorage.setItem('tn-ld', '1'); } catch (e) { /* private mode */ }
    mains.forEach((m) => m.setAttribute('aria-busy', 'false'));
    state = 'done';
    performance.mark('ld-done');
    doneCbs.forEach(safe);
  };
  root.addEventListener('transitionend', (e) => { if (e.target === root && (e.propertyName === 'background-color' || e.propertyName === 'opacity')) finish(); });
  setTimeout(finish, EXIT + 250);
}

// hero stagger: nav -> kicker -> h1 -> lead -> CTAs -> facts. Only on the first reveal of the home page.
function stagger() {
  if (reduce || mode !== 'full' || (location.hash && location.hash !== '#home')) return; // deep links land on their section instead
  const panel = document.querySelector('.hero .panel');
  if (!panel || !panel.getClientRects().length) return;
  const els = [document.querySelector('nav'), ...panel.children].filter(Boolean);
  els.forEach((el, i) => { el.style.setProperty('--i', i); el.classList.add('tn-rise'); });
  setTimeout(() => els.forEach((el) => { el.classList.remove('tn-rise'); el.style.removeProperty('--i'); }), 250 + els.length * 60 + 800);
}

function safe(cb) { try { cb(); } catch (e) { console.error(e); } }

function abort() { // bfcache restore etc.: never show it
  if (state === 'done') return;
  cancelAnimationFrame(raf);
  root.remove(); html.classList.remove('is-loading', 'ld-exit');
  mains.forEach((m) => m.setAttribute('aria-busy', 'false'));
  state = 'done'; exitCbs.forEach(safe); doneCbs.forEach(safe);
}

export const loader = {
  get active() { return state !== 'done'; },
  get mode() { return mode; },
  track(promise, { weight = 10, label = '' } = {}) {
    if (!booted || state !== 'loading') return promise;
    const t = { w: weight, label, done: false };
    tasks.push(t);
    Promise.resolve(promise).then(() => { t.done = true; }, (err) => { console.warn(`[loader] "${label}" failed, continuing`, err); t.done = true; });
    return promise;
  },
  ready() { ready = true; },
  onDone(cb) { if (state === 'done') safe(cb); else doneCbs.push(cb); },
  onExit(cb) { if (state === 'exiting' || state === 'done') safe(cb); else exitCbs.push(cb); },
};

if (booted) {
  raf = requestAnimationFrame(frame);
  addEventListener('pageshow', (e) => { if (e.persisted) abort(); });
}
