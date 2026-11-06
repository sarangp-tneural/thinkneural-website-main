import * as THREE from 'three';
import './style.css';

(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const bump = (a, b, c, d, x) => sm(a, b, x) * (1 - sm(c, d, x));
const lerp = (a, b, t) => a + (b - a) * t;


/* ---------- Pages: #about shows the About page, anything else the home story ---------- */
let isAbout = false, page = 'home';
const EVENT_IDS = ['events', 'instore-asia', 'ksum', 'huddle', 'secufest'];
const CAREER_IDS = ['careers', 'internships', 'apply', 'openings'];
const POLICY_IDS = ['privacy-policy', 'platform-licence-agreement', 'content-rules', 'cookies-policy', 'copyright-policy'];
function route() {
  const h = location.hash.slice(1);
  const prev = page;
  page = h === 'about' ? 'about' : EVENT_IDS.includes(h) ? 'events' : CAREER_IDS.includes(h) ? 'careers' : POLICY_IDS.includes(h) ? 'policies' : 'home';
  isAbout = page !== 'home';
  const wasAbout = prev !== 'home';
  document.documentElement.classList.toggle('is-about', page === 'about');
  document.documentElement.classList.toggle('is-events', page === 'events');
  document.documentElement.classList.toggle('is-careers', page === 'careers');
  document.documentElement.classList.toggle('is-policies', page === 'policies');
  document.querySelectorAll('#policiesView .policy').forEach(el => { el.hidden = page === 'policies' && el.id !== h; });
  if (isAbout) {
    const t = ((h !== 'events' && EVENT_IDS.includes(h)) || (h !== 'careers' && CAREER_IDS.includes(h)) || POLICY_IDS.includes(h)) ? document.getElementById(h) : null;
    if (t) requestAnimationFrame(() => t.scrollIntoView({ block: 'start' }));
    else if (prev !== page) scrollTo(0, 0);
  }
  else {
    if (typeof measure === 'function') measure();
    const t = h && h !== 'home' ? document.getElementById(h) : null;
    if (t) requestAnimationFrame(() => t.scrollIntoView({ block: 'start' }));
    else if (wasAbout || h === 'home') scrollTo(0, 0);
  }
}
addEventListener('hashchange', route);

/* ---------- Photo viewer ---------- */
const lb = document.getElementById('lightbox');
document.querySelectorAll('.ph').forEach(b => b.addEventListener('click', () => {
  const im = b.querySelector('img'); lb.querySelector('img').src = im.src; lb.querySelector('img').alt = im.alt;
  lb.querySelector('p').textContent = b.dataset.cap; lb.classList.add('on'); lb.querySelector('.lb-close').focus();
}));
const closeLb = () => lb.classList.remove('on');
lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-close')) closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

/* ---------- Demo form ---------- */
const form = document.getElementById('demoForm');
let lastBody = '';
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const err = document.getElementById('formErr');
  if (!d.name || !d.company || !/^\S+@\S+\.\S+$/.test(d.email || '')) { err.textContent = 'Please add your name, company and a valid work email.'; return; }
  err.textContent = '';
  lastBody = `Name: ${d.name}\nWork email: ${d.email}\nCompany: ${d.company}\nPhone: ${d.phone || '-'}\nCompany size: ${d.size || '-'}\n\nWhat we want to solve:\n${d.need || '-'}`;
  document.getElementById('mailLink').href = 'mailto:sales@tneuralai.com?subject=' + encodeURIComponent('Demo request: ' + d.company) + '&body=' + encodeURIComponent(lastBody);
  document.getElementById('formMsg').classList.add('on');
});
document.getElementById('copyBtn').addEventListener('click', async e => {
  try { await navigator.clipboard.writeText('To: sales@tneuralai.com\n\n' + lastBody); e.target.textContent = 'Copied'; }
  catch (x) { e.target.textContent = 'Copy blocked. Select and copy manually'; }
});

