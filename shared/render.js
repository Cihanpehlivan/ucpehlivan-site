// Sitenin tüm sayfalarını HTML olarak üretir. Hem Cloud Function hem admin önizlemesi kullanır.
export const e = (v = '') => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const md = (v = '') => e(v).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const nl = (v = '') => e(v).replace(/\n/g, '<br>');
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export const trDate = (iso) => { if (!iso) return ''; const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const isExt = (u = '') => /^https?:/.test(u) || /\.pdf($|\?)/.test(u);
const tgt = (u) => (isExt(u) ? ' target="_blank" rel="noopener"' : '');
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const PILLS = { check: '<span class="pill pill-check"><i></i><i></i><i></i></span>', gantt: '<span class="pill pill-gantt"><i></i><i></i><i></i></span>', chart: '<span class="pill pill-chart"><i></i><i></i><i></i><i></i></span>' };
export const ICONS = {
  document: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h6M7 13h10M7 17h4"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2.2 1-4 3.5-4S22 17.8 22 20"/>',
  trend: '<path d="M3 17l5-5 4 4 8-8"/><path d="M15 8h5v5"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  sparkle: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  cart: '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
  code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
};
const COVERS = {
  kanban: '<rect x="40" y="40" width="96" height="170" rx="12" fill="HI" fill-opacity=".12"/><rect x="152" y="40" width="96" height="170" rx="12" fill="HI" fill-opacity=".12"/><rect x="264" y="40" width="96" height="170" rx="12" fill="HI" fill-opacity=".12"/><rect x="52" y="56" width="72" height="30" rx="7" fill="HI" fill-opacity=".45"/><rect x="52" y="94" width="72" height="30" rx="7" fill="HI" fill-opacity=".45"/><rect x="52" y="132" width="72" height="30" rx="7" fill="HI" fill-opacity=".45"/><rect x="164" y="56" width="72" height="30" rx="7" fill="HI" fill-opacity=".75"/><rect x="164" y="94" width="72" height="30" rx="7" fill="HI" fill-opacity=".75"/><rect x="276" y="56" width="72" height="30" rx="7" fill="HI"/>',
  redirect: '<rect x="40" y="70" width="120" height="110" rx="12" fill="HI" fill-opacity=".14" stroke="HI" stroke-opacity=".4"/><rect x="240" y="70" width="120" height="110" rx="12" fill="HI" fill-opacity=".35"/><rect x="58" y="92" width="84" height="10" rx="5" fill="HI" fill-opacity=".5"/><rect x="58" y="112" width="60" height="10" rx="5" fill="HI" fill-opacity=".35"/><rect x="258" y="92" width="84" height="10" rx="5" fill="HI"/><rect x="258" y="112" width="60" height="10" rx="5" fill="HI" fill-opacity=".7"/><path d="M172 125h52" stroke="HI" stroke-width="5" stroke-linecap="round"/><path d="M212 111l14 14-14 14" stroke="HI" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="200" y="100" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="20" fill="HI">301</text>',
  chat: '<rect x="50" y="60" width="180" height="56" rx="16" fill="HI" fill-opacity=".2"/><rect x="66" y="78" width="120" height="8" rx="4" fill="HI" fill-opacity=".7"/><rect x="66" y="94" width="80" height="8" rx="4" fill="HI" fill-opacity=".45"/><rect x="170" y="134" width="180" height="56" rx="16" fill="HI" fill-opacity=".45"/><rect x="186" y="152" width="130" height="8" rx="4" fill="HI"/><rect x="186" y="168" width="90" height="8" rx="4" fill="HI" fill-opacity=".8"/><path d="M318 50l7 18 18 7-18 7-7 18-7-18-18-7 18-7z" fill="HI"/>',
  chart: '<path d="M40 200 L100 180 L160 186 L220 140 L280 120 L360 50" fill="none" stroke="HI" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="360" cy="50" r="10" fill="HI"/><path d="M40 210H360" stroke="HI" stroke-opacity=".3" stroke-width="2"/>',
};
const color = (c, d) => (/^#[0-9a-fA-F]{3,8}$/.test(c || '') ? c : d);

export function cover(p) {
  const bg = color(p.coverColor, '#1E2025');
  if (p.coverStyle === 'image' && p.coverImage) return `<div class="bcover has-img" style="--c:${bg}"><img src="${e(p.coverImage)}" alt="" loading="lazy"></div>`;
  const svg = (COVERS[p.coverStyle] || COVERS.kanban).replaceAll('HI', color(p.coverHighlight, '#C2AEFF'));
  return `<div class="bcover" style="--c:${bg}" aria-hidden="true"><svg viewBox="0 0 400 250" fill="none">${svg}</svg></div>`;
}
export function postCard(p) {
  return `<a class="bcard" href="/blog/${e(p.slug)}/">${cover(p)}<div class="bbody"><p class="bmeta"><span class="chip">${e(p.category)}</span><time datetime="${e(p.publishedAt)}">${trDate(p.publishedAt)}</time>${p.readingMinutes ? `<span>${e(p.readingMinutes)} dk okuma</span>` : ''}</p><h3>${e(p.title)}</h3><p class="ex">${e(p.excerpt)}</p></div></a>`;
}

export function layout(c, { title, description, type = 'website', jsonld, noindex = false, path = '/', home = false, origin = 'https://ucpehlivan.web.app', version = '', body }) {
  const s = c.settings || {};
  const canonical = origin + path;
  const pageTitle = title || s.seoTitle || s.name;
  const desc = description || s.seoDescription || '';
  const p = home ? '' : '/';
  const ld = jsonld || { '@context': 'https://schema.org', '@type': 'Person', name: s.name, jobTitle: s.role, url: origin + '/', email: `mailto:${s.email}`, sameAs: [s.linkedin].filter(Boolean) };
  const cur = path.startsWith('/blog') ? ' aria-current="page"' : '';
  const tel = String(s.phone || '').replace(/\s/g, '');
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(pageTitle)}</title>
<meta name="description" content="${e(desc)}">
<link rel="canonical" href="${e(canonical)}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${e(pageTitle)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${e(canonical)}">
<meta property="og:locale" content="tr_TR">
<meta name="ucp-version" content="${e(version || c.version || '')}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/main.css">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${s.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${e(s.gaId)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${e(s.gaId)}');</script>` : ''}
</head>
<body>
<div class="guides" aria-hidden="true"><div class="wrap"><i></i><i></i><i></i><i></i></div></div>
<div class="progress" aria-hidden="true"><i></i></div>
<header>
  <div class="wrap bar">
    <a class="logo" href="/" aria-label="${e(s.name)}, ana sayfa"><span class="wl">${e(s.name)}<i aria-hidden="true"></i></span></a>
    <nav aria-label="Ana menü"><a href="${p}#rakamlar">Rakamlar</a><a href="${p}#neler">Ne yaparım</a><a href="${p}#vakalar">Projeler</a><a href="${p}#hakkimda">Hakkımda</a><a href="/blog/"${cur}>Blog</a><a href="${p}#iletisim">İletişim</a></nav>
    <div class="tools" style="display:flex;gap:10px;align-items:center">
      <button class="icon-btn" id="theme" type="button" aria-label="Açık ve koyu tema arasında geçiş yap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
      <a class="btn btn-ink btn-sm" href="${p}#iletisim">${e(s.headerCta || 'İletişim')}</a>
    </div>
  </div>
</header>
<main id="top">
${body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div><a class="logo" href="/" style="padding:0" aria-label="${e(s.name)}, ana sayfa"><span class="wl wl-lg">${e(s.name)}<i aria-hidden="true"></i></span></a><p class="foot-tag">${e(s.footerTagline)}</p><a class="mail" href="mailto:${e(s.email)}">${e(s.email)}</a></div>
      <div><h4>Sayfa</h4><a href="/#rakamlar">Rakamlar</a><a href="/#neler">Ne yaparım</a><a href="/#vakalar">Projeler</a></div>
      <div><h4>Daha fazla</h4><a href="/#surec">Çalışma şeklim</a><a href="/#hakkimda">Hakkımda</a><a href="/blog/">Blog</a><a href="${e(s.cvUrl || '/cv.pdf')}" target="_blank" rel="noopener">CV</a></div>
      <div><h4>İletişim</h4><a href="${e(s.linkedin)}" target="_blank" rel="noopener">LinkedIn</a><a href="tel:${e(tel)}">${e(s.phone)}</a><a href="/#iletisim">${e(s.location)}</a></div>
    </div>
    <div class="wordmark" aria-hidden="true"><span id="wm">${e(String(s.name || '').toLocaleUpperCase('tr-TR'))}</span></div>
    <div class="copy"><span>© <span id="yr">${new Date().getFullYear()}</span> ${e(s.name)}</span><span>${e(s.footerNote)}</span></div>
  </div>
</footer>
<script src="/assets/main.js"></script>
<script type="module" src="/assets/app.js"></script>
</body>
</html>`;
}

function tile(t) {
  const cls = ['tile', t.visual === 'board' ? 't-board' : '', t.size === 'wide' ? 't-wide' : '', t.size === 'tall' && t.visual !== 'board' ? 't-tall' : '', t.theme === 'accent' ? 't-accent' : '', t.theme === 'ink' ? 't-ink' : ''].filter(Boolean).join(' ');
  const has = t.countTo !== undefined && t.countTo !== null && t.countTo !== '';
  const attrs = has ? ` data-to="${e(t.countTo)}" data-pre="${e(t.prefix || '')}" data-suf="${e(t.suffix || '')}"` : '';
  const num = has ? `${e(t.prefix || '')}0${e(t.suffix || '')}` : e(t.value);
  const lbl = `<span class="lbl">${e(t.label)}</span>`;
  switch (t.visual) {
    case 'board': return `<div class="${cls}">${lbl}<div class="board" aria-hidden="true"><div class="col"><b>Yapılacak <em>2</em></b><i>Kapsam toplantısı</i><i>İçerik toplama</i></div><div class="col"><b>Yapılıyor <em>2</em></b><i class="live">Figma QA</i><i class="live">CMS entegrasyonu</i></div><div class="col"><b>Bitti <em>2</em></b><i class="done">Sprint planning</i><i class="done">Canlıya alma</i></div></div></div>`;
    case 'trophy': return `<div class="${cls}"><div class="award-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg><div><h3>${e(t.title)}</h3><p>${e(t.label)}</p></div></div></div>`;
    case 'sparkline': return `<div class="${cls}">${lbl}<div class="split"><div class="num"${attrs}>${num}</div><svg class="spark" viewBox="0 0 220 90" preserveAspectRatio="none" aria-hidden="true"><path class="a" d="M0 80 L30 74 L60 76 L90 62 L120 58 L150 40 L180 30 L220 8 L220 90 L0 90Z"/><path class="l" d="M0 80 L30 74 L60 76 L90 62 L120 58 L150 40 L180 30 L220 8"/></svg></div></div>`;
    case 'bars': return `<div class="${cls}">${lbl}<div class="split"><div class="num sm"${attrs}>${num}</div><div class="minibars" aria-hidden="true"><i style="height:30%"></i><i style="height:45%"></i><i style="height:62%"></i><i style="height:100%"></i></div></div></div>`;
    default: return `<div class="${cls}">${lbl}<div class="num sm"${attrs}>${num}</div></div>`;
  }
}

export function renderHome(c, opts = {}) {
  const s = c.settings || {}, h = c.home || {};
  const hero = h.hero || {}, br = h.brands || {}, st = h.stats || {}, sv = h.services || {}, wk = h.work || {}, pr = h.process || {}, ab = h.about || {}, sk = h.skills || {}, bl = h.blog || {}, ct = h.contact || {};
  const cases = (c.cases || []).filter((x) => x.visible !== false);
  const latest = (c.posts || []).slice(0, bl.count ?? 3);
  const twice = (arr, wrap) => [0, 1].map((k) => (arr || []).map((x) => `<span${k ? ' aria-hidden="true"' : ''}>${wrap ? `<em>${e(x)}</em>` : e(x)}</span>`).join('')).join('');
  const body = `
<section class="hero"><div class="wrap">
  <p class="status"><svg class="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${e(hero.badge)}</p>
  <h1 class="d mega" aria-label="${e(hero.ariaLabel)}">${(hero.lines || []).map((l) => `<span class="ln" aria-hidden="true"><span>${[e(l.before), PILLS[l.pill] || '', e(l.after)].filter(Boolean).join(' ')}</span></span>`).join('')}</h1>
  <div class="hero-foot">
    <div class="hero-copy"><p>${e(hero.text)}</p>
      <div class="cta"><a class="btn btn-cv" href="${e(s.cvUrl || '/cv.pdf')}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>${e(hero.cvLabel)}</a><a class="btn btn-ghost btn-lg" href="#vakalar">${e(hero.projectsLabel)}</a></div></div>
    <a class="badge" href="mailto:${e(s.email)}" aria-label="E-posta ile iletişime geç"><svg class="ring" viewBox="0 0 132 132" aria-hidden="true"><defs><path id="circ" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0"/></defs><text><textPath href="#circ">${e(hero.badgeText)}</textPath></text></svg><span class="core"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg></span></a>
  </div>
</div></section>

<div class="brands"><div class="brands-label">${e(br.label)}</div><div class="marquee" style="--dur:42s"><div class="track">${twice(br.items)}</div></div></div>

<section class="block" id="rakamlar"><div class="wrap">
  <div class="head"><div><span class="kicker">${e(st.kicker)}</span><h2 class="d">${nl(st.title)}</h2></div><p>${e(st.intro)}</p></div>
  <div class="bento">${(st.tiles || []).map(tile).join('')}</div>
</div></section>

<section class="block" id="neler" style="padding-top:40px"><div class="wrap svc">
  <div class="svc-intro"><span class="kicker">${e(sv.kicker)}</span><h2 class="d">${e(sv.title)}</h2><p>${e(sv.intro)}</p><a class="btn btn-ink" href="#iletisim">${e(sv.buttonLabel)} ${ARROW}</a></div>
  <div class="svc-list">${(sv.items || []).map((it) => `<div class="svc-card"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[it.icon] || ICONS.document}</svg></div><div><h3>${e(it.title)}</h3><p>${e(it.text)}</p>${(it.tags || []).length ? `<div class="svc-tags">${it.tags.map((g) => `<span>${e(g)}</span>`).join('')}</div>` : ''}</div></div>`).join('')}</div>
</div></section>

<section class="block" id="vakalar" style="padding-top:40px"><div class="wrap">
  <div class="head"><div><span class="kicker">${e(wk.kicker)}</span><h2 class="d">${e(wk.title)}</h2></div><p>${e(wk.intro)}</p></div>
  <div class="stack" id="stack">${cases.map((cs, i) => `<article class="case" style="--i:${i};--c:${color(cs.color, '#1E2025')};--hi:${color(cs.highlight, '#C2AEFF')}"><div class="case-body"><div><div class="tags">${(cs.tags || []).map((g) => `<span>${e(g)}</span>`).join('')}</div><h3>${e(cs.headline)}</h3><p>${e(cs.description)}</p></div><div class="kpis">${(cs.kpis || []).map((k) => `<div><strong${/^[%\d.,+]+$/.test(k.value || '') ? '' : ' class="txt"'}>${e(k.value)}</strong><span>${e(k.label)}</span></div>`).join('')}</div></div><div class="case-art"><div class="browser" aria-hidden="true"><span></span><span></span><span></span></div>${cs.screenshot ? `<img src="${e(cs.screenshot)}" alt="${e(cs.name)} web sitesi ana sayfası" loading="lazy">` : ''}${cs.barStrong || cs.barText ? `<div class="case-bar"><span><b>${e(cs.barStrong)}</b> ${e(cs.barText)}</span></div>` : ''}</div></article>`).join('')}</div>
  ${(wk.other || []).length ? `<div class="more"><h3>${e(wk.otherTitle)}</h3><div class="more-grid">${wk.other.map((m) => `<div class="mi"><strong>${e(m.name)}</strong><span>${e(m.type)}</span></div>`).join('')}</div></div>` : ''}
</div></section>

<section class="block" id="surec" style="padding-top:40px"><div class="wrap">
  <div class="head"><div><span class="kicker">${e(pr.kicker)}</span><h2 class="d">${nl(pr.title)}</h2></div><p>${e(pr.intro)}</p></div>
  <div class="steps" id="steps"><div class="rail" aria-hidden="true"><i></i></div>${(pr.steps || []).map((x, i) => `<div class="step"><div class="n">${String(i + 1).padStart(2, '0')}</div><h3>${e(x.title)}</h3><p>${e(x.text)}</p></div>`).join('')}</div>
  ${pr.loopNote ? `<p class="loopnote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/></svg>${e(pr.loopNote)}</p>` : ''}
</div></section>

<section class="block" id="hakkimda" style="padding-top:40px"><div class="wrap about">
  <div class="about-photo">${ab.photo ? `<img src="${e(ab.photo)}" alt="${e(s.name)}" width="400" height="400" loading="lazy">` : ''}</div>
  <div><span class="kicker">${e(ab.kicker)}</span><h2 class="d">${e(ab.title)}</h2>${(ab.paragraphs || []).map((x) => `<p class="lead">${e(x)}</p>`).join('')}
    <div class="tl">${(ab.timeline || []).map((r) => `<div class="tl-row"><div class="tl-when"><b>${e(r.org)}</b>${e(r.period)}${r.current ? '<br><span class="tl-now">Devam ediyor</span>' : ''}</div><div class="tl-what"><h3>${e(r.role)}</h3><ul>${(r.bullets || []).map((b) => `<li>${md(b)}</li>`).join('')}</ul></div></div>`).join('')}</div>
  </div>
</div></section>

<section class="skills" aria-label="Yetkinlikler ve araçlar">
  <div class="marquee" style="--dur:46s"><div class="track chipline">${twice(sk.row1, true)}</div></div>
  <div class="marquee rev" style="--dur:52s"><div class="track chipline alt">${twice(sk.row2, true)}</div></div>
</section>

${latest.length ? `<section class="block" id="yazilar" style="padding-top:40px"><div class="wrap"><div class="head"><div><span class="kicker">${e(bl.kicker)}</span><h2 class="d">${e(bl.title)}</h2></div><p>${e(bl.intro)}</p></div><div class="bgrid">${latest.map(postCard).join('')}</div><div style="margin-top:28px"><a class="btn btn-ghost" href="/blog/">Tüm yazıları gör</a></div></div></section>` : ''}

<section id="iletisim" style="padding-bottom:0"><div class="wrap"><div class="cta-card">
  <div class="cta-top"><span class="kicker">${e(ct.kicker)}</span><h2 class="d">${e(ct.title)}</h2></div>
  <div class="paths">${(ct.paths || []).map((pt) => `<div class="path"><h3>${e(pt.title)}</h3><p>${e(pt.text)}</p><div class="path-actions">${pt.primaryLabel ? `<a class="btn btn-ink" href="${e(pt.primaryUrl)}"${tgt(pt.primaryUrl)}>${e(pt.primaryLabel)} ${ARROW}</a>` : ''}${pt.secondaryLabel ? `<a class="btn btn-ghost" href="${e(pt.secondaryUrl)}"${tgt(pt.secondaryUrl)}>${e(pt.secondaryLabel)}</a>` : ''}</div></div>`).join('')}</div>
</div></div></section>`;
  return layout(c, { ...opts, home: true, path: '/', body });
}

export function renderBlogIndex(c, opts = {}) {
  const s = c.settings || {}, bl = (c.home || {}).blog || {}, posts = c.posts || [];
  const body = `<section class="bhero"><div class="wrap"><span class="kicker">${e(bl.kicker)}</span><h1 class="d">${e(bl.pageTitle)}</h1><p>${e(bl.pageIntro)}</p></div></section>
<section><div class="wrap">${posts.length ? `<div class="bgrid ${posts.length >= 3 ? 'feat' : 'two'}">${posts.map(postCard).join('')}</div>` : '<p class="bempty">Henüz yayınlanmış yazı yok.</p>'}
<p class="bempty">Yeni yazılar yolda. Takip etmek için <a href="${e(s.linkedin)}" target="_blank" rel="noopener">LinkedIn</a> profilime göz atın.</p></div></section>`;
  return layout(c, { ...opts, title: `Blog | ${s.name}`, description: bl.intro, path: '/blog/', body });
}

export function renderPost(c, post, opts = {}) {
  const s = c.settings || {};
  const others = (c.posts || []).filter((p) => p.slug !== post.slug).slice(0, 2);
  const origin = opts.origin || 'https://ucpehlivan.web.app';
  const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.seoDescription || post.excerpt, datePublished: post.publishedAt, inLanguage: 'tr', author: { '@type': 'Person', name: s.name, url: origin + '/' }, mainEntityOfPage: `${origin}/blog/${post.slug}/` };
  const body = `<article>
  <div class="narrow post-head"><a class="back" href="/blog/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>Tüm yazılar</a>
    <p class="bmeta"><span class="chip">${e(post.category)}</span><time datetime="${e(post.publishedAt)}">${trDate(post.publishedAt)}</time>${post.readingMinutes ? `<span>${e(post.readingMinutes)} dk okuma</span>` : ''}</p>
    <h1 class="d">${e(post.title)}</h1>${post.lede ? `<p class="lede">${e(post.lede)}</p>` : ''}</div>
  <div class="post-cover">${cover(post)}</div>
  <div class="narrow prose">${post.body || ''}
    <div class="post-cta"><h3>Bir sonraki projeyi birlikte planlayalım</h3><div class="acts"><a class="btn btn-ink" href="mailto:${e(s.email)}?subject=Proje%20g%C3%B6r%C3%BC%C5%9Fmesi">E-posta gönder</a><a class="btn btn-ghost" href="${e(s.cvUrl || '/cv.pdf')}" target="_blank" rel="noopener">CV'yi indir</a></div></div>
  </div>
</article>
${others.length ? `<section class="more-posts"><div class="wrap"><h2 class="d">Diğer yazılar</h2><div class="bgrid two">${others.map(postCard).join('')}</div></div></section>` : ''}`;
  return layout(c, { ...opts, title: `${post.title} | ${s.name}`, description: post.seoDescription || post.excerpt, type: 'article', jsonld: ld, path: `/blog/${post.slug}/`, body });
}

export function render404(c, opts = {}) {
  const body = `<section class="bhero"><div class="wrap"><span class="kicker">404</span><h1 class="d">Bu sayfa planda yok</h1><p>Aradığınız sayfa taşınmış veya hiç oluşturulmamış olabilir. Ana sayfaya dönün veya blog yazılarına göz atın.</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:32px"><a class="btn btn-ink" href="/">Ana sayfaya dön</a><a class="btn btn-ghost" href="/blog/">Blog</a></div></div></section>`;
  return layout(c, { ...opts, title: 'Sayfa bulunamadı', noindex: true, path: '/404', body });
}

export function renderSitemap(c, origin = 'https://ucpehlivan.web.app') {
  const urls = [['/', ''], ['/blog/', '']].concat((c.posts || []).map((p) => [`/blog/${p.slug}/`, p.updatedAt || p.publishedAt]));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${origin}${u}</loc>${d ? `<lastmod>${String(d).slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
}

// "media:ID" referanslarını gerçek adreslerle değiştirir. map: { ID: url }
export function collectMedia(obj, out = new Set()) {
  if (typeof obj === 'string') { for (const m of obj.matchAll(/media:([A-Za-z0-9_-]{6,})/g)) out.add(m[1]); }
  else if (Array.isArray(obj)) obj.forEach((x) => collectMedia(x, out));
  else if (obj && typeof obj === 'object') Object.values(obj).forEach((x) => collectMedia(x, out));
  return out;
}
export function resolveMedia(obj, map) {
  if (typeof obj === 'string') return obj.replace(/media:([A-Za-z0-9_-]{6,})/g, (_, id) => map[id] || '');
  if (Array.isArray(obj)) return obj.map((x) => resolveMedia(x, map));
  if (obj && typeof obj === 'object') { const o = {}; for (const [k, v] of Object.entries(obj)) o[k] = resolveMedia(v, map); return o; }
  return obj;
}
// Yayındaki içerik paketinden bir adres için HTML üretir.
export function renderPath(c, path, opts = {}) {
  const p = (path.replace(/\/+$/, '') || '/');
  if (p === '/' || p === '/index.html') return { status: 200, html: renderHome(c, opts) };
  if (p === '/blog' || p === '/blog/index.html') return { status: 200, html: renderBlogIndex(c, opts) };
  const m = p.match(/^\/blog\/([a-z0-9-]+)(?:\/index\.html)?$/);
  const post = m && (c.posts || []).find((x) => x.slug === m[1]);
  if (post) return { status: 200, html: renderPost(c, post, opts) };
  return { status: 404, html: render404(c, opts) };
}
