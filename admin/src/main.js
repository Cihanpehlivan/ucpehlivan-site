import { h, clone, toast, readingMinutes, slugify } from './util.js';
import { createStore, ADMIN_EMAIL, buildBundle } from './store.js';
import { renderForm } from './form.js';
import { settingsSchema, homeSections, caseSchema, postSchema, newCase, newPost } from './schema.js';
import { renderHome as rHome, renderPost as rPost, renderBlogIndex as rBlog, collectMedia, resolveMedia } from '../../shared/render.js';

const app = document.getElementById('app');
let store, seed, data, user, gateMsg = null;
let dirty = false, saveFn = null, previewFn = null, previewOn = localStorage.getItem('ucp-admin-preview') !== '0';

const ICON = {
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  cases: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>',
  posts: '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  ext: '<path d="M14 4h6v6M10 14L20 4M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/>',
  out: '<path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

// Önizlemede media:ID görsellerini çözer; eksik olanları yükleyip önizlemeyi yeniler.
const pending = new Set();
function R(c) {
  const map = {};
  for (const id of collectMedia(c)) {
    const v = store.mediaSync(id);
    if (v !== undefined) map[id] = v;
    else if (!pending.has(id)) { pending.add(id); store.media(id).then(() => { pending.delete(id); schedulePreview(); }); }
  }
  return resolveMedia(c, map);
}
const renderHome = (c) => rHome(R(c));
const renderPost = (c, p) => { const r = R({ ...c, __p: p }); const { __p, ...rest } = r; return rPost(rest, __p); };
const renderBlogIndex = (c) => rBlog(R(c));
const publish = () => store.publish(buildBundle(data));
const mediaImg = (ref) => { const i = h('img', { alt: '' }); if (!ref) return null; if (ref.startsWith('media:')) store.media(ref.slice(6)).then((u) => { i.src = u; }); else i.src = ref; return i; };
const sortCases = (arr) => [...arr].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
const published = () => data.posts.filter((p) => p.status === 'published' && p.slug).sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
const siteContent = (over = {}) => ({ settings: data.settings, home: data.home, cases: sortCases(data.cases).filter((c) => c.visible !== false), posts: published(), ...over });

function setDirty(v) { dirty = v; const s = document.getElementById('status'); if (s) { s.textContent = v ? 'Kaydedilmemiş değişiklik var' : 'Tüm değişiklikler kaydedildi'; s.className = 'status ' + (v ? 'warn' : 'ok'); } const b = document.getElementById('saveBtn'); if (b) b.disabled = !v; }
addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

let lastHash = location.hash;
addEventListener('hashchange', () => {
  if (dirty && !confirm('Kaydedilmemiş değişiklikler kaybolacak. Devam edilsin mi?')) { history.replaceState(null, '', lastHash); return; }
  lastHash = location.hash; setDirty(false); route();
});

// ---------- Önizleme
let pvTimer;
function schedulePreview() { clearTimeout(pvTimer); pvTimer = setTimeout(drawPreview, 350); }
function drawPreview() {
  const fr = document.getElementById('pvFrame'); if (!fr || !previewFn || !previewOn) return;
  const { html, anchor } = previewFn();
  let y = 0; try { y = fr.contentWindow.scrollY; } catch {}
  const first = !fr.dataset.loaded;
  fr.onload = () => { fr.dataset.loaded = '1'; try { const w = fr.contentWindow; if (first && anchor) { const el = w.document.getElementById(anchor); if (el) w.scrollTo(0, el.getBoundingClientRect().top + w.scrollY - 80); } else w.scrollTo(0, y); w.document.addEventListener('click', (ev) => { if (ev.target.closest('a')) ev.preventDefault(); }, true); } catch {} };
  fr.srcdoc = html.replace('<head>', `<head><base href="${location.origin}/">`).replace('<script type="module" src="/assets/app.js"></script>', '');
}

// ---------- Kabuk
function shell(active, title, content, { actions = [], preview = null } = {}) {
  previewFn = preview;
  const nav = (key, href, label) => h('a', { href, class: 'nav-i' + (active === key ? ' on' : ''), 'aria-current': active === key ? 'page' : null }, h('span', { html: svg(key) }), label);
  const pvBtn = preview ? h('button', { type: 'button', class: 'btn ghost', 'aria-pressed': String(previewOn), onclick: () => { previewOn = !previewOn; localStorage.setItem('ucp-admin-preview', previewOn ? '1' : '0'); route(); } }, h('span', { html: svg('eye') }), previewOn ? 'Önizlemeyi gizle' : 'Önizlemeyi göster') : null;
  const main = h('main', { class: 'main' + (preview && previewOn ? ' with-pv' : '') },
    h('div', { class: 'top' }, h('div', {}, h('h1', {}, title), h('p', { id: 'status', class: 'status ok' }, 'Tüm değişiklikler kaydedildi')), h('div', { class: 'top-acts' }, pvBtn, ...actions)),
    h('div', { class: 'cols' }, h('div', { class: 'edit' }, content), preview && previewOn ? h('div', { class: 'pv' }, h('div', { class: 'pv-bar' }, h('span', {}, 'Canlı önizleme'), h('small', {}, 'Kaydetmeden önce değişiklikleri burada gör')), h('iframe', { id: 'pvFrame', title: 'Önizleme' })) : null));
  app.replaceChildren(h('div', { class: 'shell' },
    h('aside', { class: 'side' },
      h('div', { class: 'brand' }, h('b', {}, 'UCP'), h('span', {}, 'Site yönetimi')),
      h('nav', { 'aria-label': 'Yönetim menüsü' }, nav('home', '#/home/hero', 'Ana sayfa'), nav('cases', '#/cases', 'Öne çıkan işler'), nav('posts', '#/posts', 'Blog yazıları'), nav('settings', '#/settings', 'Site ayarları')),
      h('div', { class: 'side-foot' },
        h('a', { class: 'nav-i', href: '/', target: '_blank', rel: 'noopener' }, h('span', { html: svg('ext') }), 'Siteyi aç'),
        h('button', { type: 'button', class: 'nav-i', onclick: () => store.signOut() }, h('span', { html: svg('out') }), 'Çıkış yap'),
        h('p', { class: 'who' }, user?.email || '', store.mode === 'mock' ? h('em', {}, ' (deneme modu)') : null))),
    main));
  setDirty(false);
  if (preview && previewOn) drawPreview();
}
const saveButton = (label = 'Kaydet') => h('button', { id: 'saveBtn', type: 'button', class: 'btn primary', disabled: true, onclick: () => saveFn && saveFn() }, label);
addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); if (dirty && saveFn) saveFn(); } });

