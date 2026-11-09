// Optional GA4 + Meta Pixel. Nothing loads unless the IDs are set in env AND the visitor accepts.
const GA = import.meta.env.VITE_GA_ID;
const PX = import.meta.env.VITE_META_PIXEL_ID;
const KEY = 'tn-consent';
let on = false;

const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
const write = v => { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } };

function load() {
  if (on || (!GA && !PX)) return;
  on = true;
  if (GA) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA);
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA);
    document.head.appendChild(s);
  }
  if (PX) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PX);
    window.fbq('track', 'PageView');
  }
}

function banner() {
  const el = document.createElement('div');
  el.className = 'consent-bar';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Cookie consent');
  el.innerHTML = '<p>We use analytics cookies to understand which campaigns bring visitors. See our <a href="#cookies-policy">Cookies Policy</a>.</p><div><button type="button" class="btn btn-ghost" data-v="no">Decline</button><button type="button" class="btn btn-primary" data-v="yes">Accept</button></div>';
  el.addEventListener('click', e => {
    const v = e.target.closest('button')?.dataset.v;
    if (!v) return;
    write(v); el.remove();
    if (v === 'yes') load();
  });
  document.body.appendChild(el);
}

if (GA || PX) { const c = read(); if (c === 'yes') load(); else if (!c) banner(); }

/** Fire the lead conversion events (no-ops unless consent was given and IDs are set). */
export function trackLead(product) {
  try {
    if (window.gtag) window.gtag('event', 'generate_lead', { product });
    if (window.fbq) window.fbq('track', 'Lead', { content_name: product });
  } catch (e) { /* tracking must never break the form */ }
}
