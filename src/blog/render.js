// Markup helpers shared by the browser (src/main.js) and the build-time SEO plugin (vite.config.js).
import { POSTS } from './posts.js';

export const CATEGORIES = ['SpaceZap', 'Sakshi', 'DataDime', 'Retail', 'Banking', 'Platform'];
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function cardHTML(p) {
  return `<article class="bcard" data-cat="${esc(p.category)}">
  <div class="bstrip" aria-hidden="true"></div>
  <div class="bbody">
    <span class="btag">${esc(p.category)}</span>
    <h3><a class="blink" href="#blog/${p.slug}">${esc(p.title)}</a></h3>
    <p>${esc(p.excerpt)}</p>
    <div class="bmeta"><span>${esc(p.readTime)}</span><span class="bmore">Read article →</span></div>
  </div>
</article>`;
}

export function gridHTML(posts) {
  return posts.map(cardHTML).join('\n');
}

export function chipsHTML(active = 'All') {
  const chip = (c, n) => `<button type="button" class="chip" data-filter="${c}" aria-pressed="${c === active}">${c} <span>${n}</span></button>`;
  return chip('All', POSTS.length) + CATEGORIES.map((c) => chip(c, POSTS.filter((p) => p.category === c).length)).join('');
}

// 3 posts from the same category; topped up from the same product, then the rest, when a category is small.
export function relatedPosts(post) {
  const others = POSTS.filter((p) => p.slug !== post.slug);
  const pick = [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.product === post.product), ...others];
  return [...new Set(pick)].slice(0, 3);
}

export function articleHTML(p) {
  return `<div class="backbar"><a class="back" href="#blog">← All articles</a><span class="btag">${esc(p.category)}</span></div>
<h1>${esc(p.title)}</h1>
<p class="bmeta"><span>${esc(p.readTime)}</span></p>
<div class="post-body">${p.body}</div>
<div class="bcta">
  <div><strong>See ${esc(p.product)} on your own stores</strong><span>A live thirty-minute demo on a real space from your own network. No commitment.</span></div>
  <a class="btn btn-primary" href="#contact">Request a demo</a>
</div>`;
}

export function relatedHTML(p) {
  return `<h2>Related articles</h2>\n<div class="bgrid">${gridHTML(relatedPosts(p))}</div>`;
}
