# ThinkNeural.ai website

Marketing site for ThinkNeural.ai (SpaceZap, Sakshi, DataDime). A scroll-driven 3D retail store (three.js) sits behind the home story; About, Events, Careers, Policies and Blog are in-page views switched by the URL hash.

Stack: [Vite](https://vite.dev) + vanilla JS + [three.js](https://threejs.org) `0.128.0` (pinned; newer versions change lighting and colour handling). No framework.

## Getting started

```bash
npm install
npm run dev       # dev server with reload on component edits
npm run build     # production build to dist/
npm run preview   # serve dist/ locally
```

Requires Node 20+.

## Project structure

```
index.html                  page shell: head, canvas, <main> views, @include lines
vite.config.js              htmlInclude plugin + blogSeo plugin
public/                     static files served as-is
  img/                      images, by use: brand, clients, culture, careers, events/<event>
  favicon.ico, favicon-32.png, apple-touch-icon.png
src/
  main.js                   three.js scene, scroll logic, hash router, blog UI
  style.css                 all styles
  components/               HTML partials, one file per section
    layout/                 nav, rail, footer
    home/                   hero, spacezap, furniture, gfc, mep, boq, sakshi, datadime,
                            platform, faq, contact, blog (teaser band)
    about/  events/  careers/  policies/  blog/
  blog/
    posts.js                POSTS array (order, featured, read time, launch date)
    content/*.js            the 20 article bodies (plain data)
    render.js               markup helpers shared by the browser and the build
```

### HTML components
`index.html` pulls partials in with `<!-- @include path/to/file.html -->` (paths relative to `src/components`). The `htmlInclude` plugin in `vite.config.js` expands them in dev and build; includes can be nested. To add a section, create a file and add an include line.

### Pages and routing
Each page is a `<main id="…View">`; `route()` in `src/main.js` reads `location.hash` and toggles an `is-*` class on `<html>` (`is-about`, `is-events`, `is-careers`, `is-policies`, `is-blog`). CSS shows the matching view and hides the 3D home story.

| Hash | View |
|---|---|
| `#home`, `#spacezap`, `#sakshi`, `#datadime`, `#faq`, `#contact` | home story (scrolls to section) |
| `#about` | About |
| `#events`, `#instore-asia`, `#ksum`, `#huddle`, `#secufest` | Events |
| `#careers`, `#internships`, `#apply`, `#openings` | Careers |
| `#privacy-policy`, `#platform-licence-agreement`, `#content-rules`, `#cookies-policy`, `#copyright-policy` | one policy per page |
| `#blog`, `#blog/<slug>` | blog listing / article |

To add a hash page: add a `<main>` view, add its ids to the route list in `route()`, and add the `.is-x` CSS rules (copy the Careers block).

## Blog

- Articles live in `src/blog/content/*.js` (`slug, title, category, product, excerpt, description, body`); `src/blog/posts.js` sets order, the 3 featured posts shown on the home page, and computes read time.
- Listing has client-side category filters; articles show a demo CTA and 3 related posts.
- **SEO:** on build, the `blogSeo` plugin writes real pages `dist/blog/index.html` and `dist/blog/<slug>/index.html` (unique title, description, canonical, Open Graph, JSON-LD, article markup in the HTML), plus `sitemap.xml` and `robots.txt`.
- Set the production origin in `SITE` (top of `blogSeo` in `vite.config.js`, currently `https://thinkneural.ai`) and the published date in `PUBLISHED` (`src/blog/posts.js`).
- Content rules: only the site's own figures (1,000+ stores, 10,000+ cameras, 1,000+ hours saved) as facts; no invented clients, quotes or studies.

## Deploying

Serve `dist/` as static files. Directory URLs like `/blog/<slug>/` must resolve to their `index.html` (default on most static hosts).

## Notes

- Policy pages: the Privacy Policy is final; the other four are placeholders until their text is decided.
- Enquiry form (`#contact`, `src/enquiry.js`): a 3-step form that POSTs to a Google Apps Script web app (`docs/enquiry-apps-script.gs`), which appends a Google Sheet row and emails sales@tneuralai.com. Set `VITE_ENQUIRY_ENDPOINT` (Apps Script `/exec` URL) and `VITE_TURNSTILE_SITE_KEY` in `.env.local`; unset = mailto fallback. `VITE_GA_ID` / `VITE_META_PIXEL_ID` enable GA4 / Meta Pixel after the visitor accepts cookies (`src/analytics.js`). UTM parameters are captured into the sheet.
- FAQ assistant: a floating chat widget (`src/components/layout/faqbot.html`, `src/faqbot.js`) that embeds the hosted FAQ bot in an iframe. Set `VITE_FAQBOT_URL` in `.env.local` to the bot's full URL; if unset or unreachable it shows a contact fallback. The host must allow framing that origin.


## Typography (Thinkneural Typography Brief)

One font (Plus Jakarta Sans 400-800), one scale. Geist Mono 500 is only for tiny technical labels (file names, numbers).
The scale lives at the top of `src/style.css` as Tailwind utilities: `tn-display`, `tn-h1`, `tn-h2`, `tn-stat`, `tn-h3`,
`tn-eyebrow`, `tn-lead`, `tn-body`, `tn-body-sm`, `tn-nav`, `tn-btn`, `tn-label`, `tn-input`, `tn-small`, `tn-mono`.
Use them (or `@apply` them in a semantic class). Never add a raw `font-size`; if a style does not fit a row, ask first.
Logo: use the files in `public/img/brand/`, never the name typed as text.
