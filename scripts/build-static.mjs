// Statik sayfaları üretir: public/index.html, public/blog/..., public/404.html, public/sitemap.xml
// Kullanım: node scripts/build-static.mjs [paket.json]   (varsayılan: scripts/seed.json)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHome, renderBlogIndex, renderPost, render404, renderSitemap, renderLlms, renderFeed, layout } from '../shared/render.js';

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, '..', 'public');
const ORIGIN = 'https://ucpehlivan.web.app';

export function seedBundle() {
  const s = JSON.parse(readFileSync(join(here, 'seed.json'), 'utf8'));
  return {
    version: 'seed-2', settings: s.settings, home: s.home,
    posts: s.posts.filter((p) => p.status === 'published').sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  };
}

export function buildPages(c) {
  const o = { origin: ORIGIN, version: c.version };
  const write = (rel, html) => { const f = join(pub, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };
  if (existsSync(join(pub, 'blog'))) rmSync(join(pub, 'blog'), { recursive: true });
  write('index.html', renderHome(c, o));
  write('blog/index.html', renderBlogIndex(c, o));
  for (const p of c.posts) write(`blog/${p.slug}/index.html`, renderPost(c, p, o));
  // Yeni yazılar için kabuk sayfa: içerik tarayıcıda Firestore'dan çizilir.
  // noindex: var olmayan /blog/... adresleri arama sonuçlarına girmesin. Gerçek yazı çizilince hydrate.js kaldırır.
  write('blog/post.html', layout(c, { ...o, version: 'shell', noindex: true, title: c.settings.name, path: '/blog/', body: '<section class="bhero"><div class="wrap"><p class="kicker">Yükleniyor</p></div></section>' }));
  write('404.html', render404(c, o));
  write('sitemap.xml', renderSitemap(c, ORIGIN));
  write('llms.txt', renderLlms(c, ORIGIN));
  write('feed.xml', renderFeed(c, ORIGIN));
  console.log(`Statik sayfalar üretildi: ana sayfa, yazılar, ${c.posts.length} yazı, 404, sitemap, llms.txt, feed.xml.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2];
  buildPages(arg ? JSON.parse(readFileSync(arg, 'utf8')) : seedBundle());
}
