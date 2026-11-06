// All blog posts, in display order. Article text lives in ./content/*.js (plain data, no DOM).
import spacezap from './content/spacezap.js';
import sakshi from './content/sakshi.js';
import bankingDatadime from './content/banking-datadime.js';
import retailPlatform from './content/retail-platform.js';

export const PUBLISHED = '2026-11-06'; // launch date used for every article (ISO)

const ORDER = [
  'spacezap-fitout-minutes', 'lidar-store-scan', 'brand-rules-every-store', 'gfc-mep-dockets', 'boq-procurement-day-one',
  'cameras-beyond-theft', 'footfall-dwell-bounce', 'sop-compliance-real-time', 'staffing-to-real-traffic', 'privacy-first-video-analytics',
  'bank-branch-security-ai', 'branch-queue-wait-times', 'atm-lobby-monitoring', 'branch-network-insights',
  'talk-to-your-stores', 'zone-performance-questions',
  'physical-retail-data-gap', 'mall-operators-tenant-insights', 'rolling-out-at-scale',
  'empty-shell-to-running-floor',
];
// shown on the home page band, in this order
const FEATURED = ['empty-shell-to-running-floor', 'cameras-beyond-theft', 'bank-branch-security-ai'];

const all = [...spacezap, ...sakshi, ...bankingDatadime, ...retailPlatform];
const words = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

export const POSTS = ORDER.map((slug) => {
  const p = all.find((x) => x.slug === slug);
  if (!p) throw new Error(`Missing blog post: ${slug}`);
  return { ...p, featured: FEATURED.includes(slug), readTime: `${Math.max(3, Math.round(words(p.body) / 200))} min read` };
});
export const FEATURED_POSTS = FEATURED.map((s) => POSTS.find((p) => p.slug === s));