/* ---------- Store data, in metres ---------- */
const H = 3;
const OUT = [[-12,-8],[12,-8],[12,4],[8,4],[8,8],[-12,8]];
const WALLS = [[[-12,-8],[12,-8]],[[12,-8],[12,4]],[[12,4],[8,4]],[[8,4],[8,8]],[[8,8],[3,8]],[[-3,8],[-12,8]],[[-12,8],[-12,-8]]];
const PARTS = [[[5,-8],[5,-4]],[[5,-4],[9,-4]]];
const GOND = []; for (const x of [-7.5,-1]) for (const z of [-4.5,-1,2.5]) GOND.push([x,z]);
const BAYS = [];
for (let i = 0; i < 12; i++) BAYS.push([-10.9 + 1.3*i, -7.6, 0]);
for (let i = 0; i < 10; i++) BAYS.push([-11.6, -6.5 + 1.3*i, 1]);
const TRIAL = [[11,0.5],[11,2.5]];
const TABLES = [[3.5,-1],[3.5,2.5]];
const COUNTER = [5.5,5.5];
const RACKS = [[7,-7.4],[10,-7.4]];
const LIGHTS = []; for (const x of [-10.5,-7,-3.5,0,3.5]) for (const z of [-6,-3,0,3,6]) LIGHTS.push([x,z]);
LIGHTS.push([7,-6],[10.5,-6]);
const YC = 2.95, YD = 2.5, YP = 0.3;
const CONDUIT = []; for (const z of [-6,-3,0,3,6]) CONDUIT.push([[-10.5,YC,z],[4.6,YC,z]]);
CONDUIT.push([[4.6,YC,-6],[4.6,YC,6]],[[4.6,YC,-6],[10.5,YC,-6]],[[4.6,YC,-6],[4.6,1.8,-6]]);
const DUCT = [[[-11,YD,-1.5],[8,YD,-1.5]],[[8,YD,-1.5],[8,YD,-5.4]]];
for (const x of [-9,-4,1]) DUCT.push([[x,YD,-1.5],[x,YD,-5.5]],[[x,YD,-1.5],[x,YD,4.5]]);
const PIPE = [[[12,YP,-7.2],[11.2,YP,-7.2]],[[11.2,YP,-7.2],[11.2,YP,-5.6]],[[11.6,0.12,-5.6],[11.6,0.12,-7.8]]];

const len3 = s => Math.hypot(s[1][0]-s[0][0], s[1][1]-s[0][1], s[1][2]-s[0][2]);
const sumLen = a => a.reduce((t, s) => t + len3(s), 0);
const floorArea = (() => { let a = 0; for (let i = 0; i < OUT.length; i++) { const p = OUT[i], q = OUT[(i+1) % OUT.length]; a += p[0]*q[1] - q[0]*p[1]; } return Math.abs(a)/2; })();
const partArea = PARTS.reduce((t, s) => t + Math.hypot(s[1][0]-s[0][0], s[1][1]-s[0][1]) * H, 0);
const fmt1 = n => (Math.round(n*10)/10).toFixed(1);

const BOQ = [
  {k:'gondola', item:'Gondola unit, 4.0 m', unit:'Nos', q:GOND.length},
  {k:'bay', item:'Wall bay, 1.2 m', unit:'Nos', q:BAYS.length},
  {k:'trial', item:'Trial room', unit:'Nos', q:TRIAL.length},
  {k:'table', item:'Display table', unit:'Nos', q:TABLES.length},
  {k:'counter', item:'Cash counter, 3.5 m', unit:'Nos', q:1},
  {k:'rack', item:'Backroom rack', unit:'Nos', q:RACKS.length},
  {k:'partition', item:'Partition wall, 3.0 m high', unit:'Sqm', q:fmt1(partArea)},
  {k:'floor', item:'Floor finish', unit:'Sqm', q:fmt1(floorArea)},
  {k:'light', item:'Light point', unit:'Nos', q:LIGHTS.length},
  {k:'conduit', item:'Power conduit', unit:'Rmt', q:fmt1(sumLen(CONDUIT))},
  {k:'duct', item:'HVAC duct', unit:'Rmt', q:fmt1(sumLen(DUCT))},
  {k:'pipe', item:'Plumbing line', unit:'Rmt', q:fmt1(sumLen(PIPE))}
];
const tbody = document.getElementById('boqBody');
tbody.innerHTML = BOQ.map(r => `<tr data-k="${r.k}"><td>${r.item}</td><td>${r.unit}</td><td>${r.q}</td></tr>`).join('');
const rows = [...tbody.querySelectorAll('tr')];
document.getElementById('fileMeta').textContent = `${Math.round(floorArea)} sqm · 24.0 × 16.0 m`;

/* ---------- Scroll to stage ---------- */
const anchors = [...document.querySelectorAll('[data-stage]')];
let pts = [];
function measure() {
  pts = anchors.map((el, i) => {
    const r = el.getBoundingClientRect();
    return { s: +el.dataset.stage, y: i === 0 ? innerHeight * 0.5 : r.top + scrollY + r.height / 2 };
  });
}
function stageFromScroll() {
  if (isAbout) return 8;
  const c = scrollY + innerHeight * 0.5;
  if (c <= pts[0].y) return pts[0].s;
  for (let i = 0; i < pts.length - 1; i++) {
    if (c < pts[i+1].y) return lerp(pts[i].s, pts[i+1].s, (c - pts[i].y) / (pts[i+1].y - pts[i].y));
  }
  return pts[pts.length - 1].s;
}
measure();
addEventListener('load', measure);
route();
document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', measure));

