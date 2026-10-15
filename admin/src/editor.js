import { h, sanitize, toast } from './util.js';

const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
export function richEditor(value, onChange, upload, media) {
  const area = h('div', { class: 'rte-area prose', contenteditable: 'true', spellcheck: 'true' });
  area.innerHTML = value || '<p></p>';
  const src = h('textarea', { class: 'rte-src', hidden: true, spellcheck: 'false' });
  let mode = 'visual';
  // Firestore görselleri (media:ID) editörde gerçek görsel olarak gösterilir, kayıtta tekrar media:ID olur.
  const hydrateImgs = () => area.querySelectorAll('img[src^="media:"]').forEach(async (img) => { const id = img.getAttribute('src').slice(6); img.dataset.media = id; img.src = await media(id); });
  const toStored = () => { const c = area.cloneNode(true); c.querySelectorAll('img[data-media]').forEach((i) => { i.setAttribute('src', 'media:' + i.dataset.media); i.removeAttribute('data-media'); }); return c.innerHTML; };
  const emit = () => onChange(sanitize(mode === 'visual' ? toStored() : src.value));
  hydrateImgs();
  const cmd = (c, v = null) => { area.focus(); document.execCommand(c, false, v); emit(); };
  const block = (tag) => cmd('formatBlock', tag);
  const fileIn = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async () => {
    const f = fileIn.files[0]; if (!f) return;
    try { toast('Görsel yükleniyor…'); const ref = await upload(f); area.focus(); document.execCommand('insertHTML', false, `<figure><img src="${ref}" alt=""><figcaption></figcaption></figure><p></p>`); hydrateImgs(); emit(); toast('Görsel eklendi'); }
    catch (err) { toast(err.message, 'err'); }
    fileIn.value = '';
  } });
  const btn = (title, icon, fn) => h('button', { type: 'button', class: 'rte-btn', title, 'aria-label': title, html: icon, onmousedown: (e) => e.preventDefault(), onclick: fn });
  const bar = h('div', { class: 'rte-bar' },
    btn('Paragraf', '<b>P</b>', () => block('p')),
    btn('Ara başlık', '<b>H2</b>', () => block('h2')),
    btn('Alt başlık', '<b>H3</b>', () => block('h3')),
    h('span', { class: 'rte-sep' }),
    btn('Kalın', I('<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/>'), () => cmd('bold')),
    btn('İtalik', I('<path d="M19 4h-9M14 20H5M15 4L9 20"/>'), () => cmd('italic')),
    btn('Madde listesi', I('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>'), () => cmd('insertUnorderedList')),
    btn('Numaralı liste', I('<path d="M10 6h10M10 12h10M10 18h10M4 4v4M3 18h3l-3 3h3"/>'), () => cmd('insertOrderedList')),
    btn('Alıntı kutusu', I('<path d="M7 7h4v6H5V9a2 2 0 0 1 2-2zM15 7h4v6h-6V9a2 2 0 0 1 2-2zM5 13c0 2 1 4 4 4M13 13c0 2 1 4 4 4"/>'), () => block('blockquote')),
    h('span', { class: 'rte-sep' }),
    btn('Bağlantı', I('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'), () => { const u = prompt('Bağlantı adresi (https://...)'); if (u) cmd('createLink', u); }),
    btn('Görsel ekle', I('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>'), () => fileIn.click()),
    btn('Biçimi temizle', I('<path d="M4 7V5h12v2M10 5l-3 14M14 19H6M16 14l5 5M21 14l-5 5"/>'), () => { cmd('removeFormat'); block('p'); }),
    h('span', { class: 'rte-grow' }),
    btn('HTML görünümü', '<b>&lt;/&gt;</b>', () => {
      if (mode === 'visual') { src.value = sanitize(toStored()).replace(/></g, '>\n<'); area.hidden = true; src.hidden = false; mode = 'html'; }
      else { area.innerHTML = sanitize(src.value); hydrateImgs(); src.hidden = true; area.hidden = false; mode = 'visual'; emit(); }
    }),
    fileIn,
  );
  area.addEventListener('input', emit);
  src.addEventListener('input', emit);
  area.addEventListener('paste', (e) => {
    const html = e.clipboardData.getData('text/html'); const text = e.clipboardData.getData('text/plain');
    e.preventDefault();
    document.execCommand('insertHTML', false, html ? sanitize(html) : text.split(/\n{2,}/).map((p) => `<p>${p.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])).replace(/\n/g, '<br>')}</p>`).join(''));
    emit();
  });
  return h('div', { class: 'rte' }, bar, area, src);
}
