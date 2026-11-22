// Blok biçimli interaktif yazı: content/<ad>.json ("format": "blok") -> HTML + düz metin (Markdown).
// Saf fonksiyon: Node'da (scripts/build-yazi-blok.mjs) ve tarayıcıda aynı çalışır (Node olmayan makinede tarayıcıda üretilir).
// Ortak parçalar /yazi/prompt-brief/ ile aynı sınıfları kullanır (yazi.css + yazi.js): sayfa yolu, yazar satırı, Özet/Kısaca,
// kapak, bölüm menüsü, ilerleme, paylaşım. Yeni bileşenler yazi-blok.css + yazi-blok.js içindedir (önek: yb-).
// build-yazi.mjs (prompt-brief) bu dosyadan bağımsızdır; ona dokunulmaz.
import { layout, identityLd, articleLd, breadcrumbLd, faqLd, trDate, ytThumb } from '../shared/render.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// Yayına girmemesi gereken işaretler: [DÜZENLE], [SÜRE], [ÖRNEK: …]. Önizlemede vurgulu görünür; yayinla.yml canlıya almaz.
export const TODO_RE = /\[(DÜZENLE|SÜRE|ÖRNEK:[^\]]*)\]/g;
const todo = (h) => h.replace(TODO_RE, '<mark class="yb-todo">[$1]</mark>');
// Metinlerde **kalın** desteklenir.
const md = (s) => todo(esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'));
const ps = (arr = []) => arr.map((p) => `<p>${md(p)}</p>`).join('');
const ext = (href) => (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '');
const seg = (name, label, options) => `<fieldset class="yz-seg"><legend class="yz-mono">${esc(label)}</legend><span class="yz-pill">${options.map((o, i) => `<label><input type="radio" name="${esc(name)}" value="${esc(o.key)}"${i === 0 ? ' checked' : ''}><span>${esc(o.label)}</span></label>`).join('')}</span></fieldset>`;
// Bir duruma bağlı metin: yalnız o durumda görünür (CSS: [data-state] + [data-on]).
const on = (key, html, def, tag = 'span') => `<${tag} class="yb-on" data-on="${esc(key)}"${String(key) === String(def) ? '' : ' hidden'}>${html}</${tag}>`;
const ARROW = '<svg class="yz-farrow" viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8h32M28 3l6 5-6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function renderBlok(C, site, { origin = 'https://ucpehlivan.web.app', yaziV = '', blokV = '' } = {}) {
  const m = C.meta;
  const c = { ...site, settings: { ...(site.settings || {}), gaId: '' } }; // Bu sayfada analitik yok.
  const s = c.settings;
  const url = origin + m.path;

  const secHead = (x, tag = 'h2') => `<div class="yz-sh"><span class="yz-num">${esc(x.num)}</span><span class="yz-mono">${esc(x.label || x.nav)}</span></div>${tag && x.title ? `<${tag} class="d yz-h${x.label ? ' yb-h' : ''}" id="h-${esc(x.id)}">${esc(x.label ? x.title.replace(/^\d+\.\s*/, '') : x.title)}</${tag}>` : ''}${tag && x.lede ? `<p class="yz-lede">${md(x.lede)}</p>` : ''}`;
  const byline = () => {
    const upd = m.updated && m.updated !== m.published ? ` · <span>Güncellendi: <time datetime="${esc(m.updated)}">${trDate(m.updated)}</time></span>` : '';
    return `<p class="yz-byline"><a href="/#hakkimda" rel="author">${esc(s.name)}</a> · <time datetime="${esc(m.published)}">${trDate(m.published)}</time>${upd}${m.readingMinutes ? ` · <span>${esc(m.readingMinutes)} dk okuma</span>` : ''}</p>`;
  };
  const crumbs = () => (m.crumbs ? `<nav class="yz-crumb" aria-label="${esc(m.crumbs.label)}"><ol><li><a href="/">${esc(m.crumbs.home)}</a></li><li><a href="/blog/">${esc(m.crumbs.blog)}</a></li><li aria-current="page">${esc(m.title)}</li></ol></nav>` : '');
  const cover = () => (m.cover ? `<figure class="yz-cover"><img src="${esc(m.cover.src)}" alt="${esc(m.cover.alt)}" width="${esc(m.cover.width)}" height="${esc(m.cover.height)}" fetchpriority="high" decoding="async"></figure>` : '');
  const share = () => {
    const k = m.share;
    if (!k) return '';
    return `<div class="yz-share"><span class="yz-mono">${esc(k.label)}</span><div class="yz-share-row"><a class="btn btn-ghost btn-sm" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">${esc(k.linkedin)} ↗</a>${k.x ? `<a class="btn btn-ghost btn-sm" href="${esc(`https://x.com/intent/post?text=${encodeURIComponent(m.title)}&url=${encodeURIComponent(url)}`)}" target="_blank" rel="noopener">${esc(k.x)} ↗</a>` : ''}<button type="button" class="btn btn-ghost btn-sm" data-share-copy="${esc(url)}">${esc(k.copy)}</button><button type="button" class="btn btn-ghost btn-sm" data-share-native data-url="${esc(url)}" data-title="${esc(m.title)}" hidden>${esc(k.native)}</button></div><p class="yz-status" id="yz-share-status" role="status" aria-live="polite"></p></div>`;
  };

  const B = {
    summary: () => {
      const list = m.summary || [];
      if (!list.length) return '';
      const one = list.length === 1;
      return `<aside class="yz-tldr${one ? ' yb-tldr-one' : ''}" aria-label="${esc(m.summaryLabel)}"><p class="yz-mono">${esc(m.summaryLabel)}</p>${one ? `<p class="yb-tldr-t">${md(list[0])}</p>` : `<ul>${list.map((x) => `<li>${md(x)}</li>`).join('')}</ul>`}</aside>`;
    },
    // YouTube videosu: önce yalnız kapak görseli; tıklayınca youtube-nocookie oynatıcısı yüklenir (yazi-blok.js). Link JS olmadan da çalışır.
    video: (b) => `<figure class="yb-video"><div class="yb-vbox" data-yb="video" data-id="${esc(b.id)}" data-title="${esc(b.title)}"><img src="${esc(ytThumb(b.id))}" alt="" loading="lazy" width="480" height="360"><button type="button" class="yb-vplay" aria-label="Videoyu oynat: ${esc(b.title)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></button></div><figcaption class="yz-mono yz-small">${b.caption ? `${esc(b.caption)} · ` : ''}<a href="https://www.youtube.com/watch?v=${esc(encodeURIComponent(b.id))}" target="_blank" rel="noopener">YouTube'da izle ↗</a></figcaption></figure>`,
    prose: (b) => `<div class="yz-prose${b.big ? ' yz-big' : ''}">${ps(b.paragraphs)}</div>`,
    // Aynı adımlar, iki yapan: anahtar adımların sahibini değiştirir.
    flow: (b, sec) => `<figure class="yz-switchbox yb-flow" data-yb="state" data-state="${esc(b.options[0].key)}">
    ${seg(`yb-${sec.id}`, b.label, b.options)}
    <ol class="yb-steps">${b.steps.map((st, i) => `<li>${i ? ARROW : ''}<span class="yb-step"><span class="yb-who">${b.options.map((o) => on(o.key, esc(o.who), b.options[0].key)).join('')}</span>${esc(st)}</span></li>`).join('')}<li class="yb-res">${ARROW}<span class="yb-step">${b.options.map((o) => on(o.key, md(b.result[o.key]), b.options[0].key)).join('')}</span></li></ol>
    <figcaption class="yz-mono yz-small">${esc(b.caption)}</figcaption>
  </figure>`,
    poll: (b, sec) => `<div class="yb-poll" data-yb="poll"><p class="yb-q">${esc(b.question)}</p><div class="yb-poll-row">${b.options.map((o) => `<button type="button" class="yb-choice" aria-pressed="false" data-reply="${esc(o.reply)}">${esc(o.label)}</button>`).join('')}</div><p class="yb-reply" id="yb-reply-${esc(sec.id)}" role="status" aria-live="polite"></p></div>`,
    jump: (b) => `<div class="yb-jump"><p class="yz-mono">${esc(b.label)}</p><ol>${b.items.map((x) => `<li><a href="#${esc(x.to)}"><b>${esc(x.num)}</b><span>${esc(x.text)}</span></a></li>`).join('')}</ol></div>`,
    // Aracın üstüne binen iş: başkası kullanınca kurulum, açıklama, destek eklenir.
    stack: (b, sec) => `<figure class="yz-switchbox yb-stack" data-yb="state" data-state="${esc(b.options[0].key)}">
    ${seg(`yb-${sec.id}`, b.label, b.options)}
    <div class="yb-tower" aria-hidden="true">${b.extra.slice().reverse().map((x) => `<span class="yb-blk yb-extra" style="--n:${Number(x.size) || 1}">${esc(x.label)}</span>`).join('')}<span class="yb-blk yb-base">${esc(b.base.label)}<small>${esc(b.base.note)}</small></span></div>
    <p class="yb-cap">${b.options.map((o) => on(o.key, md(b.caption[o.key]), b.options[0].key)).join('')}</p>
    <p class="yb-sr">${esc(b.base.label)} + ${b.extra.map((x) => esc(x.label)).join(', ')}</p>
  </figure>`,
    // Model sürümü kaydırıcısı: işaretli adım aracımdan modele geçer.
    version: (b, sec) => {
      const stepsOf = (inModel) => b.steps.map((st, i) => (i === b.moving
        ? `<li class="yb-mv${inModel ? ' yb-mv-in' : ' yb-mv-out'}">${esc(st)}${inModel ? '' : `<small>${esc(b.movedNote)}</small>`}</li>`
        : inModel ? '' : `<li>${esc(st)}</li>`)).join('');
      return `<figure class="yz-switchbox yb-ver" data-yb="range" data-state="0">
    <div class="yb-range"><label class="yz-mono" for="yb-r-${esc(sec.id)}">${esc(b.label)}</label><input type="range" id="yb-r-${esc(sec.id)}" min="0" max="${b.stops.length - 1}" step="1" value="0" aria-valuetext="${esc(b.stops[0])}" data-stops="${esc(JSON.stringify(b.stops))}"><span class="yb-stops" aria-hidden="true">${b.stops.map((x) => `<i>${esc(x)}</i>`).join('')}</span></div>
    <div class="yb-boxes"><div class="yb-box yb-box-model"><p class="yz-mono">${esc(b.model)}</p><ol>${stepsOf(true)}</ol></div><div class="yb-box"><p class="yz-mono">${esc(b.tool)}</p><ol>${stepsOf(false)}</ol></div></div>
    ${b.outcomes ? `<div class="yb-out2">${b.outcomes.map((o) => `<div class="yb-o yb-o-${esc(o.tone)}"><p class="yz-mono">${esc(o.label)}</p><p>${on('0', esc(o.before), '0')}${on('1', esc(o.after), '0')}</p></div>`).join('')}</div>` : ''}
  </figure>`;
    },
    // Örnek rapor: aracın gördüğü düz satırlar / benim eklediğim ağırlık ve not.
    report: (b, sec) => `<figure class="yz-switchbox yb-report" data-yb="state" data-state="${esc(b.options[0].key)}">
    <div class="yb-rhead">${seg(`yb-${sec.id}`, b.label, b.options)}<span class="yz-mono yz-small">${esc(b.note)}</span></div>
    <table class="yz-table yb-table"><thead><tr><th scope="col">${esc(b.cols[0])}</th><th scope="col">${esc(b.cols[1])}</th><th scope="col" class="yb-note-c"><span class="yb-sr">Not</span></th></tr></thead><tbody>${b.rows.map((r) => `<tr class="${r.tag ? `yb-t-${esc(r.tag)}` : ''}"><th scope="row">${esc(r.task)}</th><td data-l="${esc(b.cols[1])}">${esc(r.status)}</td><td class="yb-note-c">${r.tag ? `<span class="yb-tag">${esc(r.tagLabel)}</span><span class="yb-why">${esc(r.why)}</span>` : ''}</td></tr>`).join('')}</tbody></table>
    <p class="yb-cap">${b.options.map((o) => on(o.key, md(b.caption[o.key]), b.options[0].key)).join('')}</p>
  </figure>`,
    outcome: (b, sec) => `<figure class="yz-switchbox yb-outc" data-yb="state" data-state="${esc(b.options[0].key)}">
    ${seg(`yb-${sec.id}`, b.label, b.options)}
    ${on(b.options[0].key, `<ol class="yb-steps yb-back">${b.back.map((x, i) => `<li>${i ? ARROW : ''}<span class="yb-step">${esc(x)}</span></li>`).join('')}</ol>`, b.options[0].key, 'div')}
    ${on(b.options[1].key, `<ul class="yb-tiles">${b.front.map((x, i) => `<li><b>${String(i + 1).padStart(2, '0')}</b>${esc(x)}</li>`).join('')}</ul>`, b.options[0].key, 'div')}
  </figure>`,
    // Vurgulu kutu: üç soru; okur kendi aracı için net cevabı olanları işaretler.
    questions: (b, sec) => `<div class="yb-qbox" data-yb="questions" data-need="${esc(JSON.stringify(b.need || []))}">
    <p class="yb-qintro">${md(b.intro)}</p>
    <p class="yz-mono yb-qtry">${esc(b.tryLabel)} <small>· ${esc(b.checkHint)}</small></p>
    <ol class="yb-qs">${b.items.map((q, i) => `<li><label><input type="checkbox" value="${i}"><span class="yb-qn">${i + 1}</span><span class="yb-qt">${md(q)}</span></label></li>`).join('')}</ol>
    <p class="yb-rule">${md(b.rule)}</p>
    <p class="yb-verdict" role="status" aria-live="polite" data-yes="${esc(b.verdict.yes)}" data-wait="${esc(b.verdict.wait)}"><span class="yb-vt">${esc(b.verdict.wait)}</span> <b class="yb-vn">0/${(b.need || []).length}</b></p>
  </div>`,
    closing: (b) => `<div class="yz-prose yz-big yb-closing">${ps(b.paragraphs)}</div>${b.linkedin ? `<div class="yz-cta"><a class="btn btn-cv" href="${esc(b.linkedin.href)}"${ext(b.linkedin.href)}>${esc(b.linkedin.label)} ↗</a></div>` : ''}`,
    share: () => share(),
  };

  const secs = C.sections;
  const first = secs[0];
  const head = `<div class="yz-head">
  ${crumbs()}
  ${secHead(first, '')}
  <p class="yz-kicker yz-mono">${esc(m.kicker || '')}</p>
  <h1 class="d yz-title yb-title" id="h-${esc(first.id)}">${esc(m.title)}</h1>
  ${byline()}
  ${cover()}
</div>`;
  const nav = `<nav class="yz-nav" aria-label="${esc(C.ui.navLabel)}"><ol>${secs.map((x) => `<li><a href="#${esc(x.id)}" data-nav="${esc(x.id)}"><span class="yz-num">${esc(x.num)}</span><span class="yz-nl">${esc(x.nav)}</span></a></li>`).join('')}</ol></nav>`;
  const section = (x) => `<section class="yz-sec${x.end ? ' yz-end-sec' : ''}" id="${esc(x.id)}" aria-labelledby="h-${esc(x.id)}" data-sec>${x.head ? '' : secHead(x)}
  ${x.blocks.map((b) => { const f = B[b.type]; if (!f) throw new Error(`Bilinmeyen blok: ${b.type}`); return f(b, x); }).join('\n  ')}
</section>`;
  // yazi.js ortak davranışları (menü, ilerleme, j/k, paylaşım) #yz-data ister; brief tezgâhı bu sayfada yok (bench boş).
  const client = { ui: C.ui, bench: {} };
  const body = `<div class="yz yb" id="yz"><div class="wrap yz-grid">${head}${nav}<article class="yz-article">
${secs.map(section).join('\n')}
</article></div></div>
<script type="application/json" id="yz-data">${JSON.stringify(client).replace(/</g, '\\u003c')}</script>`;

  // VideoObject: yazıdaki her video bloğu (yükleme tarihi olanlar) Google'da videolu sonuç için.
  const videoLd = C.sections.flatMap((x) => x.blocks).filter((b) => b.type === 'video' && b.id && b.date).map((b) => ({ '@type': 'VideoObject', name: b.title, description: b.description || m.description, thumbnailUrl: ytThumb(b.id), uploadDate: b.date, embedUrl: `https://www.youtube.com/embed/${b.id}`, url: `https://www.youtube.com/watch?v=${b.id}`, ...(b.duration ? { duration: b.duration } : {}) }));
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [...identityLd(c, origin), ...videoLd, articleLd({ url, headline: m.title, description: m.description, datePublished: m.published, dateModified: m.updated, image: [m.cover && origin + m.cover.src, origin + m.ogImage].filter(Boolean) }, origin), breadcrumbLd([['Ana sayfa', '/'], ['Yazılar', '/blog/'], [m.title, m.path]], origin), ...((m.faq || []).length ? [faqLd(m.faq, url)] : [])],
  };
  let html = layout(c, { origin, path: m.path, type: 'article', jsonld: ld, title: `${m.seoTitle || m.title} | ${s.name}`, ogTitle: m.seoTitle ? `${m.title} | ${s.name}` : '', description: m.description, image: m.ogImage, imageAlt: m.ogImageAlt, body });
  html = html.replace(/<script type="module" src="\/assets\/app\.js[^"]*"><\/script>\n?/, '');
  const extra = `<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="article:published_time" content="${esc(m.published)}">
<meta property="article:modified_time" content="${esc(m.updated || m.published)}">
<meta property="article:author" content="${esc(s.name)}">
<link rel="alternate" type="text/markdown" href="${esc(m.path)}index.md" title="${esc(m.title)} (düz metin)">
<link rel="stylesheet" href="/assets/yazi.css?v=${yaziV}">
<link rel="stylesheet" href="/assets/yazi-blok.css?v=${blokV}">`;
  html = html.replace('</head>', `${extra}\n</head>`);
  html = html.replace('</body>', `<script src="/assets/yazi.js?v=${yaziV}" defer></script>\n<script src="/assets/yazi-blok.js?v=${blokV}" defer></script>\n</body>`);
  if (/app\.js|googletagmanager/.test(html)) throw new Error('Sayfada istenmeyen script kaldı.');
  return { html, md: blokMarkdown(C, { author: s.name, origin }) };
}