const railLinks = [...document.querySelectorAll('.rail a')];
let lastRail = -1;
const railEl = document.querySelector('.rail'), faqEl = document.getElementById('faq');
function updateRail(s) {
  if (isAbout) return;
  railEl.classList.toggle('off', scrollY + innerHeight * 0.5 > faqEl.offsetTop);
  const r = Math.round(s);
  if (r === lastRail) return; lastRail = r;
  railLinks.forEach(a => a.classList.toggle('on', +a.dataset.r === r));
}

/* ---------- Sakshi simulation ---------- */
const COLS = [-10.4,-4.25,2], ROWS = [-6.15,-2.75,0.75,4.25,6.5];
const pick = a => a[Math.floor(Math.random() * a.length)];
const lp = (cur, t) => [[t[0], cur[1], 0], [t[0], t[1]]];
function shopperRoute() {
  const r = [[0, 6.5, 0.6]];
  if (Math.random() < 0.22) { r.push([0, 9.8, 0]); return { r, bounce: true }; }
  const col = Math.random() < 0.5 ? 2 : -4.25;
  r.push([col, 6.5, 0]); let cur = [col, 6.5];
  const n = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const t = [pick(COLS), pick(ROWS.slice(0, 4))];
    const p = lp(cur, t); r.push(p[0], [p[1][0], p[1][1], 1.2 + Math.random() * 2.8]); cur = t;
  }
  const p = lp(cur, [2, 4.25]);
  r.push(p[0], [2, 4.25, 0], [5.5, 4.25, 2 + Math.random() * 2], [2, 4.25, 0], [2, 6.5, 0], [0, 6.5, 0], [0, 9.8, 0]);
  return { r, bounce: false };
}
function staffRoute(cur) {
  const r = []; let c = cur;
  for (let i = 0; i < 3; i++) { const t = [pick(COLS), pick(ROWS.slice(0, 4))]; const p = lp(c, t); r.push(p[0], [p[1][0], p[1][1], 2 + Math.random() * 3]); c = t; }
  return r;
}
const ZONES = [
  { name: 'back wall bays', r: [-12, -8, 5, -5.6] },
  { name: 'left wall bays', r: [-12, -5.6, -9.6, 8] },
  { name: 'centre gondolas', r: [-9.6, -5.6, 1.2, 5.5] },
  { name: 'display tables', r: [1.2, -5.6, 5, 3.8] }
];
ZONES.forEach(z => z.dwell = 0);
function zoneOf(x, z) { for (const Z of ZONES) { const r = Z.r; if (x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3]) return Z; } return null; }
const agents = [];
for (let i = 0; i < 14; i++) agents.push({ staff: false, active: false, x: 0, z: 9.8, r: [], i: 0, wait: 0 });
agents.push({ staff: true, active: true, x: 2, z: -2.75, r: staffRoute([2, -2.75]), i: 0, wait: 0 });
agents.push({ staff: true, active: true, x: -10.4, z: 0.75, r: staffRoute([-10.4, 0.75]), i: 0, wait: 0 });
const stats = { foot: 0, bounce: 0, exits: 0, dwellSum: 0 };
let simT = 0, nextSpawn = 0;
const DWELL_SCALE = 20;
let heatHook = null;
function simStep(dt) {
  simT += dt; nextSpawn -= dt;
  const inStore = agents.filter(a => a.active && !a.staff).length;
  if (nextSpawn <= 0 && inStore < 12) {
    const a = agents.find(a => !a.active && !a.staff);
    if (a) { const rt = shopperRoute(); Object.assign(a, { active: true, x: 0, z: 9.6, r: rt.r, bounceRoute: rt.bounce, i: 0, wait: 0, t0: simT }); stats.foot++; }
    nextSpawn = 1.4 + Math.random() * 2.2;
  }
  for (const a of agents) {
    if (!a.active) continue;
    if (a.wait > 0) {
      a.wait -= dt;
      if (!a.staff && a.z < 5.5) { const Z = zoneOf(a.x, a.z); if (Z) Z.dwell += dt; }
    } else {
      const tg = a.r[a.i];
      if (!tg) {
        if (a.staff) { const last = a.r[a.r.length - 1]; a.r = staffRoute([last[0], last[1]]); a.i = 0; }
        else { a.active = false; stats.exits++; stats.dwellSum += simT - a.t0; if (a.bounceRoute) stats.bounce++; }
        continue;
      }
      const dx = tg[0] - a.x, dz = tg[1] - a.z, d = Math.hypot(dx, dz), sp = (a.staff ? 1.0 : 1.35) * dt;
      if (d <= sp) { a.x = tg[0]; a.z = tg[1]; a.wait = tg[2] || 0; a.i++; }
      else { a.x += dx / d * sp; a.z += dz / d * sp; }
    }
    if (heatHook && !a.staff && a.z < 8) heatHook(a.x, a.z, a.wait > 0 ? 1.6 : 1);
  }
}
const el = id => document.getElementById(id);
let lowZone = ZONES[0];
function renderStats() {
  el('stIn').textContent = agents.filter(a => a.active && !a.staff).length;
  el('stFoot').textContent = stats.foot;
  const avg = stats.exits ? stats.dwellSum / stats.exits * DWELL_SCALE : 0;
  const secs = Math.round(avg); el('stDwell').textContent = `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, '0')}s`;
  el('stBounce').textContent = stats.exits ? Math.round(stats.bounce / stats.exits * 100) + '%' : '0%';
  const tot = ZONES.reduce((t, z) => t + z.dwell, 0) || 1;
  const sorted = [...ZONES].sort((a, b) => a.dwell - b.dwell);
  lowZone = sorted[0];
  const hi = sorted[sorted.length - 1], pct = z => Math.round(z.dwell / tot * 100);
  el('ddAnswer').textContent = `The ${lowZone.name}. They hold only ${pct(lowZone)}% of browsing time today. The ${hi.name} hold ${pct(hi)}%. Try moving a hero product into the ${lowZone.name} and compare next week. It is highlighted on the floor.`;
}

