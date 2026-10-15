export const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  return el;
};
export const clone = (o) => JSON.parse(JSON.stringify(o ?? null));
export const slugify = (s = '') => s.toLocaleLowerCase('tr-TR')
  .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
export const readingMinutes = (html = '') => {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
const ALLOWED = { P: [], H2: [], H3: [], UL: [], OL: [], LI: [], BLOCKQUOTE: [], B: [], STRONG: [], I: [], EM: [], A: ['href'], IMG: ['src', 'alt'], FIGURE: [], FIGCAPTION: [], BR: [] };
export function sanitize(html = '') {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) continue;
      if (child.nodeType !== 1) { child.remove(); continue; }
      const tag = child.tagName;
      if (tag === 'DIV') { const p = doc.createElement('p'); p.append(...child.childNodes); child.replaceWith(p); walk(p); continue; }
      if (tag === 'H1' || tag === 'H4' || tag === 'H5' || tag === 'H6') { const x = doc.createElement('h3'); x.append(...child.childNodes); child.replaceWith(x); walk(x); continue; }
      if (!(tag in ALLOWED)) { child.replaceWith(...child.childNodes); continue; }
      for (const a of [...child.attributes]) if (!ALLOWED[tag].includes(a.name)) child.removeAttribute(a.name);
      if (tag === 'A') { const href = child.getAttribute('href') || ''; if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) child.removeAttribute('href'); else if (/^https?:/i.test(href)) { child.setAttribute('target', '_blank'); child.setAttribute('rel', 'noopener'); } }
      if (tag === 'IMG') { const src = child.getAttribute('src') || ''; if (!/^(https?:|\/|media:)/i.test(src)) { child.remove(); continue; } child.setAttribute('loading', 'lazy'); }
      walk(child);
    }
  };
  const root = doc.body.firstChild;
  walk(root);
  return root.innerHTML.replace(/<p>(\s|<br>)*<\/p>/g, '').trim();
}
const readAsDataUrl = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
// Görseli küçültür, WebP'ye çevirir ve Firestore'a sığacak boyuta indirir (en fazla ~700 KB).
export async function fileToDataUrl(file) {
  const LIMIT = 700 * 1024;
  if (file.type === 'image/svg+xml' || file.type === 'image/gif' || file.type === 'application/pdf') {
    if (file.size > LIMIT) throw new Error(`Dosya çok büyük (${Math.round(file.size / 1024)} KB). En fazla 700 KB olabilir.`);
    return { dataUrl: await readAsDataUrl(file), type: file.type };
  }
  if (!/^image\//.test(file.type)) throw new Error('Sadece görsel veya PDF yükleyebilirsin.');
  const bmp = await createImageBitmap(file);
  for (const [max, q] of [[1600, 0.82], [1400, 0.75], [1200, 0.7], [1000, 0.65], [800, 0.6]]) {
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', q));
    if (blob && blob.size * 1.37 < LIMIT) return { dataUrl: await readAsDataUrl(blob), type: 'image/webp' };
  }
  throw new Error('Görsel sıkıştırıldıktan sonra da çok büyük. Daha küçük bir görsel dene.');
}
export function toast(msg, kind = 'ok') {
  const el = h('div', { class: `toast ${kind}`, role: 'status' }, msg);
  document.body.append(el);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => el.remove(), 3000);
}