async function guard(fn, okMsg = 'Kaydedildi. Site güncellendi.') {
  const b = document.getElementById('saveBtn'); if (b) { b.disabled = true; b.textContent = 'Kaydediliyor…'; }
  try { await fn(); await publish(); setDirty(false); toast(okMsg); }
  catch (err) { console.error(err); toast('Kaydedilemedi: ' + (err.message || err), 'err'); setDirty(true); }
  if (b) b.textContent = 'Kaydet';
}

// ---------- Sayfalar
function homeView(sectionKey) {
  const sec = homeSections.find((s) => s.key === sectionKey) || homeSections[0];
  const work = clone(data.home);
  work[sec.key] = work[sec.key] || {};
  const tabs = h('div', { class: 'tabs', role: 'tablist' }, homeSections.map((s) => h('a', { href: `#/home/${s.key}`, role: 'tab', class: 'tab' + (s.key === sec.key ? ' on' : ''), 'aria-selected': String(s.key === sec.key) }, s.title)));
  const form = renderForm(sec.fields, work[sec.key], { onChange: () => { setDirty(true); schedulePreview(); }, upload: (f) => store.upload(f), media: (id) => store.media(id) });
  saveFn = () => guard(async () => { await store.saveHome(work); data.home = clone(work); });
  shell('home', 'Ana sayfa', h('div', {}, tabs, h('section', { class: 'card' }, h('h2', {}, sec.title), form)), { actions: [saveButton()], preview: () => ({ html: renderHome(siteContent({ home: work })), anchor: sec.anchor }) });
}

function settingsView() {
  const work = clone(data.settings);
  const form = renderForm(settingsSchema, work, { onChange: () => { setDirty(true); schedulePreview(); }, upload: (f) => store.upload(f), media: (id) => store.media(id) });
  saveFn = () => guard(async () => { if (!work.name || !work.email) throw new Error('Ad soyad ve e-posta zorunlu.'); await store.saveSettings(work); data.settings = clone(work); });
  shell('settings', 'Site ayarları', h('section', { class: 'card' }, form), { actions: [saveButton()], preview: () => ({ html: renderHome(siteContent({ settings: work })), anchor: 'iletisim' }) });
}