/* ---------- 3D ---------- */
const canvas = document.getElementById('stage');
let renderer = null;
if (THREE) { try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (e) { renderer = null; } }
if (!renderer) {
  document.documentElement.classList.add('no-webgl');
  for (let i = 0; i < 900; i++) simStep(0.1);
  renderStats();
  setInterval(() => { for (let i = 0; i < 5; i++) simStep(0.1); renderStats(); }, 500);
  addEventListener('scroll', () => updateRail(stageFromScroll()), { passive: true });
  addEventListener('resize', measure);
  return;
}

const BG = 0x02021A;
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(BG, 1);
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(BG, 48, 100);
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300);
scene.add(new THREE.AmbientLight(0xffffff, 0.55));
scene.add(new THREE.HemisphereLight(0x3db8e8, 0x000010, 0.6));
const sun = new THREE.DirectionalLight(0xd6f2ff, 0.9); sun.position.set(12, 26, 14); scene.add(sun);

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const ICE = new THREE.Color(0x9BE7F5), WHITE = new THREE.Color(0xffffff);

const grid = new THREE.GridHelper(96, 96, 0x0c2150, 0x070d2c);
grid.material.transparent = true; grid.material.opacity = 0.75; grid.position.y = -0.02; scene.add(grid);

const M = {
  floor: new THREE.MeshStandardMaterial({ color: 0x050a26, roughness: 0.95, emissive: 0x000000 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x0d1a3c, roughness: 0.8, transparent: true, opacity: 0.45, depthWrite: false }),
  wallE: new THREE.LineBasicMaterial({ color: 0x12A7EE, transparent: true }),
  part: new THREE.MeshStandardMaterial({ color: 0x122248, roughness: 0.8, transparent: true, opacity: 0.45, depthWrite: false, emissive: 0x000000 }),
  partE: new THREE.LineBasicMaterial({ color: 0x12A7EE, transparent: true }),
  plan: new THREE.LineBasicMaterial({ color: 0x28BDDA, transparent: true }),
  dim: new THREE.LineBasicMaterial({ color: 0x9BE7F5, transparent: true }),
  axis: new THREE.LineDashedMaterial({ color: 0x2c4579, dashSize: 0.5, gapSize: 0.35, transparent: true })
};
const fshape = new THREE.Shape(OUT.map(p => new THREE.Vector2(p[0], -p[1])));
const floor = new THREE.Mesh(new THREE.ShapeGeometry(fshape), M.floor);
floor.rotation.x = -Math.PI / 2; scene.add(floor);

const planPos = [];
for (const s of [...WALLS, ...PARTS]) planPos.push(s[0][0], 0.03, s[0][1], s[1][0], 0.03, s[1][1]);
const planGeo = new THREE.BufferGeometry(); planGeo.setAttribute('position', new THREE.Float32BufferAttribute(planPos, 3));
const plan = new THREE.LineSegments(planGeo, M.plan); scene.add(plan);
const planCount = planPos.length / 3;

const wallG = new THREE.Group(); scene.add(wallG);
function wallSeg(a, b, mat, emat) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
  const g = new THREE.BoxGeometry(L + 0.2, H, 0.2);
  const m = new THREE.Mesh(g, mat);
  m.position.set((a[0] + b[0]) / 2, H / 2, (a[1] + b[1]) / 2);
  m.rotation.y = -Math.atan2(dz, dx);
  m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), emat));
  wallG.add(m);
}
WALLS.forEach(s => wallSeg(s[0], s[1], M.wall, M.wallE));
PARTS.forEach(s => wallSeg(s[0], s[1], M.part, M.partE));

