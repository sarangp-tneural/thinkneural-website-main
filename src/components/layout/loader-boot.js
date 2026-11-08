(function () {
  var d = document.documentElement, h = location.hash.slice(1), p = location.pathname, seen = 0;
  /* other pages (not the 3D home) get the short loader; a repeat visit in this session gets the fast one */
  var other = /^(about|events|instore-asia|ksum|huddle|secufest|careers|internships|apply|openings|privacy-policy|platform-licence-agreement|content-rules|cookies-policy|copyright-policy|blog(\/.*)?)$/.test(h) || /^\/blog/.test(p);
  try { seen = sessionStorage.getItem('tn-ld') ? 1 : 0; } catch (e) {}
  /* a reload / hard reload plays the full animation; only a fresh visit in the same session gets the fast one */
  try { if ((performance.getEntriesByType('navigation')[0] || {}).type === 'reload') seen = 0; } catch (e) {}
  d.classList.add('is-loading');
  if (other) d.classList.add('ld-short');
  if (seen) d.classList.add('ld-fast');
  /* failsafe if the JS bundle never boots: never leave the visitor behind the overlay */
  setTimeout(function () {
    if (window.__tnLd) return;
    d.classList.remove('is-loading');
    var l = document.getElementById('loader'); if (l) l.remove();
  }, 12000);
})();