function casesList() {
  const list = sortCases(data.cases);
  const move = async (i, d) => {
    const a = list[i], b = list[i + d]; if (!a || !b) return;
    list.forEach((c, k) => { c.order = k + 1; });
    [a.order, b.order] = [b.order, a.order];
    try { await Promise.all([store.saveItem('cases', a), store.saveItem('cases', b)]); data.cases = data.cases.map((c) => (c.id === a.id ? a : c.id === b.id ? b : c)); await publish(); toast('Sıra güncellendi'); route(); } catch (err) { toast(err.message, 'err'); }
  };
  const rows = list.map((c, i) => h('div', { class: 'row-i' },
    h('div', { class: 'thumb', style: `background:${c.color || '#1E2025'}` }, mediaImg(c.screenshot)),
    h('a', { class: 'row-t', href: `#/cases/${c.id}` }, h('b', {}, c.name), h('small', {}, c.headline || '')),
    h('span', { class: 'chip ' + (c.visible === false ? 'muted' : 'ok') }, c.visible === false ? 'Gizli' : 'Sitede'),
    h('div', { class: 'row-a' },
      h('button', { type: 'button', class: 'ic', 'aria-label': 'Yukarı taşı', disabled: i === 0 ? true : null, onclick: () => move(i, -1) }, '↑'),
      h('button', { type: 'button', class: 'ic', 'aria-label': 'Aşağı taşı', disabled: i === list.length - 1 ? true : null, onclick: () => move(i, 1) }, '↓'),
      h('a', { class: 'btn-s', href: `#/cases/${c.id}` }, 'Düzenle'))));
  const add = h('button', { type: 'button', class: 'btn primary', onclick: async () => { const c = { ...newCase(), order: list.length + 1 }; const id = await store.saveItem('cases', c); data.cases.push({ ...c, id }); location.hash = `#/cases/${id}`; } }, '+ Yeni proje');
  shell('cases', 'Öne çıkan işler', h('section', { class: 'card' }, h('p', { class: 'lead-t' }, 'Kartlar sitede bu sırayla görünür. Okları kullanarak sırayı değiştir.'), rows.length ? h('div', { class: 'rows' }, rows) : h('p', { class: 'empty' }, 'Henüz proje yok.')), { actions: [add], preview: () => ({ html: renderHome(siteContent()), anchor: 'vakalar' }) });
}

function caseEdit(id) {
  const orig = data.cases.find((c) => c.id === id); if (!orig) { location.hash = '#/cases'; return; }
  const work = clone(orig);
  const form = renderForm(caseSchema, work, { onChange: () => { setDirty(true); schedulePreview(); }, upload: (f) => store.upload(f), media: (id) => store.media(id) });
  saveFn = () => guard(async () => { if (!work.name) throw new Error('Marka adı zorunlu.'); await store.saveItem('cases', work); Object.assign(orig, clone(work)); });
  const del = h('button', { type: 'button', class: 'btn danger', onclick: async () => { if (!confirm(`"${work.name}" kalıcı olarak silinsin mi?`)) return; await store.deleteItem('cases', id); data.cases = data.cases.filter((c) => c.id !== id); await publish(); setDirty(false); toast('Silindi'); location.hash = '#/cases'; } }, 'Sil');
  shell('cases', work.name || 'Proje', h('div', {}, h('a', { class: 'back', href: '#/cases' }, '← Tüm projeler'), h('section', { class: 'card' }, form)), { actions: [del, saveButton()], preview: () => ({ html: renderHome(siteContent({ cases: sortCases(data.cases.map((c) => (c.id === id ? work : c))).filter((c) => c.visible !== false) })), anchor: 'vakalar' }) });
}

function postsList() {
  const list = [...data.posts].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  const rows = list.map((p) => h('div', { class: 'row-i' },
    h('a', { class: 'row-t', href: `#/posts/${p.id}` }, h('b', {}, p.title || '(başlıksız)'), h('small', {}, [p.category, p.publishedAt].filter(Boolean).join(', '))),
    h('span', { class: 'chip ' + (p.status === 'published' ? 'ok' : 'muted') }, p.status === 'published' ? 'Yayında' : 'Taslak'),
    h('div', { class: 'row-a' }, p.status === 'published' ? h('a', { class: 'btn-s ghost', href: `/blog/${p.slug}/`, target: '_blank', rel: 'noopener' }, 'Sitede gör') : null, h('a', { class: 'btn-s', href: `#/posts/${p.id}` }, 'Düzenle'))));
  const add = h('button', { type: 'button', class: 'btn primary', onclick: async () => { const p = newPost(); const id = await store.saveItem('posts', p); data.posts.push({ ...p, id }); location.hash = `#/posts/${id}`; } }, '+ Yeni yazı');
  shell('posts', 'Blog yazıları', h('section', { class: 'card' }, h('p', { class: 'lead-t' }, 'Yayındaki yazılar kaydedince sitede hemen görünür. LinkedIn paylaşım önizlemesi için bilgisayarında "npm run publish" komutunu çalıştır.'), rows.length ? h('div', { class: 'rows' }, rows) : h('p', { class: 'empty' }, 'Henüz yazı yok. "+ Yeni yazı" ile başla.')), { actions: [add], preview: () => ({ html: renderBlogIndex(siteContent()), anchor: null }) });
}