const CAT = {};
function cat(k, col, edge) { CAT[k] = { mat: new THREE.MeshStandardMaterial({ color: col, roughness: 0.6, transparent: true, emissive: 0x000000 }), emat: new THREE.LineBasicMaterial({ color: edge, transparent: true }), base: new THREE.Color(edge) }; }
cat('gondola', 0x0f2a5a, 0x12A7EE); cat('bay', 0x0c2148, 0x12A7EE); cat('trial', 0x142650, 0x28BDDA);
cat('table', 0x113060, 0x28BDDA); cat('counter', 0x0f3550, 0x9BE7F5); cat('rack', 0x0f1a38, 0x3d5a8a);
const fixtures = [];
function fixture(k, x, z, w, h, d, rotY) {
  const c = CAT[k], piv = new THREE.Group();
  piv.position.set(x, 0, z); piv.rotation.y = rotY || 0;
  const g = new THREE.BoxGeometry(w, h, d), m = new THREE.Mesh(g, c.mat);
  m.position.y = h / 2; m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), c.emat));
  piv.add(m); scene.add(piv);
  piv.userData.d = clamp((x + 12) / 24, 0, 1);
  fixtures.push(piv);
}
GOND.forEach(p => fixture('gondola', p[0], p[1], 4, 1.6, 1));
BAYS.forEach(p => fixture('bay', p[0], p[1], 1.2, 2.4, 0.6, p[2] ? Math.PI / 2 : 0));
TRIAL.forEach(p => fixture('trial', p[0], p[1], 1.6, 2.4, 1.8));
TABLES.forEach(p => fixture('table', p[0], p[1], 1.6, 0.9, 1.6));
fixture('counter', COUNTER[0], COUNTER[1], 3.5, 1.1, 1);
RACKS.forEach(p => fixture('rack', p[0], p[1], 2.2, 2.2, 0.8));

const sprites = [];
function label(text, color, size, bubble) {
  const c = document.createElement('canvas'), ctx = c.getContext('2d');
  const font = '600 40px "JetBrains Mono", ui-monospace, monospace';
  ctx.font = font;
  const w = bubble ? 64 : Math.ceil(ctx.measureText(text).width) + 20;
  c.width = w; c.height = 64; ctx.font = font;
  if (bubble) { ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(32, 32, 27, 0, Math.PI * 2); ctx.stroke(); }
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, w / 2, 34);
  const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
  s.scale.set(size * w / 64, size, 1); sprites.push(s); return s;
}

const dimG = new THREE.Group(); scene.add(dimG);
function dimLine(a, b, off, text) {
  const A = [a[0] + off[0], a[1] + off[1]], B = [b[0] + off[0], b[1] + off[1]], y = 0.05, p = [];
  const seg = (u, v) => p.push(u[0], y, u[1], v[0], y, v[1]);
  seg(A, B);
  seg(a, [a[0] + off[0] * 1.2, a[1] + off[1] * 1.2]); seg(b, [b[0] + off[0] * 1.2, b[1] + off[1] * 1.2]);
  const t = 0.28; for (const P of [A, B]) seg([P[0] - t, P[1] + t], [P[0] + t, P[1] - t]);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  dimG.add(new THREE.LineSegments(g, M.dim));
  const n = Math.hypot(off[0], off[1]) || 1, s = label(text, '#9BE7F5', 0.9);
  s.position.set((A[0] + B[0]) / 2 + off[0] / n * 0.75, 0.35, (A[1] + B[1]) / 2 + off[1] / n * 0.75);
  dimG.add(s);
}
dimLine([-12, -8], [12, -8], [0, -1.8], '24000');
dimLine([-12, -8], [-12, 8], [-1.8, 0], '16000');
dimLine([-3, 8], [3, 8], [0, 1.8], '6000');
dimLine([8, 4], [12, 4], [0, 1.8], '4000');
dimLine([-4.25, -4], [-4.25, -1.5], [0.001, 0], '2500');
dimLine([-5.5, 4.25], [-3, 4.25], [0, 0.001], '2500');
const axisLabels = ['A', 'B', 'C', 'D', 'E'];
[-12, -6, 0, 6, 12].forEach((x, i) => {
  const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(x, 0.04, -11), V(x, 0.04, 11)]), M.axis); l.computeLineDistances(); dimG.add(l);
  const b = label(axisLabels[i], '#6F8FC0', 1.1, true); b.position.set(x, 0.3, -11.8); dimG.add(b);
});
[-8, 0, 8].forEach((z, i) => {
  const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-15, 0.04, z), V(15, 0.04, z)]), M.axis); l.computeLineDistances(); dimG.add(l);
  const b = label(String(i + 1), '#6F8FC0', 1.1, true); b.position.set(-15.8, 0.3, z); dimG.add(b);
});