// Düz metin sürümü: yalnız yazının kendisi (arayüz metni yok). llms.txt ve head buraya link verir.
export function blokMarkdown(C, { author = '', origin = 'https://ucpehlivan.web.app' } = {}) {
  const m = C.meta;
  const out = [];
  const push = (...xs) => xs.forEach((x) => { if (x !== '' && x != null) out.push(x); });
  push(`# ${m.title}`);
  push([author, trDate(m.published), m.readingMinutes ? `${m.readingMinutes} dk okuma` : ''].filter(Boolean).join(' · ') + `  \nKaynak: ${origin}${m.path}`);
  if (m.cover) push(`![${m.cover.alt}](${origin}${m.cover.src})`);
  for (const x of C.sections) {
    if (!x.head && x.title) push(`## ${x.title}`);
    for (const b of x.blocks) {
      if (b.type === 'summary' && (m.summary || []).length) push(`**${m.summaryLabel}:** ${m.summary.join(' ')}`);
      if (b.type === 'prose') push(...b.paragraphs);
      if (b.type === 'video') push(`[Video: ${b.title}](https://www.youtube.com/watch?v=${b.id})`);
      if (b.type === 'closing') push('---', ...b.paragraphs);
      if (b.type === 'questions') push(b.intro, b.items.map((q, i) => `${i + 1}. ${q}`).join('\n'), b.rule);
    }
  }
  return out.join('\n\n') + '\n';
}