function postEdit(id) {
  const orig = data.posts.find((p) => p.id === id); if (!orig) { location.hash = '#/posts'; return; }
  const work = clone(orig);
  const form = renderForm(postSchema, work, { onChange: () => { setDirty(true); schedulePreview(); }, upload: (f) => store.upload(f), media: (id) => store.media(id) });
  saveFn = () => guard(async () => {
    if (!work.title) throw new Error('Başlık zorunlu.');
    if (!work.slug) work.slug = slugify(work.title);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(work.slug)) throw new Error('Adres sadece küçük harf, rakam ve tire içerebilir.');
    if (data.posts.some((p) => p.id !== id && p.slug === work.slug)) throw new Error('Bu adres başka bir yazıda kullanılıyor.');
    if (!work.readingMinutes) work.readingMinutes = readingMinutes(work.body);
    await store.saveItem('posts', work); Object.assign(orig, clone(work));
  }, work.status === 'published' ? 'Kaydedildi. Yazı sitede yayında.' : 'Taslak kaydedildi. Taslaklar sitede görünmez.');
  const del = h('button', { type: 'button', class: 'btn danger', onclick: async () => { if (!confirm(`"${work.title}" kalıcı olarak silinsin mi?`)) return; await store.deleteItem('posts', id); data.posts = data.posts.filter((p) => p.id !== id); await publish(); setDirty(false); toast('Silindi'); location.hash = '#/posts'; } }, 'Sil');
  shell('posts', work.title || 'Yazı', h('div', {}, h('a', { class: 'back', href: '#/posts' }, '← Tüm yazılar'), h('section', { class: 'card' }, form)), { actions: [del, saveButton()], preview: () => ({ html: renderPost(siteContent({ posts: [work, ...published().filter((p) => p.id !== id)] }), { ...work, slug: work.slug || 'onizleme' }), anchor: null }) });
}

function route() {
  saveFn = null; previewFn = null;
  const [, sec, arg] = (location.hash || '#/home/hero').split('/');
  if (sec === 'cases') return arg ? caseEdit(arg) : casesList();
  if (sec === 'posts') return arg ? postEdit(arg) : postsList();
  if (sec === 'settings') return settingsView();
  return homeView(arg || 'hero');
}

// ---------- Giriş ve kurulum
function loginView(msg) {
  app.replaceChildren(h('div', { class: 'gate' }, h('div', { class: 'gate-card' },
    h('p', { class: 'brand' }, h('b', {}, 'UCP'), h('span', {}, 'Site yönetimi')),
    h('h1', {}, 'Giriş yap'),
    h('p', {}, 'Siteyi düzenlemek için yetkili Google hesabınla giriş yap.'),
    msg ? h('p', { class: 'gate-err', role: 'alert' }, msg) : null,
    h('button', { type: 'button', class: 'btn primary wide', onclick: () => store.signIn().catch((e) => loginView('Giriş başarısız: ' + e.message)) }, 'Google ile giriş yap'),
    store.mode === 'mock' ? h('p', { class: 'fld-h' }, 'Deneme modu: değişiklikler kaydedilmez, sayfa yenilenince sıfırlanır.') : null)));
}
function seedView() {
  app.replaceChildren(h('div', { class: 'gate' }, h('div', { class: 'gate-card' },
    h('h1', {}, 'Kurulum'),
    h('p', {}, 'Veritabanı boş. Sitedeki mevcut içeriği (metinler, 5 proje, 3 blog yazısı) tek tıkla yükle. Sonra her şeyi buradan düzenleyebilirsin.'),
    h('button', { type: 'button', class: 'btn primary wide', onclick: async (e) => { e.target.disabled = true; e.target.textContent = 'Yükleniyor…'; try { await store.seed(seed); toast('İçerik yüklendi'); await boot(); } catch (err) { toast(err.message, 'err'); e.target.disabled = false; e.target.textContent = 'Başlangıç içeriğini yükle'; } } }, 'Başlangıç içeriğini yükle'))));
}

async function boot() {
  app.replaceChildren(h('div', { class: 'gate' }, h('p', {}, 'Yükleniyor…')));
  data = await store.loadAll();
  if (!data.settings || !data.home) return seedView();
  data.cases.forEach((c, i) => { if (c.order == null) c.order = i + 1; });
  route();
}

(async () => {
  try { ({ store, seed } = await createStore()); }
  catch (err) { app.replaceChildren(h('div', { class: 'gate' }, h('div', { class: 'gate-card' }, h('h1', {}, 'Bağlantı hatası'), h('p', {}, err.message)))); return; }
  store.onUser(async (u) => {
    user = u;
    if (!u) { const m = gateMsg; gateMsg = null; return loginView(m); }
    if (u.email !== ADMIN_EMAIL) { gateMsg = `${u.email} hesabının bu paneli kullanma yetkisi yok.`; await store.signOut(); return; }
    try { await boot(); } catch (err) { console.error(err); loginView('Veri okunamadı: ' + err.message); }
  });
})();