const mepG = new THREE.Group(); scene.add(mepG);
const MM = {
  light: new THREE.MeshBasicMaterial({ color: 0xfff2c2, transparent: true }),
  conduit: new THREE.MeshBasicMaterial({ color: 0xFFC53D, transparent: true }),
  duct: new THREE.MeshStandardMaterial({ color: 0x8fa6bf, roughness: 0.5, transparent: true }),
  pipe: new THREE.MeshBasicMaterial({ color: 0x2fd3ff, transparent: true })
};
const MBASE = {}; for (const k in MM) MBASE[k] = MM[k].color.clone();
function pipe(a, b, r, mat) {
  const A = V(...a), B = V(...b), L = A.distanceTo(B);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 8), mat);
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), B.clone().sub(A).normalize());
  mepG.add(m);
}
function hbox(a, b, w, h, mat) {
  const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz);
  const m = new THREE.Mesh(new THREE.BoxGeometry(L + w, h, w), mat);
  m.position.set((a[0] + b[0]) / 2, a[1], (a[2] + b[2]) / 2); m.rotation.y = -Math.atan2(dz, dx); mepG.add(m);
}
LIGHTS.forEach(p => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.6), MM.light); m.position.set(p[0], 2.99, p[1]); mepG.add(m); });
CONDUIT.forEach(s => pipe(s[0], s[1], 0.045, MM.conduit));
{ const db = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.6), MM.conduit); db.position.set(4.82, 1.5, -6); mepG.add(db); }
DUCT.forEach((s, i) => hbox(s[0], s[1], i < 2 ? 0.7 : 0.45, i < 2 ? 0.4 : 0.3, MM.duct));
for (const x of [-9, -4, 1]) for (const z of [-5.5, 4.5]) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.7), MM.duct); d.position.set(x, YD - 0.2, z); mepG.add(d); }
{ const ahu = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1.4), MM.duct); ahu.position.set(8, 2.3, -6); mepG.add(ahu); }
PIPE.forEach(s => pipe(s[0], s[1], 0.06, MM.pipe));
{ const sink = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.6), MM.pipe); sink.position.set(11.4, 0.45, -5.2); mepG.add(sink); }

const sakG = new THREE.Group(); scene.add(sakG);
const SM = {
  cone: new THREE.MeshBasicMaterial({ color: 0x12A7EE, transparent: true, opacity: 0.09, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
  cam: new THREE.MeshStandardMaterial({ color: 0x08112e, transparent: true }),
  camE: new THREE.LineBasicMaterial({ color: 0x28BDDA, transparent: true })
};
const CAMS = [[-11.75, 2.8, -7.75, -5, -1], [-11.75, 2.8, 7.75, -6, 2.5], [11.75, 2.8, 3.75, 6, -1], [3.2, 2.8, 7.75, 0, 5.5], [7.75, 2.8, 7.75, 5.5, 4.3], [11.75, 2.8, -7.75, 8.5, -5.8]];
CAMS.forEach(c => {
  const P = V(c[0], c[1], c[2]), T = V(c[3], 0, c[4]);
  const g = new THREE.BoxGeometry(0.35, 0.25, 0.55), body = new THREE.Mesh(g, SM.cam);
  body.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), SM.camE));
  body.position.copy(P); body.lookAt(T); sakG.add(body);
  const h = P.distanceTo(T), cg = new THREE.ConeGeometry(h * 0.42, h, 28, 1, true); cg.translate(0, -h / 2, 0);
  const cone = new THREE.Mesh(cg, SM.cone); cone.position.copy(P);
  cone.quaternion.setFromUnitVectors(V(0, -1, 0), T.clone().sub(P).normalize()); sakG.add(cone);
});
const personMats = [];
function makePerson(col) {
  const g = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: col, transparent: true }), em = new THREE.LineBasicMaterial({ color: col, transparent: true });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.95, 10), mat); body.position.y = 0.5;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), mat); head.position.y = 1.17;
  const bx = new THREE.BoxGeometry(0.8, 1.55, 0.8), box = new THREE.LineSegments(new THREE.EdgesGeometry(bx), em); box.position.y = 0.78;
  g.add(body, head, box); sakG.add(g); personMats.push(mat, em); return g;
}
agents.forEach(a => { a.mesh = makePerson(a.staff ? 0xffffff : 0x9BE7F5); });

