// Multi-step enterprise enquiry form (#demoForm). Every answer is sent through EmailJS to the
// mailbox set on the EmailJS template.
import { trackLead } from './analytics.js';

const EJS = { service: import.meta.env.VITE_EMAILJS_SERVICE_ID, template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID, key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY };
const SALES = 'sales@tneuralai.com';
const STEPS = ['About you', 'Choose product', 'Submit'];

const form = document.getElementById('demoForm');
if (form) init();

function init() {
  const $ = id => document.getElementById(id);
  const steps = [...form.querySelectorAll('.fstep')];
  const err = $('formErr'), back = $('fBack'), next = $('fNext'), submit = $('fSubmit');
  let cur = 0, lastBody = '', sending = false;
  const submissionId = (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2));

  /* ---- first-touch attribution (UTMs survive navigation within the session) ---- */
  const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  const attribution = (() => {
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem('tn-utm') || '{}'); } catch (e) {}
    const q = new URLSearchParams(location.search);
    const fresh = {};
    UTM.forEach(k => { const v = q.get(k); if (v) fresh[k] = v.slice(0, 200); });
    if (Object.keys(fresh).length && !Object.keys(saved).length) {
      saved = fresh;
      try { sessionStorage.setItem('tn-utm', JSON.stringify(saved)); } catch (e) {}
    }
    return saved;
  })();

  /* ---- step navigation ---- */
  function show(n) {
    cur = n;
    steps.forEach((s, i) => { s.hidden = i !== n; });
    back.hidden = n === 0;
    next.hidden = n === steps.length - 1;
    submit.hidden = n !== steps.length - 1;
    form.querySelectorAll('.stepper li').forEach((li, i) => {
      li.classList.toggle('done', i < n);
      li.classList.toggle('now', i === n);
      if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    $('fStepLabel').textContent = `Step ${n + 1} of ${steps.length}: ${STEPS[n]}`;
    err.textContent = '';
  }

  /* ---- validation ---- */
  const bad = (el, msg) => { el.setAttribute('aria-invalid', 'true'); err.textContent = msg; el.focus(); return false; };
  const clear = () => form.querySelectorAll('[aria-invalid]').forEach(e => e.removeAttribute('aria-invalid'));
  function validate(n) {
    clear(); err.textContent = '';
    if (n === 0) {
      if (!$('fName').value.trim()) return bad($('fName'), 'Please enter your full name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('fEmail').value.trim())) return bad($('fEmail'), 'Please enter a valid business email.');
      const digits = $('fPhone').value.replace(/[\s\-().]/g, '');
      if (!/^\d{7,14}$/.test(digits)) return bad($('fPhone'), 'Please enter a valid phone number (digits only, without the country code).');
      if (!$('fCompany').value.trim()) return bad($('fCompany'), 'Please enter your company name.');
    }
    if (n === 1 && !form.querySelector('input[name="product"]:checked')) {
      err.textContent = 'Please choose the solution you are interested in.';
      form.querySelector('input[name="product"]').focus();
      return false;
    }
    if (n === 2) {
      if (!$('fConsent').checked) return bad($('fConsent'), 'Please accept the privacy consent to continue.');
    }
    return true;
  }
  next.addEventListener('click', () => { if (validate(cur)) { show(cur + 1); form.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } });
  back.addEventListener('click', () => show(cur - 1));
  form.addEventListener('input', e => { if (e.target.hasAttribute('aria-invalid')) e.target.removeAttribute('aria-invalid'); });
  form.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox' && cur < steps.length - 1) { e.preventDefault(); next.click(); } });

  /* ---- conditional questions ---- */
  form.querySelectorAll('input[name="product"]').forEach(r => r.addEventListener('change', () => {
    const key = r.dataset.key;
    form.querySelectorAll('.cond').forEach(c => {
      const on = c.dataset.cond === key;
      c.hidden = !on;
      if (!on) c.querySelectorAll('input,select').forEach(f => { if (f.type === 'radio' || f.type === 'checkbox') f.checked = false; else f.value = ''; });
    });
  }));

  /* ---- payload ---- */
  function collect() {
    const fd = new FormData(form);
    const d = Object.fromEntries(fd);
    const now = new Date();
    const ist = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' }).format(now);
    return {
      submission_id: submissionId,
      submitted_at: now.toISOString(),
      submitted_at_ist: ist,
      name: d.name.trim(), email: d.email.trim(),
      phone: `${d.country_code} ${d.phone.trim()}`,
      company: d.company.trim(), designation: d.designation || '',
      product: d.product || '', industry: d.industry || '', locations: d.locations || '',
      requirement: (d.requirement || '').trim(), timeline: d.timeline || '',
      sz_new_stores_per_year: d.sz_new_stores_per_year || '', sz_design_team: d.sz_design_team || '', sz_automate: fd.getAll('sz_automate').join(', '),
      sk_cameras_per_location: d.sk_cameras_per_location || '', sk_existing_cctv: d.sk_existing_cctv || '', sk_monitor: fd.getAll('sk_monitor').join(', '), sk_deployment: d.sk_deployment || '',
      dd_data_type: d.dd_data_type || '', dd_tools: d.dd_tools || '', dd_goal: fd.getAll('dd_goal').join(', '),
      consent: true,
      source_campaign: attribution.utm_campaign || attribution.utm_source || 'direct',
      ...Object.fromEntries(UTM.map(k => [k, attribution[k] || ''])),
      page_url: location.href.slice(0, 500), referrer: (document.referrer || '').slice(0, 500),
    };
  }
  const bodyText = p => [
    ['Name', p.name], ['Business email', p.email], ['Phone', p.phone], ['Company', p.company], ['Designation', p.designation],
    ['Product', p.product], ['Industry', p.industry], ['Locations', p.locations], ['Timeline', p.timeline],
    ['SpaceZap: new stores/yr', p.sz_new_stores_per_year], ['SpaceZap: design team', p.sz_design_team], ['SpaceZap: automate', p.sz_automate],
    ['Sakshi: cameras/location', p.sk_cameras_per_location], ['Sakshi: existing CCTV', p.sk_existing_cctv], ['Sakshi: monitor', p.sk_monitor], ['Sakshi: deployment', p.sk_deployment],
    ['DataDime: data type', p.dd_data_type], ['DataDime: tools', p.dd_tools], ['DataDime: goal', p.dd_goal],
    ['Source campaign', p.source_campaign],
  ].filter(r => r[1]).map(r => `${r[0]}: ${r[1]}`).join('\n') + `\n\nRequirement:\n${p.requirement || '-'}`;

  /* EmailJS template variables. The first six keep the names the original template used;
     {{details}} is a ready-made list of only the questions this visitor answered. */
  const params = p => ({
    'full-name': p.name, 'work-email': p.email, phone: p.phone, company: p.company,
    'company-size': p.locations, 'help-message': p.requirement || '-',
    designation: p.designation, product: p.product, industry: p.industry, locations: p.locations, timeline: p.timeline,
    sz_new_stores_per_year: p.sz_new_stores_per_year, sz_design_team: p.sz_design_team, sz_automate: p.sz_automate,
    sk_cameras_per_location: p.sk_cameras_per_location, sk_existing_cctv: p.sk_existing_cctv, sk_monitor: p.sk_monitor, sk_deployment: p.sk_deployment,
    dd_data_type: p.dd_data_type, dd_tools: p.dd_tools, dd_goal: p.dd_goal,
    source_campaign: p.source_campaign, utm_source: p.utm_source, utm_medium: p.utm_medium, utm_campaign: p.utm_campaign, utm_term: p.utm_term, utm_content: p.utm_content,
    gclid: p.gclid, fbclid: p.fbclid, submitted_at_ist: p.submitted_at_ist, page_url: p.page_url, referrer: p.referrer,
    details: bodyText(p),
  });

  const showFallback = (msg, p) => {
    lastBody = bodyText(p);
    $('mailLink').href = `mailto:${SALES}?subject=${encodeURIComponent('Consultation request: ' + p.company)}&body=${encodeURIComponent(lastBody)}`;
    $('formMsgText').textContent = msg;
    $('formMsg').classList.add('on');
  };

  /* ---- submit ---- */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (sending || submit.disabled) return;           // never submit twice
    for (let i = 0; i < steps.length; i++) if (!validate(i)) { show(i); validate(i); return; }
    if ($('fWebsite').value) return;                   // honeypot
    $('formMsg').classList.remove('on');
    const p = collect();
    if (!EJS.service || !EJS.template || !EJS.key) { showFallback('Online sending is not set up yet. Send it by email instead.', p); return; }
    const label = submit.textContent;
    sending = true; submit.disabled = true; submit.textContent = 'Sending…'; form.setAttribute('aria-busy', 'true');
    try {
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.send(EJS.service, EJS.template, params(p), { publicKey: EJS.key });
      trackLead(p.product);
      form.querySelectorAll('.fstep,#fNav,#fSteps,.fnote,#formErr').forEach(el => { el.hidden = true; });
      form.reset();
      const ok = $('formOk'); ok.classList.add('on'); ok.focus();
      sending = true;                                   // stays locked after success
    } catch (x) {
      console.error('Enquiry error:', x);
      err.textContent = 'Something went wrong, so your enquiry was not sent.';
      showFallback('You can send the same details by email instead.', p);
      sending = false; submit.disabled = false; submit.textContent = label;
    } finally {
      form.removeAttribute('aria-busy');
    }
  });
  $('copyBtn').addEventListener('click', async e => {
    try { await navigator.clipboard.writeText(`To: ${SALES}\n\n${lastBody}`); e.target.textContent = 'Copied'; }
    catch (x) { e.target.textContent = 'Copy blocked. Select and copy manually'; }
  });

  show(0);
}
