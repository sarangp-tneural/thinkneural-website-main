import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { POSTS, PUBLISHED } from './src/blog/posts.js';
import { esc, articleHTML, relatedHTML, gridHTML, chipsHTML } from './src/blog/render.js';

const COMPONENTS = path.resolve(import.meta.dirname, 'src/components');

// Replaces <!-- @include path/to/file.html --> with the file's contents
// (paths relative to src/components). Includes can be nested.
function htmlInclude() {
  const render = (html, seen = []) =>
    html.replace(/^([ \t]*)<!--\s*@include\s+(\S+)\s*-->/gm, (_, indent, file) => {
      const full = path.join(COMPONENTS, file);
      if (seen.includes(full)) throw new Error(`Circular include: ${file}`);
      const body = render(fs.readFileSync(full, 'utf8').replace(/\n$/, ''), [...seen, full]);
      return body.split('\n').map((l, i) => (i && l ? indent + l : l)).join('\n').replace(/^/, indent);
    });
  return {
    name: 'html-include',
    transformIndexHtml: { order: 'pre', handler: (html) => render(html) },
    configureServer(server) {
      server.watcher.add(COMPONENTS);
      server.watcher.on('change', (f) => {
        if (f.startsWith(COMPONENTS)) server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

const SITE = 'https://thinkneural.ai'; // canonical origin used in SEO tags and sitemap.xml

// After the build: writes real, crawlable pages dist/blog/index.html and dist/blog/<slug>/index.html
// (unique title, description, canonical, Open Graph, JSON-LD and the article markup itself),
// plus sitemap.xml and robots.txt. The same src/blog/render.js markup is used as in the browser.
function blogSeo() {
  let outDir;
  const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
  const page = (tpl, { title, description, url, type, jsonld, body }) => {
    const head = [
      `<link rel="canonical" href="${url}">`,
      `<meta property="og:type" content="${type}">`,
      `<meta property="og:site_name" content="ThinkNeural.ai">`,
      `<meta property="og:title" content="${esc(title)}">`,
      `<meta property="og:description" content="${esc(description)}">`,
      `<meta property="og:url" content="${url}">`,
      `<meta name="twitter:card" content="summary">`,
      ...jsonld.map(ld),
    ].join('\n');
    const baseTitle = (tpl.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const baseDesc = (tpl.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    return tpl
      .replace(/<!--ld:start-->[\s\S]*?<!--ld:end-->\n?/g, '') // the static SEO pages never include the 3D loader
      .replace('<html lang="en">', `<html lang="en" data-base-title="${baseTitle}" data-base-desc="${baseDesc}">`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}">`)
      .replace('</head>', `${head}\n</head>`)
      .replace('<html lang="en" ', '<html lang="en" class="is-blog" ')
      .replace(/(<section class="a-hero blog-hero" id="blogIndex")([^>]*>)/, `$1${body.reader ? ' hidden' : ''}$2`)
      .replace('<div class="chips" id="blogFilters" role="group" aria-label="Filter articles by topic"></div>', `<div class="chips" id="blogFilters" role="group" aria-label="Filter articles by topic">${chipsHTML()}</div>`)
      .replace('<div class="bgrid" id="blogGrid"></div>', `<div class="bgrid" id="blogGrid">${gridHTML(POSTS)}</div>`)
      .replace('id="blogReader" hidden', body.reader ? 'id="blogReader"' : 'id="blogReader" hidden')
      .replace('<article class="post" id="blogArticle"></article>', `<article class="post" id="blogArticle">${body.article || ''}</article>`)
      .replace('<aside class="related" id="blogRelated" aria-label="Related articles"></aside>', `<aside class="related" id="blogRelated" aria-label="Related articles">${body.related || ''}</aside>`);
  };
  const org = { '@type': 'Organization', name: 'ThinkNeural.ai', url: SITE };
  return {
    name: 'blog-seo',
    apply: 'build',
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); },
    closeBundle() {
      const tpl = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      const write = (rel, text) => { const f = path.join(outDir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
      const listUrl = `${SITE}/blog/`;
      write('blog/index.html', page(tpl, {
        title: 'Blog | ThinkNeural.ai',
        description: 'Ideas for retail, banking and physical spaces: guides on store design automation, camera analytics and conversational analytics from ThinkNeural.ai.',
        url: listUrl, type: 'website', body: {},
        jsonld: [{ '@context': 'https://schema.org', '@type': 'Blog', name: 'ThinkNeural.ai Blog', url: listUrl, publisher: org,
          blogPost: POSTS.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}/` })) }],
      }));
      for (const p of POSTS) {
        const url = `${SITE}/blog/${p.slug}/`;
        write(`blog/${p.slug}/index.html`, page(tpl, {
          title: `${p.title} | ThinkNeural.ai`, description: p.description, url, type: 'article',
          body: { reader: true, article: articleHTML(p), related: relatedHTML(p) },
          jsonld: [
            { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, articleSection: p.category,
              datePublished: PUBLISHED, dateModified: PUBLISHED, mainEntityOfPage: url, url, author: org, publisher: org, inLanguage: 'en' },
            { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: listUrl },
              { '@type': 'ListItem', position: 3, name: p.title, item: url } ] },
          ],
        }));
      }
      const urls = [`${SITE}/`, listUrl, ...POSTS.map((p) => `${SITE}/blog/${p.slug}/`)];
      write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${PUBLISHED}</lastmod></url>`).join('\n')}\n</urlset>\n`);
      write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
    },
  };
}

export default defineConfig({ plugins: [tailwindcss(), htmlInclude(), blogSeo()] });