const HW = 192, HH = 128, PPM = 8;
const acc = document.createElement('canvas'); acc.width = HW; acc.height = HH;
const actx = acc.getContext('2d'); actx.fillStyle = '#000'; actx.fillRect(0, 0, HW, HH);
const out = document.createElement('canvas'); out.width = HW; out.height = HH;
const octx = out.getContext('2d');
const blob = document.createElement('canvas'); blob.width = blob.height = 28;
{ const b = blob.getContext('2d'), gr = b.createRadialGradient(14, 14, 0, 14, 14, 14); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); b.fillStyle = gr; b.fillRect(0, 0, 28, 28); }
const LUT = new Uint8ClampedArray(256 * 4);
for (let i = 0; i < 256; i++) {
  const v = i / 255, t = sm(0.3, 0.9, v);
  LUT[i*4] = lerp(18, 190, t); LUT[i*4+1] = lerp(120, 245, t); LUT[i*4+2] = lerp(238, 250, t);
  LUT[i*4+3] = Math.min(200, v * 1.4 * 200);
}
heatHook = (x, z, w) => {
  actx.globalCompositeOperation = 'lighter'; actx.globalAlpha = 0.012 * w;
  actx.drawImage(blob, (x + 12) * PPM - 14, (z + 8) * PPM - 14);
  actx.globalAlpha = 1; actx.globalCompositeOperation = 'source-over';
};
const heatTex = new THREE.CanvasTexture(out);
function colorize() {
  const src = actx.getImageData(0, 0, HW, HH).data, img = octx.createImageData(HW, HH), d = img.data;
  for (let i = 0; i < src.length; i += 4) { const v = src[i] * 4; d[i] = LUT[v]; d[i+1] = LUT[v+1]; d[i+2] = LUT[v+2]; d[i+3] = LUT[v+3]; }
  octx.putImageData(img, 0, 0); heatTex.needsUpdate = true;
}
function fadeHeat() { actx.fillStyle = 'rgba(0,0,0,0.06)'; actx.fillRect(0, 0, HW, HH); }
const heatMat = new THREE.MeshBasicMaterial({ map: heatTex, transparent: true, depthWrite: false });
const heat = new THREE.Mesh(new THREE.PlaneGeometry(24, 16), heatMat);
heat.rotation.x = -Math.PI / 2; heat.position.y = 0.03; sakG.add(heat);

/* DataDime zone highlight */
const zoneFill = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
const zoneEdge = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
ZONES.forEach(Z => {
  const [x0, z0, x1, z1] = Z.r, g = new THREE.Group();
  const p = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), zoneFill); p.rotation.x = -Math.PI / 2; g.add(p);
  const e = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([V(x0 - (x0+x1)/2, 0, z0 - (z0+z1)/2), V(x1 - (x0+x1)/2, 0, z0 - (z0+z1)/2), V(x1 - (x0+x1)/2, 0, z1 - (z0+z1)/2), V(x0 - (x0+x1)/2, 0, z1 - (z0+z1)/2)]), zoneEdge); g.add(e);
  g.position.set((x0 + x1) / 2, 0.06, (z0 + z1) / 2); g.visible = false; scene.add(g); Z.mesh = g;
});

for (let i = 0; i < 900; i++) { simStep(0.1); if (i % 40 === 0) fadeHeat(); }
colorize(); renderStats();

/* ---------- Camera path ---------- */
const K = [
  { p: [24, 19, 26], t: [0, 0, 0] },
  { p: [0.01, 34, 9], t: [0, 0, 0.5] },
  { p: [-22, 15, 22], t: [0, 0.5, 0] },
  { p: [0.01, 36, 14], t: [0, 0, 0] },
  { p: [19, 10, 17], t: [0, 2, 0] },
  { p: [24, 17, 6], t: [0, 0, 0] },
  { p: [-17, 14, 21], t: [0, 0, 1.5] },
  { p: [4, 30, 18], t: [-1, 0, 0] },
  { p: [25, 24, 25], t: [0, 0, 0] }
];
const camP = V(), camT = V(), tmpA = V(), tmpB = V();
let distMul = 1;
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const mobile = w <= 900;
  camera.fov = camera.aspect < 1 ? Math.min(72, 40 / (camera.aspect * 1.05)) : 40;
  distMul = mobile ? 1.1 : 1;
  if (mobile) camera.setViewOffset(w, h, 0, h * 0.2, w, h);
  else camera.setViewOffset(w, h, -w * 0.19, 0, w, h);
  camera.updateProjectionMatrix();
  measure();
}
resize(); addEventListener('resize', resize);

let mx = 0, my = 0, pmx = 0, pmy = 0;
if (!reduce) addEventListener('pointermove', e => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; }, { passive: true });

