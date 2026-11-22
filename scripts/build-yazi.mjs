// İnteraktif yazı sayfasını üretir: content/prompt-yazisi.json -> public/yazi/prompt-brief/index.html
// Header ve footer sitenin ortak şablonundan (shared/render.js) gelir; site ayarları Firestore'dan okunur.
// Kullanım:
//   node scripts/build-yazi.mjs          sayfayı üretir
//   node scripts/build-yazi.mjs --og     ayrıca 1200x630 paylaşım görselini (og.png) Google Chrome ile üretir
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { layout, identityLd, articleLd, breadcrumbLd, faqLd, trDate } from '../shared/render.js';
import { yaziMarkdown } from './yazi-md.mjs';
import { RENK, ogFontCss } from './og-marka.mjs';
import { seedBundle } from './build-static.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const pub = join(root, 'public');
const ORIGIN = 'https://ucpehlivan.web.app';
const C = JSON.parse(readFileSync(join(root, 'content', 'prompt-yazisi.json'), 'utf8'));
const S = Object.fromEntries(C.sections.map((s) => [s.id, s]));
const OUT = join(pub, ...C.meta.path.split('/').filter(Boolean));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// Metinlerde sadece **kalın** desteklenir.
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const ps = (arr = []) => arr.map((p) => `<p>${md(p)}</p>`).join('');
const ext = (href) => (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '');
// Not kutusunda ayrıca [metin](https://…) linki desteklenir (kaynak gösterimi).
const mdLink = (s) => md(s).replace(/\[(.+?)\]\((https?:\/\/[^)\s]+)\)/g, (_, t, u) => `<a href="${u}"${ext(u)}>${t}</a>`);
// Bölüm sonunda yazının dışında kalan kısa not (ör. sonradan duyulan bir alıntı). Özet ile aynı tonlu, düz alan.
const aside = (a) => (a ? `<aside class="yz-aside" aria-label="${esc(a.label)}"><p class="yz-mono">${esc(a.label)}</p><p>${mdLink(a.text)}</p></aside>` : '');
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const FLOW_ARROW = '<svg class="yz-farrow" viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8h32M28 3l6 5-6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function decode(v) {
  if (!v || typeof v !== 'object') return null;
  if ('stringValue' in v) return v.stringValue; if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue; if ('booleanValue' in v) return v.booleanValue; if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, decode(x)]));
  return null;
}
async function siteBundle() {
  try {
    const pid = JSON.parse(readFileSync(join(root, '.firebaserc'), 'utf8')).projects.default;
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/site/public`);
    if (!r.ok) throw new Error(String(r.status));
    return decode({ mapValue: { fields: (await r.json()).fields || {} } });
  } catch (err) {
    console.warn(`Firestore okunamadı (${err.message}), seed.json kullanılıyor.`);
    return seedBundle();
  }
}

const secHead = (s, tag = 'h2') => `<div class="yz-sh"><span class="yz-num">${esc(s.num)}</span><span class="yz-mono">${esc(s.title)}</span></div>${tag ? `<${tag} class="d yz-h" id="h-${esc(s.id)}">${esc(s.title)}</${tag}>` : ''}${tag && s.lede ? `<p class="yz-lede">${md(s.lede)}</p>` : ''}`;

function flipCard({ tag, title, front, backLabel, back, why, whyLabel }) {
  return `<li><button type="button" class="yz-card" aria-pressed="false">
  <span class="yz-face yz-front"><span class="yz-tag">${esc(tag)}</span><b class="yz-ct">${md(title)}</b>${front ? `<span class="yz-txt">${md(front)}</span>` : ''}<span class="yz-hint" aria-hidden="true">${esc(C.ui.flip)} ↻</span></span>
  <span class="yz-face yz-back" aria-hidden="true"><span class="yz-tag yz-tag-on">${esc(backLabel)}</span><b class="yz-ct yz-ct-sm">${md(title)}</b><span class="yz-txt">${md(back)}</span>${why ? `<span class="yz-why"><i>${esc(whyLabel)}</i>${md(why)}</span>` : ''}</span>
</button></li>`;
}

// Görünür yazar ve tarih: okur ve arama motorları/yapay zeka araçları kimin, ne zaman yazdığını görsün.
function byline() {
  const m = C.meta;
  const date = trDate(m.published);
  const upd = m.updated && m.updated !== m.published ? ` · <span>Güncellendi: <time datetime="${esc(m.updated)}">${trDate(m.updated)}</time></span>` : '';
  return `<p class="yz-byline"><a href="/#hakkimda" rel="author">${esc(s.name)}</a> · <time datetime="${esc(m.published)}">${date}</time>${upd}${m.readingMinutes ? ` · <span>${esc(m.readingMinutes)} dk okuma</span>` : ''}</p>`;
}
// Yazının başında kısa özet: cevabı önce veren yapı, yapay zeka araçlarının alıntılamasını kolaylaştırır.
function summary() {
  const m = C.meta;
  if (!(m.summary || []).length) return '';
  return `<aside class="yz-tldr" aria-label="${esc(m.summaryLabel)}"><p class="yz-mono">${esc(m.summaryLabel)}</p><ul>${m.summary.map((x) => `<li>${md(x)}</li>`).join('')}</ul></aside>`;
}

// Görünür sayfa yolu: koddaki BreadcrumbList ile aynı adımlar.
function crumbs() {
  const k = C.meta.crumbs;
  if (!k) return '';
  return `<nav class="yz-crumb" aria-label="${esc(k.label)}"><ol><li><a href="/">${esc(k.home)}</a></li><li><a href="/blog/">${esc(k.blog)}</a></li><li aria-current="page">${esc(C.meta.title)}</li></ol></nav>`;
}
// Kapak görseli: blog kartındakiyle aynı görsel. İlk ekranda olduğu için öncelikli yüklenir; boyut verilir (kayma olmaz).
function cover() {
  const k = C.meta.cover;
  if (!k) return '';
  return `<figure class="yz-cover"><img src="${esc(k.src)}" alt="${esc(k.alt)}" width="${esc(k.width)}" height="${esc(k.height)}" fetchpriority="high" decoding="async"></figure>`;
}
// Paylaşım: LinkedIn (sitenin dağıtım kanalı), linki kopyala, destekleyen cihazlarda sistem paylaşımı.
function share() {
  const k = C.meta.share;
  if (!k) return '';
  const url = ORIGIN + C.meta.path;
  return `<div class="yz-share"><span class="yz-mono">${esc(k.label)}</span><div class="yz-share-row"><a class="btn btn-ghost btn-sm" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">${esc(k.linkedin)} ↗</a>${k.x ? `<a class="btn btn-ghost btn-sm" href="${esc(`https://x.com/intent/post?text=${encodeURIComponent(C.meta.title)}&url=${encodeURIComponent(url)}`)}" target="_blank" rel="noopener">${esc(k.x)} ↗</a>` : ''}<button type="button" class="btn btn-ghost btn-sm" data-share-copy="${esc(url)}">${esc(k.copy)}</button><button type="button" class="btn btn-ghost btn-sm" data-share-native data-url="${esc(url)}" data-title="${esc(C.meta.title)}" hidden>${esc(k.native)}</button></div><p class="yz-status" id="yz-share-status" role="status" aria-live="polite"></p></div>`;
}

// Yazı başlığı bloğu: ızgaranın ilk satırında, içerik kolonunda. Bölüm menüsü (yz-nav) ikinci satırda başlar,
// böylece menünün üstü Özet alanıyla aynı hizadadır. <header> kullanılmaz: main.css'teki genel header kuralı (sticky) uygulanır.
function head01(s) {
  const h = s.hero;
  return `<div class="yz-head">
  ${crumbs()}
  ${secHead(s, '')}
  <p class="yz-kicker yz-mono">${esc(h.kicker)}</p>
  <h1 class="d yz-title" id="h-${s.id}">${esc(h.title)}</h1>
  ${byline()}
  ${cover()}
</div>`;
}

function s01(s) {
  const h = s.hero;
  return `<section class="yz-sec yz-hero" id="${s.id}" aria-labelledby="h-${s.id}" data-sec>
  ${summary()}
  <div class="yz-claim"><div class="yz-claim-top"><span class="yz-mono yz-claim-l">${esc(h.claimLabel)}</span><span class="yz-claim-dots" aria-hidden="true">${h.pillars.map((_, i) => `<i>${i + 1}</i>`).join('')}</span></div><p class="yz-claim-t">${(() => { let n = 0; return h.claim.map((p) => (p.key ? `<mark data-k="${esc(p.key)}"><sup aria-hidden="true">${++n}</sup>${esc(p.text)}</mark>` : esc(p.text))).join(''); })()}</p></div>
  <p class="yz-mono yz-small">${esc(h.pillarsHint)}</p>
  <div class="yz-pillars">${h.pillars.map((p, i) => `<button type="button" class="yz-pillar" data-k="${esc(p.key)}" aria-pressed="false"><span class="yz-mono"><b class="yz-pn">${i + 1}</b>${esc(p.label)}</span><span>${esc(p.text)}</span></button>`).join('')}</div>
  <div class="yz-prose">${ps(s.paragraphs)}</div>
  ${aside(s.aside)}
</section>`;
}

function s02(s) {
  return `<section class="yz-sec" id="${s.id}" aria-labelledby="h-${s.id}" data-sec>${secHead(s)}
  <div class="yz-prose"><p>${md(s.intro)}</p></div>
  <div class="yz-rev">
    <div class="yz-revhead"><span class="yz-mono">${esc(s.fileLabel)}</span><button type="button" class="btn btn-ghost btn-sm" id="yz-rev-all" aria-pressed="false" data-on="${esc(s.undoAll)}" data-off="${esc(s.reviseAll)}">${esc(s.reviseAll)}</button></div>
    <ol class="yz-revlist">${s.habits.map((h, i) => `<li class="yz-habit">
      <div class="yz-hmeta"><span class="yz-num">${String(i + 1).padStart(2, '0')}</span><h3 class="yz-hname">${esc(h.name)}</h3><p class="yz-hwhy"><span class="yz-mono">${esc(s.noteLabel)}</span>${md(h.why)}</p></div>
      <div class="yz-diff">
        <p class="yz-del"><span class="yz-sign" aria-hidden="true">−</span><span class="yz-line">${md(h.old)}</span></p>
        <p class="yz-add" id="yz-add-${i}" hidden><span class="yz-sign" aria-hidden="true">+</span><span class="yz-line">${md(h.new)}</span></p>
        <button type="button" class="yz-revbtn" aria-expanded="false" aria-controls="yz-add-${i}" data-on="${esc(s.undo)}" data-off="${esc(s.revise)}">${esc(s.revise)}</button>
      </div>
    </li>`).join('')}</ol>
  </div>
  <div class="yz-prose">${ps(s.after)}</div>
</section>`;
}

// Akış çizimi: reçete tek dar bir hat; hedef + sınır, kesikli sınır içinde birden çok yol ve vurgulu bir çıkış.
const DRAW = {
  recete: `<svg class="yz-draw" viewBox="0 0 320 110" aria-hidden="true"><line x1="24" y1="55" x2="296" y2="55" stroke="var(--line-strong)" stroke-width="3"/>${[24, 92, 160, 228].map((x) => `<circle cx="${x}" cy="55" r="7" fill="var(--surface)" stroke="var(--muted)" stroke-width="3"/>`).join('')}<circle cx="296" cy="55" r="11" fill="var(--muted)"/></svg>`,
  hedef: `<svg class="yz-draw" viewBox="0 0 320 110" aria-hidden="true"><rect x="10" y="8" width="300" height="94" rx="16" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 6" opacity=".55"/><path d="M28 55 C90 10 150 100 220 40" fill="none" stroke="var(--line-strong)" stroke-width="2.5"/><path d="M28 55 C80 95 170 90 230 78" fill="none" stroke="var(--line-strong)" stroke-width="2.5"/><path class="yz-best" d="M28 55 C100 30 180 70 290 55" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/><circle cx="28" cy="55" r="8" fill="var(--ink)"/><path d="M290 43l3.5 8.5 8.5 3.5-8.5 3.5-3.5 8.5-3.5-8.5-8.5-3.5 8.5-3.5z" fill="var(--accent)"/></svg>`,
};

function s03(s) {
  const sw = s.switch;
  return `<section class="yz-sec" id="${s.id}" aria-labelledby="h-${s.id}" data-sec>${secHead(s)}
  <div class="yz-prose"><p>${md(s.intro)}</p><ul class="yz-parts">${s.parts.map((p) => `<li><strong>${esc(p.label)}</strong> ${md(p.text)}</li>`).join('')}</ul></div>
  <figure class="yz-switchbox">
    <fieldset class="yz-seg"><legend class="yz-mono">${esc(sw.label)}</legend><span class="yz-pill">${sw.options.map((o, i) => `<label><input type="radio" name="yz-way" value="${esc(o.key)}"${i === 0 ? ' checked' : ''}><span>${esc(o.label)}</span></label>`).join('')}</span></fieldset>
    ${sw.options.map((o, i) => `<div class="yz-way yz-way-${esc(o.key)}" data-way="${esc(o.key)}"${i === 0 ? '' : ' hidden'}>
      <p class="yz-mono yz-small">${esc(o.tag)}</p>
      ${DRAW[o.key] || ''}
      <ol class="yz-flow">${o.flow.map((n, j) => `<li class="${j === o.flow.length - 1 ? 'yz-end' : ''}">${j ? FLOW_ARROW : ''}<span>${esc(n)}</span></li>`).join('')}</ol>
      <div class="yz-example"><span class="yz-mono">${esc(o.exampleLabel)}</span><p>“${esc(o.example)}”</p></div>
    </div>`).join('')}
    <figcaption class="yz-mono yz-small">${esc(sw.caption)}</figcaption>
  </figure>
  <div class="yz-prose">${ps(s.paragraphs)}</div>
</section>`;
}

function s04(s) {
  return `<section class="yz-sec" id="${s.id}" aria-labelledby="h-${s.id}" data-sec>${secHead(s)}
  <div class="yz-prose"><p>${md(s.intro)}</p></div>
  <div class="yz-tabs">
    <div class="yz-tablist" role="tablist" aria-label="${esc(s.tabsLabel)}">${s.tabs.map((t, i) => `<button type="button" role="tab" id="tab-${esc(t.key)}" aria-controls="panel-${esc(t.key)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(t.label)}</button>`).join('')}</div>
    ${s.tabs.map((t, i) => `<div class="yz-panel" role="tabpanel" id="panel-${esc(t.key)}" aria-labelledby="tab-${esc(t.key)}" tabindex="0"${i === 0 ? '' : ' hidden'}><dl>${t.rows.map((r, j) => `<div><dt class="yz-mono">${esc(s.rowLabels[j])}</dt><dd>${md(r)}</dd></div>`).join('')}</dl></div>`).join('')}
  </div>
  <div class="yz-prose">${ps(s.paragraphs)}</div>
</section>`;
}

// 05: brief tezgâhı. Eski prompt seçilir/yapıştırılır, brief yazılır, canlı kontrol listesiyle kopyalanır.
function s05(s) {
  const f = s.fields;
  const step = (i) => `<span class="yz-step"><b>${i + 1}</b>${esc(s.steps[i])}</span>`;
  return `<section class="yz-sec" id="${s.id}" aria-labelledby="h-${s.id}" data-sec>${secHead(s)}
  <div class="yz-prose"><p>${md(s.intro)}</p></div>
  <div class="yz-bench" id="olusturucu">
    <div class="yz-pick">
      ${step(0)}
      <fieldset class="yz-chips"><legend class="yz-mono">${esc(s.pickLabel)}</legend>${s.examples.map((x, i) => `<label><input type="radio" name="yz-ex" value="${i}"><span>${esc(x.title)}</span></label>`).join('')}</fieldset>
      <div class="yz-field"><label for="yz-old">${esc(s.oldLabel)}</label><textarea id="yz-old" rows="3" placeholder="${esc(s.oldPlaceholder)}"></textarea></div>
      <p class="yz-whybox" id="yz-why" hidden><span class="yz-mono">${esc(s.whyLabel)}</span><span id="yz-why-t"></span></p>
      <button type="button" class="btn btn-ghost btn-sm" id="yz-fill" disabled>${esc(s.fillFromPick)}</button>
    </div>
    <form class="yz-form" id="yz-form" novalidate>
      ${step(1)}
      <div class="yz-field"><label for="yz-goal">${esc(f.goal.label)} <small>${esc(f.goal.required)}</small></label><textarea id="yz-goal" name="goal" rows="2" required aria-required="true" aria-describedby="yz-goal-err" placeholder="${esc(f.goal.placeholder)}"></textarea><p class="yz-err" id="yz-goal-err" hidden>${esc(s.goalError)}</p></div>
      <div class="yz-field"><label for="yz-inputs">${esc(f.inputs.label)}</label><textarea id="yz-inputs" name="inputs" rows="2" placeholder="${esc(f.inputs.placeholder)}"></textarea></div>
      <div class="yz-field"><label for="yz-limits">${esc(f.limits.label)} <small>${esc(f.limits.hint)}</small></label><textarea id="yz-limits" name="limits" rows="4" placeholder="${esc(f.limits.placeholder)}"></textarea></div>
      <div class="yz-field"><label for="yz-measure">${esc(f.measure.label)} <small>${esc(f.measure.hint)}</small></label><textarea id="yz-measure" name="measure" rows="2" placeholder="${esc(f.measure.placeholder)}"></textarea></div>
    </form>
    <div class="yz-outbox">
      ${step(2)}
      <div class="yz-before" id="yz-before" hidden><span class="yz-mono">${esc(s.beforeLabel)} · <span id="yz-before-n"></span></span><p id="yz-before-t"></p></div>
      <div class="yz-outhead"><span class="yz-mono" id="yz-out-l" data-empty="${esc(s.templateLabel)}" data-full="${esc(s.afterLabel)}">${esc(s.templateLabel)}</span><button type="button" class="btn btn-sm yz-btn-acc" id="yz-copy">${esc(C.ui.copy)}</button></div>
      <pre class="yz-out is-empty" id="yz-out" tabindex="0">${esc(s.template)}</pre>
      <p class="yz-status" id="yz-status" role="status" aria-live="polite"></p>
      <div class="yz-checks"><div class="yz-checkhead"><span class="yz-mono">${esc(s.checkTitle)}</span><span class="yz-score" id="yz-score">0/${s.checks.length}</span></div>
        <ul>${s.checks.map((c) => `<li data-check="${esc(c.key)}"><span class="yz-tick" aria-hidden="true"></span><span><b>${esc(c.label)}</b><small>${md(c.hint)}</small></span></li>`).join('')}</ul></div>
      <p class="yz-mono yz-small">${esc(s.outputHint)}</p>
    </div>
  </div>
</section>`;
}

function s06(s) {
  return `<section class="yz-sec yz-end-sec" id="${s.id}" aria-labelledby="h-${s.id}" data-sec>${secHead(s)}
  <div class="yz-prose yz-big">${ps(s.paragraphs)}</div>
  <div class="yz-cta"><a class="btn btn-cv" href="${esc(s.linkedin.href)}"${ext(s.linkedin.href)}>${esc(s.linkedin.label)} ↗</a></div>
  ${share()}
</section>`;
}

const site = await siteBundle();
// Bu sayfada analitik yok: site ayarındaki GA kimliği bu sayfaya taşınmaz.
const c = { ...site, settings: { ...(site.settings || {}), gaId: '' } };
const s = c.settings;

const nav = `<nav class="yz-nav" aria-label="${esc(C.ui.navLabel)}"><ol>${C.sections.map((x) => `<li><a href="#${x.id}" data-nav="${x.id}"><span class="yz-num">${esc(x.num)}</span><span class="yz-nl">${esc(x.nav)}</span></a></li>`).join('')}</ol></nav>`;
const client = {
  ui: C.ui,
  template: S.sablon.template,
  bench: S.sablon,
};
const body = `<div class="yz" id="yz"><div class="wrap yz-grid">${head01(S.neden)}${nav}<article class="yz-article">
${s01(S.neden)}
${s02(S.inanclar)}
${s03(S.sinir)}
${s04(S.modeller)}
${s05(S.sablon)}
${s06(S.sonuc)}
</article></div></div>
<script type="application/json" id="yz-data">${JSON.stringify(client).replace(/</g, '\\u003c')}</script>`;

const css = readFileSync(join(pub, 'assets', 'yazi.css'));
const js = readFileSync(join(pub, 'assets', 'yazi.js'));
const v = createHash('sha1').update(css).update(js).digest('hex').slice(0, 8);

const ld = {
  '@context': 'https://schema.org',
  '@graph': [...identityLd(c, ORIGIN), articleLd({ url: ORIGIN + C.meta.path, headline: C.meta.title, description: C.meta.description, datePublished: C.meta.published, dateModified: C.meta.updated, image: [C.meta.cover && ORIGIN + C.meta.cover.src, ORIGIN + C.meta.ogImage].filter(Boolean) }, ORIGIN), breadcrumbLd([['Ana sayfa', '/'], ['Yazılar', '/blog/'], [C.meta.title, C.meta.path]], ORIGIN), ...((C.meta.faq || []).length ? [faqLd(C.meta.faq, ORIGIN + C.meta.path)] : [])],
};
let html = layout(c, { origin: ORIGIN, path: C.meta.path, type: 'article', jsonld: ld, title: `${C.meta.title} | ${s.name}`, description: C.meta.description, image: C.meta.ogImage, imageAlt: C.meta.ogImageAlt, body });
// Sitenin içerik yenileme script'i bu sayfayı tanımaz; bu sayfada yüklenmez.
html = html.replace(/<script type="module" src="\/assets\/app\.js[^"]*"><\/script>\n?/, '');
const og = `<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="article:published_time" content="${esc(C.meta.published)}">
<meta property="article:modified_time" content="${esc(C.meta.updated || C.meta.published)}">
<meta property="article:author" content="${esc(s.name)}">
<link rel="alternate" type="text/markdown" href="${esc(C.meta.path)}index.md" title="${esc(C.meta.title)} (düz metin)">
<link rel="stylesheet" href="/assets/yazi.css?v=${v}">`;
html = html.replace('</head>', `${og}\n</head>`);
html = html.replace('</body>', `<script src="/assets/yazi.js?v=${v}" defer></script>\n</body>`);
if (/app\.js|googletagmanager/.test(html)) throw new Error('Sayfada istenmeyen script kaldı.');

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'index.html'), html);
writeFileSync(join(OUT, 'index.md'), yaziMarkdown(C, { author: s.name, date: trDate(C.meta.published), origin: ORIGIN }));
console.log(`${C.meta.path} üretildi (varlık sürümü ${v}).`);

// Paylaşım görseli, 1200x630. Yeni bağımlılık yok; yüklü Google Chrome kullanılır.
// Kapak varsa: kapak kırpılmadan yüksekliğe sığdırılır, yanlar kapağın kenar rengiyle (meta.cover.bg) dolar.
// Kapak yoksa: başlık + vurgu rengi şablonu.
if (process.argv.includes('--og')) {
  const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const tmp = mkdtempSync(join(tmpdir(), 'og-'));
  const page = join(tmp, 'og.html');
  const cv = C.meta.cover;
  if (cv) writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}html,body{width:1200px;height:630px;overflow:hidden;background:${cv.bg || '#EFF1F5'};display:flex;justify-content:center}img{height:630px;width:auto;display:block}</style></head>
<body><img src="file://${join(pub, ...cv.src.split('/').filter(Boolean))}" alt=""></body></html>`);
  else writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8">
<style>${ogFontCss(pub)}*{margin:0;box-sizing:border-box}html,body{width:1200px;height:630px;overflow:hidden}
body{background:${RENK.kraft};font-family:"Schibsted Grotesk",system-ui,sans-serif;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;position:relative}
.k{font:500 22px "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:${RENK.tukenmez};display:flex;gap:14px;align-items:center}
.k b{background:${RENK.tukenmez};color:${RENK.kagit};padding:6px 12px;border-radius:8px;font-weight:500}
h1{font-family:"Schibsted Grotesk",sans-serif;font-weight:800;font-size:92px;line-height:.95;letter-spacing:-.035em;color:${RENK.murekkep};max-width:1000px}
h1 i{font-style:normal;color:${RENK.tukenmez}}
.f{display:flex;justify-content:space-between;align-items:center;font-size:26px;color:${RENK.silik}}
.bar{position:absolute;left:0;right:0;bottom:0;height:16px;background:${RENK.tukenmez}}</style></head>
<body><div class="k"><b>01–06</b>${esc(S.neden.hero.kicker)}</div>
<h1>${esc(S.neden.hero.title).replace(/(brief yazmak\.)$/, '<i>$1</i>')}</h1>
<div class="f"><span>${esc(s.name)}</span><span>ucpehlivan.web.app</span></div><div class="bar"></div></body></html>`);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=4000', '--window-size=1200,630', `--screenshot=${join(OUT, 'og.png')}`, `file://${page}`], { stdio: 'ignore' });
  rmSync(tmp, { recursive: true, force: true });
  console.log('og.png üretildi (1200x630).');
}
