/**
 * Backend for the ThinkNeural.ai enquiry form (Google Apps Script web app).
 *
 * Setup:
 *  1. Create a Google Sheet; Extensions > Apps Script; paste this file.
 *  2. Project Settings > Script properties: add TURNSTILE_SECRET (Cloudflare secret key).
 *     Optional: NOTIFY_TO (default sales@tneuralai.com).
 *  3. Deploy > New deployment > Web app: Execute as "Me", access "Anyone".
 *  4. Put the /exec URL in VITE_ENQUIRY_ENDPOINT and rebuild the site.
 */
var COLUMNS = ['submitted_at', 'submitted_at_ist', 'submission_id', 'name', 'email', 'phone', 'company', 'designation',
  'product', 'industry', 'locations', 'timeline', 'requirement',
  'sz_new_stores_per_year', 'sz_design_team', 'sz_automate',
  'sk_cameras_per_location', 'sk_existing_cctv', 'sk_monitor', 'sk_deployment',
  'dd_data_type', 'dd_tools', 'dd_goal',
  'source_campaign', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid',
  'page_url', 'referrer', 'consent'];

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var p = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();

    if (!p.name || !p.company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email || '') || !p.product || p.consent !== true) {
      return json_({ ok: false, error: 'invalid' });
    }

    var secret = props.getProperty('TURNSTILE_SECRET');
    if (secret) {
      var r = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'post', payload: { secret: secret, response: p.turnstile_token || '' }, muteHttpExceptions: true });
      if (!JSON.parse(r.getContentText()).success) return json_({ ok: false, error: 'captcha' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

    // De-duplicate retries / double submits by submission_id
    var ids = sheet.getLastRow() > 1 ? sheet.getRange(2, COLUMNS.indexOf('submission_id') + 1, sheet.getLastRow() - 1, 1).getValues() : [];
    for (var i = 0; i < ids.length; i++) if (ids[i][0] === p.submission_id) return json_({ ok: true, duplicate: true });

    sheet.appendRow(COLUMNS.map(function (c) {
      var v = p[c] == null ? '' : String(p[c]);
      return /^[=+\-@]/.test(v) ? "'" + v : v;   // neutralise spreadsheet formulas
    }));

    var lines = COLUMNS.filter(function (c) { return p[c]; }).map(function (c) { return c + ': ' + p[c]; });
    MailApp.sendEmail({
      to: props.getProperty('NOTIFY_TO') || 'sales@tneuralai.com',
      replyTo: p.email,
      subject: 'New enquiry: ' + p.company + ' · ' + p.product + ' · ' + (p.timeline || 'timeline n/a'),
      body: lines.join('\n')
    });
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
