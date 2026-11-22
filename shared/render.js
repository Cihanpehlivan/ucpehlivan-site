// Sitenin tüm sayfalarını HTML olarak üretir. Statik derleme, tarayıcı (hydrate) ve admin önizlemesi aynı kodu kullanır.
export const e = (v = '') => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const md = (v = '') => e(v).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
// Satır sonundan önce boşluk: CSS okumayan botlar kelimeleri birleşik görmesin.
const nl = (v = '') => e(v).replace(/\n/g, ' <br>');
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
  brief: '<rect x="70" y="28" width="260" height="194" rx="16" fill="var(--pa-kagit)" fill-opacity=".06" stroke="HI" stroke-opacity=".5"/><rect x="92" y="50" width="52" height="9" rx="4.5" fill="HI" fill-opacity=".85"/><circle cx="262" cy="54.5" r="7" fill="none" stroke="HI" stroke-opacity=".7" stroke-width="2"/><circle cx="282" cy="54.5" r="7" fill="none" stroke="HI" stroke-opacity=".7" stroke-width="2"/><circle cx="302" cy="54.5" r="7" fill="none" stroke="HI" stroke-opacity=".7" stroke-width="2"/><line x1="92" y1="76" x2="308" y2="76" stroke="HI" stroke-opacity=".45" stroke-width="2" stroke-dasharray="5 6"/><circle cx="97" cy="99" r="5" fill="HI"/><rect x="108" y="95" width="78" height="8" rx="4" fill="var(--pa-kagit)" fill-opacity=".8"/><line x1="108" y1="110" x2="186" y2="110" stroke="HI" stroke-width="2" stroke-dasharray="4 4"/><circle cx="203" cy="99" r="5" fill="HI"/><rect x="214" y="95" width="70" height="8" rx="4" fill="var(--pa-kagit)" fill-opacity=".8"/><line x1="214" y1="110" x2="284" y2="110" stroke="HI" stroke-width="2" stroke-dasharray="4 4"/><circle cx="97" cy="128" r="5" fill="HI"/><rect x="108" y="124" width="124" height="8" rx="4" fill="var(--pa-kagit)" fill-opacity=".8"/><line x1="108" y1="139" x2="232" y2="139" stroke="HI" stroke-width="2" stroke-dasharray="4 4"/><rect x="88" y="152" width="224" height="24" rx="7" fill="var(--pa-pas)" fill-opacity=".16"/><line x1="96" y1="164" x2="105" y2="164" stroke="var(--pa-pas)" stroke-width="2.5" stroke-linecap="round"/><rect x="116" y="161" width="150" height="6" rx="3" fill="var(--pa-kagit)" fill-opacity=".35"/><line x1="114" y1="164" x2="268" y2="164" stroke="var(--pa-pas)" stroke-width="2"/><rect x="88" y="184" width="224" height="24" rx="7" fill="var(--pa-zeytin)" fill-opacity=".16"/><path d="M100.5 191.5v9M96 196h9" stroke="var(--pa-zeytin)" stroke-width="2.5" stroke-linecap="round"/><rect x="116" y="193" width="172" height="6" rx="3" fill="var(--pa-zeytin)" fill-opacity=".9"/><path d="M352 30l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="HI"/><path d="M44 196l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="HI" fill-opacity=".7"/>',
  kanban: '<rect x="40" y="40" width="96" height="170" rx="12" fill="HI" fill-opacity=".12"/><rect x="152" y="40" width="96" height="170" rx="12" fill="HI" fill-opacity=".12"/><rect x="264" y="40" width="96" height="170" rx="12" fill="HI" fill-opacity=".12"/><rect x="52" y="56" width="72" height="30" rx="7" fill="HI" fill-opacity=".45"/><rect x="52" y="94" width="72" height="30" rx="7" fill="HI" fill-opacity=".45"/><rect x="52" y="132" width="72" height="30" rx="7" fill="HI" fill-opacity=".45"/><rect x="164" y="56" width="72" height="30" rx="7" fill="HI" fill-opacity=".75"/><rect x="164" y="94" width="72" height="30" rx="7" fill="HI" fill-opacity=".75"/><rect x="276" y="56" width="72" height="30" rx="7" fill="HI"/>',
  redirect: '<rect x="40" y="70" width="120" height="110" rx="12" fill="HI" fill-opacity=".14" stroke="HI" stroke-opacity=".4"/><rect x="240" y="70" width="120" height="110" rx="12" fill="HI" fill-opacity=".35"/><rect x="58" y="92" width="84" height="10" rx="5" fill="HI" fill-opacity=".5"/><rect x="58" y="112" width="60" height="10" rx="5" fill="HI" fill-opacity=".35"/><rect x="258" y="92" width="84" height="10" rx="5" fill="HI"/><rect x="258" y="112" width="60" height="10" rx="5" fill="HI" fill-opacity=".7"/><path d="M172 125h52" stroke="HI" stroke-width="5" stroke-linecap="round"/><path d="M212 111l14 14-14 14" stroke="HI" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="200" y="100" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="20" fill="HI">301</text>',
  chat: '<rect x="50" y="60" width="180" height="56" rx="16" fill="HI" fill-opacity=".2"/><rect x="66" y="78" width="120" height="8" rx="4" fill="HI" fill-opacity=".7"/><rect x="66" y="94" width="80" height="8" rx="4" fill="HI" fill-opacity=".45"/><rect x="170" y="134" width="180" height="56" rx="16" fill="HI" fill-opacity=".45"/><rect x="186" y="152" width="130" height="8" rx="4" fill="HI"/><rect x="186" y="168" width="90" height="8" rx="4" fill="HI" fill-opacity=".8"/><path d="M318 50l7 18 18 7-18 7-7 18-7-18-18-7 18-7z" fill="HI"/>',
  chart: '<path d="M40 200 L100 180 L160 186 L220 140 L280 120 L360 50" fill="none" stroke="HI" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="360" cy="50" r="10" fill="HI"/><path d="M40 210H360" stroke="HI" stroke-opacity=".3" stroke-width="2"/>',
};
const color = (c, d) => (/^#[0-9a-fA-F]{3,8}$/.test(c || '') ? c : d);

export function cover(p) {
  const bg = color(p.coverColor, '#141A30');
  if (p.coverStyle === 'image' && p.coverImage) return `<div class="bcover has-img" style="--c:${bg}"><img src="${e(p.coverImage)}" alt="" loading="lazy"></div>`;
  const svg = (COVERS[p.coverStyle] || COVERS.kanban).replaceAll('HI', color(p.coverHighlight, '#8FA6F0'));
  return `<div class="bcover" style="--c:${bg}" aria-hidden="true"><svg viewBox="0 0 400 250" fill="none">${svg}</svg></div>`;
}
// Yazının adresi: "Özel sayfa adresi" doluysa (sadece site içi yol) o, değilse /blog/slug/.
export const postHref = (p) => (typeof p.pageUrl === 'string' && /^\/[a-z0-9/-]+\/$/.test(p.pageUrl.trim()) ? p.pageUrl.trim() : `/blog/${p.slug}/`);

// Video kartı (Videolar bölümü). Veri: c.videos = videos.json (yayında YouTube RSS'ten). Kart YouTube'da açılır.
export const ytThumb = (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
export function videoCard(v) {
  return `<a class="bcard vcard" href="https://www.youtube.com/watch?v=${e(encodeURIComponent(v.id))}" target="_blank" rel="noopener"><div class="bcover has-img vcover"><img src="${e(ytThumb(v.id))}" alt="" loading="lazy" width="480" height="360"><span class="vplay" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span></div><div class="bbody"><p class="bmeta"><span class="chip">Video</span><time datetime="${e(String(v.published || '').slice(0, 10))}">${trDate(String(v.published || '').slice(0, 10))}</time></p><h3>${e(v.title)}</h3></div></a>`;
}

export function postCard(p) {
  return `<a class="bcard" href="${e(postHref(p))}" data-cat="${e(p.category)}">${cover(p)}<div class="bbody"><p class="bmeta">${p.category ? `<span class="chip">${e(p.category)}</span>` : ''}<time datetime="${e(p.publishedAt)}">${trDate(p.publishedAt)}</time>${p.readingMinutes ? `<span>${e(p.readingMinutes)} dk okuma</span>` : ''}</p><h3>${e(p.title)}</h3><p class="ex">${e(p.excerpt)}</p></div></a>`;
}

// ---------- Bölüm düzeni (admin: Ana sayfa > Düzen)
export const SECTION_KEYS = [['hero', 'Hero'], ['blog', 'Yazılar'], ['videos', 'Videolar'], ['about', 'Hakkımda'], ['accounts', 'Hesaplarım']];
// Videolar yeni bölüm: düzende yoksa pasif (CLAUDE.md §4).
const DEFAULT_LAYOUT = SECTION_KEYS.map(([key]) => ({ key, on: key !== 'videos' }));
const NAV = { blog: ['yazilar', 'Yazılar'], videos: ['videolar', 'Videolar'], about: ['hakkimda', 'Hakkımda'], accounts: ['iletisim', 'Hesaplarım'] };
export function activeSections(h = {}) {
  const src = Array.isArray(h.layout) && h.layout.length ? h.layout : DEFAULT_LAYOUT;
  const seen = new Set(), out = [];
  for (const x of src) { if (!x || !x.key || seen.has(x.key) || !SECTION_KEYS.some(([k]) => k === x.key)) continue; seen.add(x.key); if (x.on !== false) out.push(x.key); }
  return out;
}

// ---------- Hesaplar
export const ACCOUNT_ICONS = {
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10.5V16M8 7.6v.1M12 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M12 10.5V16"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
  x: '<path d="M4 4l6.5 8.5L4 20h2l5.4-6.3L16 20h4l-6.8-9L19.5 4h-2l-5 5.8L8 4z"/>',
  youtube: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9v6l5-3z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};
const accSvg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ACCOUNT_ICONS[k] || ACCOUNT_ICONS.link}</svg>`;
const accounts = (c) => (((c.home || {}).accounts || {}).items || []).filter((a) => a.visible !== false && a.url);
const mainAccount = (c) => { const l = accounts(c); return l.find((a) => a.highlight) || l[0] || null; };

// Logo: iki satırlı SVG metin (Schibsted Grotesk 800). “Umut Cihan” Tükenmez 72, “Pehlivan” metin rengi 100; P'nin ayağı eğik kesik (mask).
// Ölçüler Schibsted 800 glif ölçümünden: mürekkep sol kenarı Umut 4 / Pehlivan 7 birim, P gövdesi 0–16, büyük harf 70, satır arası 8.
// id: sayfada iki logo (header, footer) olduğu için mask id'si ayrı verilir.
const logoSvg = (id, cls = '') => `<svg class="logo-svg${cls}" viewBox="0 0 414 144" aria-hidden="true" focusable="false"><defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-2" y="0" width="418" height="150"><rect x="-2" width="418" height="150" fill="#fff"/><polygon fill="#000" points="-2,144.6 18,138.6 18,150 -2,150"/></mask></defs><text x="-4" y="57" font-size="72" fill="var(--accent)">Umut Cihan</text><text x="-7" y="144" font-size="100" fill="currentColor" mask="url(#${id})">Pehlivan</text></svg>`;
// Hakkımda: marka maskotu (Pehlivan, anlatım pozu; docs/Pehlivan-AI-Marka-Kimligi.md §8). Kaynak 598×857 (yazı kapağından kesildi, metne doğru gösterir); masaüstünde 340px, telefonda 240px.
const ILLUSTRATION = '<div class="about-ill about-maskot"><img src="/assets/brand/pehlivan-poz-anlatim-2x.webp" alt="Pehlivan maskotu: elinde kahve, bir eliyle metni gösteren bıyıklı ve sakallı çizim karakter" width="598" height="857" loading="lazy" decoding="async"></div>';

// CSS/JS değişince bu sayıyı artır: tarayıcı önbelleğindeki eski dosyalar kullanılmaz.
// /assets/** 1 yıl önbellekte (firebase.json). main.css, main.js veya app.js değişip bu sayı değişmezse
// .github/workflows/kontrol.yml push'u hatayla durdurur.
const ASSET_V = '24';

// Hesaplarım: çalışma masasındaki maskot (karakter sheet › Çalışma pozu, 305×261; kapalı zemin cepleri ve yer gölgesi temizlendi, koyu temada da temiz). Masaüstünde solda, listeye dönük; telefonda gizli.
const ACC_ILLUSTRATION = '<div class="acc-ill acc-maskot" aria-hidden="true"><img src="/assets/brand/pehlivan-poz-calisma-2.webp" alt="" width="305" height="261" loading="lazy" decoding="async"></div>';

// Kategori filtresi: admin'de açıksa ve en az 2 farklı kategori varsa görünür.
function filterBar(c, posts) {
  const bl = (c.home || {}).blog || {};
  const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  if (!bl.showFilter || cats.length < 2) return '';
  return `<div class="filters" role="toolbar" aria-label="Kategori"><button type="button" class="fbtn on" data-f="">Tümü</button>${cats.map((k) => `<button type="button" class="fbtn" data-f="${e(k)}">${e(k)}</button>`).join('')}</div>`;
}

// Site içi yolu tam adrese çevirir; data: ve boş değerler için ''.
const absUrl = (u, origin) => (!u || typeof u !== 'string' || u.startsWith('data:') || u.startsWith('blob:') ? '' : /^https?:/.test(u) ? u : u.startsWith('/') ? origin + u : '');

// ---------- Yapılandırılmış veri (schema.org)
// Site (WebSite) ve kişi (Person) her sayfada aynı @id ile tanımlanır; yazılar bu kimliklere bağlanır.
// Google site adını ve yazarı, yapay zeka araçları "kim yazdı, ne konuda yazar" bilgisini buradan okur.
const KNOWS_ABOUT = ['Yapay zeka', 'Prompt yazımı', 'Proje yönetimi', 'Dijital ürün yönetimi'];
// Hakkımda metninde zaten yazılı (kamuya açık bilgi).
const ALUMNI_OF = { '@type': 'CollegeOrUniversity', name: 'Marmara Üniversitesi' };
export function identityLd(c, origin = 'https://ucpehlivan.web.app') {
  const s = c.settings || {};
  const bio = (((c.home || {}).about || {}).paragraphs || [])[0];
  const person = {
    '@type': 'Person', '@id': `${origin}/#person`, name: s.name, url: `${origin}/`,
    ...(s.role ? { jobTitle: s.role } : {}), ...(bio ? { description: bio } : {}),
    ...(s.email ? { email: `mailto:${s.email}` } : {}), knowsAbout: KNOWS_ABOUT, alumniOf: ALUMNI_OF,
    sameAs: accounts(c).map((a) => a.url).filter((u) => /^https?:/.test(u)),
  };
  const site = {
    '@type': 'WebSite', '@id': `${origin}/#website`, url: `${origin}/`, name: s.name,
    ...(s.seoDescription ? { description: s.seoDescription } : {}), inLanguage: 'tr', publisher: { '@id': `${origin}/#person` },
  };
  return [site, person];
}
export function articleLd({ url, headline, description, datePublished, dateModified, image }, origin = 'https://ucpehlivan.web.app') {
  return {
    '@type': 'BlogPosting', '@id': `${url}#article`, headline, ...(description ? { description } : {}),
    datePublished, dateModified: dateModified || datePublished, inLanguage: 'tr', ...(image ? { image } : {}),
    author: { '@id': `${origin}/#person` }, publisher: { '@id': `${origin}/#person` },
    isPartOf: { '@id': `${origin}/#website` }, mainEntityOfPage: url,
  };
}
// Sayfa yolu: Google sonuçta çıplak adres yerine "Ana sayfa › Yazılar › Yazı" gösterir. items: [[ad, yol], …]
export function breadcrumbLd(items, origin = 'https://ucpehlivan.web.app') {
  return { '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: origin + path })) };
}
// Soru-cevap: yazının bölüm sorularını ve yazıda görünen cevaplarını işaretler. items: [{ q, a }, …]
export function faqLd(items = [], url = '') {
  return { '@type': 'FAQPage', ...(url ? { '@id': `${url}#faq`, url } : {}), inLanguage: 'tr', mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
}
const graph = (...items) => ({ '@context': 'https://schema.org', '@graph': items.flat() });

export function layout(c, { title, ogTitle = '', description, type = 'website', jsonld, noindex = false, path = '/', home = false, origin = 'https://ucpehlivan.web.app', version = '', image = '', imageAlt = '', body }) {
  const s = c.settings || {};
  const canonical = origin + path;
  const pageTitle = title || s.seoTitle || s.name;
  const desc = description || s.seoDescription || '';
  const p = home ? '' : '/';
  // Paylaşım görseli: sayfaya özel yoksa site geneli /og.png (1200x630).
  const img = absUrl(image, origin) || origin + '/og.png';
  const imgAlt = imageAlt || pageTitle;
  const accs = accounts(c);
  const ld = jsonld || graph(identityLd(c, origin));
  const secs = activeSections((c.home || {}));
  const navLink = (k) => { const [id, label] = NAV[k]; if (k === 'blog') return `<a href="${home ? '#yazilar' : '/blog/'}"${path.startsWith('/blog') ? ' aria-current="page"' : ''}>${label}</a>`; return `<a href="${p}#${id}">${label}</a>`; };
  const shown = (k) => NAV[k] && (k !== 'videos' || (c.videos || []).length > 0);
  const navs = secs.filter(shown).map(navLink).join('');
  const footPages = secs.filter((k) => shown(k) && k !== 'accounts').map((k) => (k === 'blog' ? '<a href="/blog/">Yazılar</a>' : `<a href="/#${NAV[k][0]}">${NAV[k][1]}</a>`)).join('');
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(pageTitle)}</title>
<meta name="description" content="${e(desc)}">
<link rel="canonical" href="${e(canonical)}">
<link rel="alternate" type="application/rss+xml" title="${e(s.name)}" href="/feed.xml">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${e(s.name)}">
<meta property="og:title" content="${e(ogTitle || pageTitle)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${e(canonical)}">
<meta property="og:locale" content="tr_TR">
<meta property="og:image" content="${e(img)}">
${image ? '' : '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'}<meta property="og:image:alt" content="${e(imgAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="ucp-version" content="${e(version || c.version || '')}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#F8F2E6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141A30" media="(prefers-color-scheme: dark)">
<link rel="preload" href="/assets/fonts/schibsted-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/brand/pehlivan-tokens.css?v=${ASSET_V}">
<link rel="stylesheet" href="/assets/main.css?v=${ASSET_V}">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${s.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${e(s.gaId)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${e(s.gaId)}');</script>` : ''}
</head>
<body>
<div class="guides" aria-hidden="true"><div class="wrap"><i></i><i></i><i></i><i></i></div></div>
<div class="progress" aria-hidden="true"><i></i></div>
<header>
  <div class="wrap bar">
    <a class="logo" href="/" aria-label="${e(s.name)}, ana sayfa">${logoSvg('lgm-h')}</a>
    <nav aria-label="Ana menü">${navs}</nav>
    <div class="tools" style="display:flex;gap:10px;align-items:center">
      <button class="icon-btn" id="theme" type="button" aria-label="Açık ve koyu tema arasında geçiş yap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
    </div>
  </div>
</header>
<main id="top">
${body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div><a class="logo" href="/" style="padding:0" aria-label="${e(s.name)}, ana sayfa">${logoSvg('lgm-f', ' logo-svg-lg')}</a><p class="foot-tag">${e(s.footerTagline)}</p><a class="mail" href="mailto:${e(s.email)}">${e(s.email)}</a></div>
      ${footPages ? `<div><h4>Keşfet</h4>${footPages}</div>` : ''}
      ${accs.length ? `<div><h4>Hesaplar</h4>${accs.map((a) => `<a href="${e(a.url)}"${tgt(a.url)}>${e(a.name)}</a>`).join('')}</div>` : ''}
      ${s.location ? `<div><h4>Konum</h4><span>${e(s.location)}</span></div>` : ''}
    </div>
    <div class="copy"><span>© <span id="yr">${new Date().getFullYear()}</span> ${e(s.name)}</span><span>${e(s.footerNote)}</span></div>
  </div>
</footer>
<script src="/assets/main.js?v=${ASSET_V}"></script>
<script type="module" src="/assets/app.js?v=${ASSET_V}"></script>
</body>
</html>`;
}

const SECTIONS = {
  hero(c) {
    const hero = (c.home || {}).hero || {};
    const secs = activeSections(c.home || {});
    const main = mainAccount(c);
    const badgeHref = secs.includes('accounts') ? '#iletisim' : main ? main.url : '';
    return `<section class="hero"><div class="wrap">
  ${hero.badge ? `<p class="status"><svg class="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${e(hero.badge)}</p>` : ''}
  <h1 class="d mega" aria-label="${e(hero.ariaLabel)}">${(hero.lines || []).map((l) => `<span class="ln" aria-hidden="true"><span>${[e(l.before), PILLS[l.pill] || '', e(l.after)].filter(Boolean).join(' ')}</span></span>`).join(' ')}</h1>
  <div class="hero-foot">
    <div class="hero-copy"><p>${e(hero.text)}</p>
      ${hero.buttonLabel && secs.includes('blog') ? `<div class="cta"><a class="btn btn-cv" href="#yazilar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>${e(hero.buttonLabel)}</a></div>` : ''}</div>
    ${badgeHref && hero.badgeText ? `<a class="badge" href="${e(badgeHref)}"${tgt(badgeHref)} aria-label="Hesaplarıma git"><svg class="ring" viewBox="0 0 132 132" aria-hidden="true"><defs><path id="circ" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0"/></defs><text><textPath href="#circ">${e(hero.badgeText)}</textPath></text></svg><span class="core"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg></span></a>` : ''}
  </div>
</div></section>`;
  },
  blog(c) {
    const bl = (c.home || {}).blog || {};
    const latest = (c.posts || []).slice(0, bl.count ?? 6);
    if (!latest.length) return '';
    return `<section class="block" id="yazilar" style="padding-top:40px"><div class="wrap"><div class="head"><div>${bl.kicker ? `<span class="kicker">${e(bl.kicker)}</span>` : ''}<h2 class="d">${e(bl.title)}</h2></div>${bl.intro ? `<p>${e(bl.intro)}</p>` : ''}</div>${filterBar(c, latest)}<div class="bgrid${latest.length >= 3 ? ' feat' : ''}" data-grid>${latest.map(postCard).join('')}</div>${(c.posts || []).length > latest.length || bl.allLabel ? `<div style="margin-top:28px"><a class="btn btn-ghost" href="/blog/">${e(bl.allLabel || 'Tüm yazıları gör')}</a></div>` : ''}</div></section>`;
  },
  videos(c) {
    const vd = (c.home || {}).videos || {};
    const list = (c.videos || []).slice(0, vd.count ?? 3);
    if (!list.length) return '';
    const kanal = vd.channelUrl || 'https://www.youtube.com/@pehlivanai';
    return `<section class="block" id="videolar" style="padding-top:40px"><div class="wrap"><div class="head"><div><span class="kicker">${e(vd.kicker || 'YouTube')}</span><h2 class="d">${e(vd.title || 'Videolar')}</h2></div>${vd.intro ? `<p>${e(vd.intro)}</p>` : ''}</div><div class="bgrid${list.length === 2 ? ' two' : ''}">${list.map(videoCard).join('')}</div><div style="margin-top:28px"><a class="btn btn-ghost" href="${e(kanal)}" target="_blank" rel="noopener">${e(vd.allLabel || 'Kanala git')} ↗</a></div></div></section>`;
  },
  about(c) {
    const ab = (c.home || {}).about || {};
    const ill = ab.illustration !== false;
    return `<section class="block" id="hakkimda" style="padding-top:40px"><div class="wrap about ${ill ? 'about2' : 'about1'}">
  ${ill ? ILLUSTRATION : ''}
  <div>${ab.kicker ? `<span class="kicker">${e(ab.kicker)}</span>` : ''}<h2 class="d">${e(ab.title)}</h2>${(ab.paragraphs || []).map((x) => `<p class="lead">${e(x)}</p>`).join('')}${(ab.facts || []).length ? `<div class="about-facts">${ab.facts.map((f) => `<span>${e(f)}</span>`).join('')}</div>` : ''}</div>
</div></section>`;
  },
  accounts(c) {
    const ac = (c.home || {}).accounts || {};
    const list = accounts(c);
    if (!list.length) return '';
    const ill = ac.illustration !== false;
    const head = `<div class="head"><div>${ac.kicker ? `<span class="kicker">${e(ac.kicker)}</span>` : ''}<h2 class="d">${nl(ac.title)}</h2></div>${ac.intro ? `<p>${e(ac.intro)}</p>` : ''}</div>`;
    const rows = `<div class="acc">${list.map((a) => `<a class="acc-row${a.highlight ? ' hot' : ''}" href="${e(a.url)}"${tgt(a.url)}><span class="acc-ic">${accSvg(a.icon)}</span><span class="acc-tx"><b>${e(a.name)}</b>${a.sub ? `<small>${e(a.sub)}</small>` : ''}</span><span class="acc-go" aria-hidden="true">${/^https?:/.test(a.url) ? '↗' : '→'}</span></a>`).join('')}</div>`;
    return `<section class="block" id="iletisim" style="padding-top:40px"><div class="wrap">
  ${ill ? `<div class="acc-wrap has-ill"><div>${head}${rows}</div>${ACC_ILLUSTRATION}</div>` : head + rows}
</div></section>`;
  },
};

export function renderHome(c, opts = {}) {
  const body = activeSections(c.home || {}).map((k) => SECTIONS[k](c)).join('\n\n');
  return layout(c, { ...opts, home: true, path: '/', body });
}

// /blog/ meta açıklaması: sayfadaki giriş cümlesi + arama sonucu için tamamlayıcı cümle (toplam ≤155).
const BLOG_DESC_EXTRA = 'Her gün yapay zeka kullanan bir proje yöneticisinden notlar, promptlar ve araç denemeleri.';
export function renderBlogIndex(c, opts = {}) {
  const s = c.settings || {}, bl = (c.home || {}).blog || {}, posts = c.posts || [];
  const main = mainAccount(c);
  const body = `<section class="bhero"><div class="wrap">${bl.kicker ? `<span class="kicker">${e(bl.kicker)}</span>` : ''}<h1 class="d">${e(bl.pageTitle || bl.title)}</h1>${bl.pageIntro ? `<p>${e(bl.pageIntro)}</p>` : ''}</div></section>
<section><div class="wrap">${posts.length ? `${filterBar(c, posts)}<div class="bgrid ${posts.length >= 3 ? 'feat' : 'two'}" data-grid>${posts.map(postCard).join('')}</div>` : '<p class="bempty">Henüz yayınlanmış yazı yok.</p>'}
${main ? `<p class="bempty">Yeni yazılar yolda. Kaçırmamak için <a href="${e(main.url)}"${tgt(main.url)}>${e(main.name)}</a> hesabımı takip edin.</p>` : ''}</div></section>`;
  const origin = opts.origin || 'https://ucpehlivan.web.app';
  const blogLd = {
    '@type': 'Blog', '@id': `${origin}/blog/#blog`, url: `${origin}/blog/`, name: `${bl.pageTitle || bl.title || 'Yazılar'} | ${s.name}`,
    ...(bl.pageIntro || bl.intro ? { description: bl.pageIntro || bl.intro } : {}), inLanguage: 'tr',
    publisher: { '@id': `${origin}/#person` }, isPartOf: { '@id': `${origin}/#website` },
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: origin + postHref(p), datePublished: p.publishedAt, dateModified: p.updatedAt || p.publishedAt, author: { '@id': `${origin}/#person` } })),
  };
  return layout(c, { ...opts, title: `${bl.pageTitle || bl.title || 'Yazılar'} | ${s.name}`, description: bl.seoDescription || [bl.pageIntro || bl.intro, BLOG_DESC_EXTRA].filter(Boolean).join(' '), path: '/blog/', jsonld: graph(identityLd(c, origin), blogLd), body });
}

export function renderPost(c, post, opts = {}) {
  const s = c.settings || {};
  // Özel sayfası olan yazı: /blog/ adresi o sayfaya yönlenir.
  if (postHref(post) !== `/blog/${post.slug}/`) {
    const to = postHref(post), o = opts.origin || 'https://ucpehlivan.web.app';
    return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${e(post.title)}</title><link rel="canonical" href="${e(o + to)}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${e(to)}"><script>location.replace(${JSON.stringify(to).replace(/</g, '\\u003c')})</script></head><body><a href="${e(to)}">${e(post.title)}</a></body></html>`;
  }
  const others = (c.posts || []).filter((p) => p.slug !== post.slug).slice(0, 2);
  const origin = opts.origin || 'https://ucpehlivan.web.app';
  const main = mainAccount(c);
  const ld = graph(identityLd(c, origin), articleLd({ url: `${origin}/blog/${post.slug}/`, headline: post.title, description: post.seoDescription || post.excerpt, datePublished: post.publishedAt, dateModified: post.updatedAt, image: (post.coverStyle === 'image' && absUrl(post.coverImage, origin)) || `${origin}/og.png` }, origin), breadcrumbLd([['Ana sayfa', '/'], ['Yazılar', '/blog/'], [post.title, `/blog/${post.slug}/`]], origin));
  const body = `<article>
  <div class="narrow post-head"><a class="back" href="/blog/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>Tüm yazılar</a>
    <p class="bmeta">${post.category ? `<span class="chip">${e(post.category)}</span>` : ''}<time datetime="${e(post.publishedAt)}">${trDate(post.publishedAt)}</time>${post.readingMinutes ? `<span>${e(post.readingMinutes)} dk okuma</span>` : ''}</p>
    <h1 class="d">${e(post.title)}</h1>${post.lede ? `<p class="lede">${e(post.lede)}</p>` : ''}</div>
  <div class="post-cover">${cover(post)}</div>
  <div class="narrow prose">${post.body || ''}
    <div class="post-cta"><h3>Yeni yazıları kaçırmayın</h3><div class="acts">${main ? `<a class="btn btn-ink" href="${e(main.url)}"${tgt(main.url)}>${e(main.name)}’de takip et</a>` : ''}<a class="btn btn-ghost" href="/blog/">Tüm yazılar</a></div></div>
  </div>
</article>
${others.length ? `<section class="more-posts"><div class="wrap"><h2 class="d">Diğer yazılar</h2><div class="bgrid two">${others.map(postCard).join('')}</div></div></section>` : ''}`;
  return layout(c, { ...opts, title: `${post.title} | ${s.name}`, description: post.seoDescription || post.excerpt, type: 'article', jsonld: ld, image: post.coverStyle === 'image' ? post.coverImage : '', imageAlt: post.title, path: `/blog/${post.slug}/`, body });
}

export function render404(c, opts = {}) {
  const body = `<section class="bhero"><div class="wrap"><span class="kicker">404</span><h1 class="d">Bu sayfa burada yok</h1><p>Aradığınız sayfa taşınmış veya hiç oluşturulmamış olabilir. Ana sayfaya dönün veya yazılara göz atın.</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:32px"><a class="btn btn-ink" href="/">Ana sayfaya dön</a><a class="btn btn-ghost" href="/blog/">Yazılar</a></div></div></section>`;
  return layout(c, { ...opts, title: 'Sayfa bulunamadı', noindex: true, path: '/404', body });
}

export function renderSitemap(c, origin = 'https://ucpehlivan.web.app') {
  // Görselli kapak varsa Google Görseller için <image:image> eklenir.
  const dated = (c.posts || []).map((p) => [postHref(p), p.updatedAt || p.publishedAt, p.coverStyle === 'image' ? absUrl(p.coverImage, origin) : '']);
  // Ana sayfa ve yazı listesi en son yazıyla değişir: tarihleri en yeni yazının tarihi.
  const latest = dated.map(([, d]) => String(d || '').slice(0, 10)).filter(Boolean).sort().pop() || '';
  const urls = [['/', latest], ['/blog/', latest]].concat(dated);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.map(([u, d, img]) => `  <url><loc>${origin}${u}</loc>${d ? `<lastmod>${String(d).slice(0, 10)}</lastmod>` : ''}${img ? `<image:image><image:loc>${e(img)}</image:loc></image:image>` : ''}</url>`).join('\n')}\n</urlset>\n`;
}

// RSS 2.0 beslemesi (/feed.xml): okuyucu uygulamaları ve içerik toplayıcılar yeni yazıları buradan bulur.
// Tarihler yazılardan gelir (yayın anı değil): içerik değişmedikçe dosya da değişmez.
const rfc822 = (iso) => { const d = new Date(String(iso || '').length === 10 ? `${iso}T09:00:00+03:00` : iso); return Number.isNaN(d.getTime()) ? '' : d.toUTCString(); };
export function renderFeed(c, origin = 'https://ucpehlivan.web.app') {
  const s = c.settings || {}, bl = (c.home || {}).blog || {};
  const posts = c.posts || [];
  const latest = posts.map((p) => p.updatedAt || p.publishedAt).filter(Boolean).sort().pop();
  const items = posts.map((p) => {
    const url = origin + postHref(p);
    return `    <item>
      <title>${e(p.title)}</title>
      <link>${e(url)}</link>
      <guid isPermaLink="true">${e(url)}</guid>
      <pubDate>${rfc822(p.publishedAt)}</pubDate>
      <dc:creator>${e(s.name)}</dc:creator>${String(p.category || '').trim() ? `\n      <category>${e(String(p.category).trim())}</category>` : ''}
      <description>${e(p.seoDescription || p.excerpt)}</description>
    </item>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${e(`${bl.pageTitle || bl.title || 'Yazılar'} | ${s.name}`)}</title>
    <link>${origin}/blog/</link>
    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${e(s.seoDescription || s.footerTagline || '')}</description>
    <language>tr</language>${latest ? `\n    <lastBuildDate>${rfc822(latest)}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>
`;
}

// llms.txt: yapay zeka araçlarına sitenin ne olduğunu ve önemli sayfalarını anlatan düz metin (llmstxt.org).
export function renderLlms(c, origin = 'https://ucpehlivan.web.app') {
  const s = c.settings || {}, bl = (c.home || {}).blog || {};
  const one = (v) => String(v || '').replace(/\s+/g, ' ').trim();
  const about = (((c.home || {}).about || {}).paragraphs || []).map(one).filter(Boolean);
  // İnteraktif yazıların (/yazi/…) düz metin sürümü de verilir: build-yazi.mjs index.md üretir.
  const posts = (c.posts || []).map((p) => { const h = postHref(p); return `- [${one(p.title)}](${origin}${h}): ${one(p.seoDescription || p.excerpt)}${h.startsWith('/yazi/') ? ` Düz metin: ${origin}${h}index.md` : ''}`; });
  const accs = accounts(c).filter((a) => /^https?:/.test(a.url)).map((a) => `- [${one(a.name)}](${a.url})`);
  const vids = (c.videos || []).slice(0, 10).map((v) => `- [${one(v.title)}](https://www.youtube.com/watch?v=${v.id}) (${String(v.published || '').slice(0, 10)})`);
  return [`# ${one(s.name)}`, '', `> ${one(s.seoDescription || s.footerTagline)}`, '', ...(about.length ? [about.join(' '), ''] : []),
    'Site Türkçedir. Yazılar, yapay zekayı her gün gerçek işte kullanan bir proje yöneticisinin notları ve deneyimleridir.', '',
    `## ${one(bl.pageTitle || bl.title || 'Yazılar')}`, '', ...(posts.length ? posts : ['- Henüz yazı yok.']), '',
    ...(vids.length ? ['## Videolar', '', ...vids, ''] : []),
    '## Sayfalar', '', `- [Ana sayfa](${origin}/)`, `- [Tüm yazılar](${origin}/blog/)`, `- [Hakkımda](${origin}/#hakkimda)`, `- [RSS beslemesi](${origin}/feed.xml)`, '',
    ...(accs.length ? ['## Hesaplar', '', ...accs, ''] : [])].join('\n');
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
