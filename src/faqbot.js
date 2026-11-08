// Floating FAQ assistant. Answers come from the hosted bot loaded in the iframe
// (VITE_FAQBOT_URL); if it is unset or does not load, a fallback card is shown.
const URL_ = (import.meta.env.VITE_FAQBOT_URL || '').trim();
const launcher = document.getElementById('faqLauncher');
const panel = document.getElementById('faqPanel');
const frame = document.getElementById('faqFrame');
const loading = document.getElementById('faqLoading');
const off = document.getElementById('faqOff');
let loaded = false, timer = 0;

function showOff() { clearTimeout(timer); loading.hidden = true; frame.hidden = true; off.hidden = false; }
function load() {
  if (loaded) return;
  loaded = true;
  if (!URL_) return showOff();
  frame.addEventListener('load', () => { clearTimeout(timer); loading.hidden = true; });
  timer = setTimeout(showOff, 10000);
  frame.src = URL_;
}
function setOpen(open, restore = true) {
  panel.classList.toggle('open', open);
  panel.inert = !open;
  launcher.setAttribute('aria-expanded', String(open));
  launcher.classList.toggle('hide', open);
  if (!open) panel.classList.remove('is-full');
  if (open) { load(); panel.querySelector('#faqMin').focus(); }
  else if (restore) launcher.focus();
}
launcher.addEventListener('click', () => setOpen(true));
document.getElementById('faqMin').addEventListener('click', () => setOpen(false));
document.getElementById('faqClose').addEventListener('click', () => setOpen(false));
panel.querySelectorAll('[data-faq-close]').forEach(a => a.addEventListener('click', () => setOpen(false, false)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
});

let origin = '';
try { origin = new URL(URL_).origin; } catch {}
window.addEventListener('message', e => {
  if (!origin || e.origin !== origin || !e.data || e.data.source !== 'faqbot-widget') return;
  if (e.data.type === 'faqbot:fullscreen') panel.classList.add('is-full');
  else if (e.data.type === 'faqbot:restore') panel.classList.remove('is-full');
});