/* ---------- Loop ---------- */
const clock = new THREE.Clock();
let sCur = stageFromScroll(), t0 = 0, frame = 0, statT = 0, lastHL = -2;
function setHL(k, h) {
  if (CAT[k]) { CAT[k].mat.emissive.setRGB(0.04 * h, 0.22 * h, 0.3 * h); CAT[k].emat.color.copy(CAT[k].base).lerp(WHITE, h); }
  else if (k === 'partition') M.part.emissive.setRGB(0.04 * h, 0.22 * h, 0.3 * h);
  else if (k === 'floor') M.floor.emissive.setRGB(0.0, 0.08 * h, 0.16 * h);
  else if (MM[k]) MM[k].color.copy(MBASE[k]).lerp(WHITE, 0.65 * h);
}
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05); t0 += dt; frame++;
  const sT = stageFromScroll();
  sCur = reduce ? sT : sCur + (sT - sCur) * Math.min(1, dt * 5);
  const s = sCur;
  updateRail(s);

  const intro = reduce ? 1 : clamp(t0 / 2.6, 0, 1);
  const wHero = 1 - sm(0.35, 0.95, s);
  const wBuild = sm(1.35, 2.1, s);
  const wWalls = Math.max(wHero * sm(0.05, 0.45, intro), wBuild);
  const wFixB = sm(1.6, 2.45, s);
  const wDims = bump(2.45, 2.95, 3.55, 4.0, s);
  const wMep = bump(3.45, 3.95, 5.4, 5.85, s);
  const wBoq = bump(4.45, 4.95, 5.4, 5.85, s);
  const wSak = sm(5.4, 5.95, s);
  const wZone = bump(6.45, 6.95, 7.45, 7.9, s);

  plan.geometry.setDrawRange(0, reduce ? planCount : Math.floor(clamp(t0 / 1.6, 0, 1) * planCount / 2) * 2);
  M.plan.opacity = 1 - 0.6 * wWalls;

  wallG.scale.y = Math.max(0.001, wWalls); wallG.visible = wWalls > 0.005;
  M.wall.opacity = M.part.opacity = wWalls * (0.42 - 0.3 * Math.max(wMep, wZone));
  M.wallE.opacity = M.partE.opacity = wWalls * (0.9 - 0.5 * wMep);

  const heroF = sm(0.4, 1, intro) * wHero;
  for (const f of fixtures) {
    const d = f.userData.d;
    const k = Math.max(clamp(heroF * 1.5 - 0.5 * d, 0, 1), clamp(wFixB * 1.5 - 0.5 * d, 0, 1));
    const e = 1 - Math.pow(1 - k, 3);
    f.scale.y = Math.max(0.001, e); f.visible = k > 0.005;
  }
  const fo = 0.92 - 0.55 * wMep - 0.35 * wDims - 0.15 * wSak - 0.2 * wZone;
  for (const k in CAT) { CAT[k].mat.opacity = fo; CAT[k].emat.opacity = Math.min(1, fo + 0.1); }

  dimG.visible = wDims > 0.005;
  M.dim.opacity = wDims; M.axis.opacity = wDims * 0.9;
  for (const sp of sprites) sp.material.opacity = wDims;

  mepG.visible = wMep > 0.005;
  MM.light.opacity = wMep; MM.conduit.opacity = 0.95 * wMep; MM.duct.opacity = 0.6 * wMep; MM.pipe.opacity = wMep;

  const idx = wBoq > 0.3 ? Math.floor(t0 / 1.4) % BOQ.length : -1;
  BOQ.forEach((r, i) => setHL(r.k, i === idx ? wBoq : 0));
  if (idx !== lastHL) { rows.forEach((tr, i) => tr.classList.toggle('on', i === idx)); lastHL = idx; }

  simStep(dt);
  sakG.visible = wSak > 0.005;
  SM.cone.opacity = 0.09 * wSak * (1 - 0.6 * wZone); SM.cam.opacity = wSak; SM.camE.opacity = wSak;
  for (const m of personMats) m.opacity = wSak;
  heatMat.opacity = wSak * (0.8 - 0.25 * wZone);
  for (const a of agents) { a.mesh.visible = a.active && a.z < 9.4; a.mesh.position.set(a.x, 0, a.z); }
  if (frame % 12 === 0) colorize();
  if (frame % 50 === 0) fadeHeat();
  statT += dt; if (statT > 0.5) { statT = 0; renderStats(); }

  const pulse = 0.75 + 0.25 * Math.sin(t0 * 3);
  ZONES.forEach(Z => { Z.mesh.visible = wZone > 0.005 && Z === lowZone; });
  zoneFill.opacity = 0.16 * wZone * pulse; zoneEdge.opacity = wZone;

  const i = clamp(Math.floor(s), 0, K.length - 2), f = s - i, e = f * f * (3 - 2 * f);
  camP.set(...K[i].p).lerp(tmpA.set(...K[i + 1].p), e);
  camT.set(...K[i].t).lerp(tmpB.set(...K[i + 1].t), e);
  const sway = reduce ? 0 : Math.sin(t0 * 0.18) * 0.32 * Math.max(wHero, sm(7.5, 8.2, s));
  if (sway) {
    const dx = camP.x - camT.x, dz = camP.z - camT.z, c = Math.cos(sway), sn = Math.sin(sway);
    camP.x = camT.x + dx * c - dz * sn; camP.z = camT.z + dx * sn + dz * c;
  }
  camP.sub(camT).multiplyScalar(distMul).add(camT);
  pmx += (mx - pmx) * 0.05; pmy += (my - pmy) * 0.05;
  camP.x += pmx * 1.4; camP.y += -pmy * 1.0;
  camera.position.copy(camP); camera.lookAt(camT);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
})();
