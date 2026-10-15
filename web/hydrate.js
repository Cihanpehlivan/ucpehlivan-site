// Ziyaretçinin tarayıcısında çalışır. Firestore'daki yayın paketini okur.
// Paket, sayfadaki sürümden yeniyse sayfayı yeni içerikle tekrar çizer.
import { renderPath, collectMedia, resolveMedia } from '../shared/render.js';

export function decode(v) {
  if (!v || typeof v !== 'object') return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode);
  if ('mapValue' in v) return fields(v.mapValue.fields || {});
  return null;
}
const fields = (f) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, decode(v)]));

async function getDoc(api, pid, path) {
  const r = await fetch(`${api}/projects/${pid}/databases/(default)/documents/${path}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return fields((await r.json()).fields || {});
}

(async () => {
  try {
    const cfg = await (await fetch('/__/firebase/init.json')).json();
    const api = cfg.firestoreApi || 'https://firestore.googleapis.com/v1';
    const bundle = await getDoc(api, cfg.projectId, 'site/public');
    const current = document.querySelector('meta[name="ucp-version"]')?.content || '';
    if (!bundle.version || String(bundle.version) === current) return;
    const ids = [...collectMedia(bundle)];
    const map = {};
    await Promise.all(ids.map(async (id) => {
      try {
        const d = (await getDoc(api, cfg.projectId, `media/${id}`)).data || '';
        // PDF gibi dosyalar yeni sekmede açılabilsin diye blob adresine çevrilir.
        map[id] = d.startsWith('data:image/') ? d : URL.createObjectURL(await (await fetch(d)).blob());
      } catch {}
    }));
    const c = resolveMedia(bundle, map);
    let path = location.pathname;
    if (path === '/blog/post.html') path = '/blog/';
    const { html } = renderPath(c, path, { origin: location.origin, version: bundle.version });
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const y = scrollY;
    document.title = doc.title;
    for (const sel of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="ucp-version"]']) {
      const a = document.querySelector(sel), b = doc.querySelector(sel);
      if (a && b) a.setAttribute('content', b.getAttribute('content'));
    }
    document.body.innerHTML = doc.body.innerHTML;
    document.body.querySelectorAll('script').forEach((s) => s.remove());
    if (window.ucpInit) window.ucpInit();
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView(); else scrollTo(0, y);
  } catch (err) {
    if ((document.querySelector('meta[name="ucp-version"]')?.content || '') === 'shell') {
      const m = document.querySelector('main');
      if (m) m.innerHTML = '<section class="bhero"><div class="wrap"><span class="kicker">404</span><h1 class="d">Bu sayfa planda yok</h1><p>Aradığınız yazı bulunamadı.</p><div style="margin-top:32px"><a class="btn btn-ink" href="/blog/">Tüm yazılar</a></div></div></section>';
    }
    console.warn('[ucp] Canlı içerik yüklenemedi, sayfanın kayıtlı sürümü gösteriliyor.', err);
  }
})();
