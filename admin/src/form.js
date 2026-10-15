import { h, slugify, toast } from './util.js';
import { richEditor } from './editor.js';

// fields: şema, obj: düzenlenen nesne (yerinde değiştirilir), ctx: { onChange, upload }
export function renderForm(fields, obj, ctx) {
  const wrap = h('div', { class: 'form' });
  const rows = [];
  const refresh = () => rows.forEach(({ f, el }) => { if (f.showIf) el.hidden = !f.showIf(obj); });
  const changed = () => { refresh(); ctx.onChange(); };
  for (const f of fields) {
    const el = field(f, obj, { ...ctx, onChange: changed });
    rows.push({ f, el });
    wrap.append(el);
  }
  refresh();
  return wrap;
}

function labelled(f, control, extra) {
  return h('div', { class: `fld fld-${f.type}` },
    h('label', { class: 'fld-l' }, f.title, f.required ? h('span', { class: 'req', 'aria-hidden': 'true' }, ' *') : null),
    control,
    extra || null,
    f.help ? h('p', { class: 'fld-h' }, f.help) : null);
}

function counter(f, input) {
  if (!f.max) return null;
  const c = h('p', { class: 'fld-c' });
  const upd = () => { const n = input.value.length; c.textContent = `${n} / ${f.max}`; c.classList.toggle('over', n > f.max); };
  input.addEventListener('input', upd); upd();
  return c;
}

function field(f, obj, ctx) {
  const set = (v) => { obj[f.key] = v; ctx.onChange(); };
  const v = obj[f.key];
  switch (f.type) {
    case 'heading': return h('h3', { class: 'fld-head' }, f.title);
    case 'note': return h('p', { class: 'fld-note' }, f.title);
    case 'text': { const i = h('input', { type: 'text', value: v ?? '', oninput: () => set(i.value) }); return labelled(f, i, counter(f, i)); }
    case 'textarea': { const i = h('textarea', { rows: f.rows || 3, oninput: () => set(i.value) }); i.value = v ?? ''; return labelled(f, i, counter(f, i)); }
    case 'number': { const i = h('input', { type: 'number', value: v ?? '', oninput: () => set(i.value === '' ? null : Number(i.value)) }); return labelled(f, i); }
    case 'date': { const i = h('input', { type: 'date', value: v ?? '', oninput: () => set(i.value) }); return labelled(f, i); }
    case 'bool': { const i = h('input', { type: 'checkbox', checked: v !== false && v != null ? true : null, onchange: () => set(i.checked) }); if (f.key === 'visible' && v == null) i.checked = true; return h('div', { class: 'fld fld-bool' }, h('label', { class: 'check' }, i, h('span', {}, f.title)), f.help ? h('p', { class: 'fld-h' }, f.help) : null); }
    case 'select': { const s = h('select', { onchange: () => set(s.value) }, f.options.map(([val, txt]) => h('option', { value: val, selected: (v ?? f.options[0][0]) === val ? true : null }, txt))); if (v == null) obj[f.key] = s.value; return labelled(f, s); }
    case 'color': {
      const txt = h('input', { type: 'text', value: v || '', placeholder: '#1E2025', class: 'hex', oninput: () => { if (/^#[0-9a-fA-F]{6}$/.test(txt.value)) pick.value = txt.value; set(txt.value); } });
      const pick = h('input', { type: 'color', value: /^#[0-9a-fA-F]{6}$/.test(v || '') ? v : '#1e2025', oninput: () => { txt.value = pick.value.toUpperCase(); set(txt.value); } });
      return labelled(f, h('div', { class: 'color-row' }, pick, txt));
    }
    case 'strings': { const i = h('textarea', { rows: Math.min(10, Math.max(3, (v || []).length + 1)), oninput: () => set(i.value.split('\n').map((x) => x.trim()).filter(Boolean)) }); i.value = (v || []).join('\n'); return labelled(f, i); }
    case 'slug': {
      const i = h('input', { type: 'text', value: v ?? '', oninput: () => { i.value = slugify(i.value.replace(/\s/g, '-')) + (i.value.endsWith('-') ? '-' : ''); set(i.value.replace(/-$/, '')); } });
      const b = h('button', { type: 'button', class: 'btn-s', onclick: () => { i.value = slugify(obj[f.source] || ''); set(i.value); } }, 'Başlıktan oluştur');
      return labelled(f, h('div', { class: 'row' }, i, b));
    }
    case 'image': case 'file': {
      const isImg = f.type === 'image';
      const prev = h('div', { class: 'media-prev' });
      const url = h('input', { type: 'text', value: v || '', placeholder: isImg ? 'Görsel yükle veya adres yaz' : 'Dosya yükle veya adres yaz', oninput: () => { set(url.value); draw(); } });
      const draw = async () => {
        prev.innerHTML = ''; prev.hidden = !url.value; if (!url.value) return;
        const src = url.value.startsWith('media:') ? await ctx.media(url.value.slice(6)) : url.value;
        if (isImg) prev.append(h('img', { src, alt: '' }));
        else prev.append(h('a', { href: '#', onclick: (e) => { e.preventDefault(); fetch(src).then((r) => r.blob()).then((b) => window.open(URL.createObjectURL(b), '_blank')); } }, 'Dosyayı aç'));
      };
      const fin = h('input', { type: 'file', accept: f.accept || 'image/*', hidden: true, onchange: async () => {
        const file = fin.files[0]; if (!file) return;
        up.disabled = true; up.textContent = 'Yükleniyor…';
        try { url.value = await ctx.upload(file); set(url.value); draw(); toast('Yüklendi'); }
        catch (err) { toast(err.message || 'Yükleme başarısız', 'err'); }
        up.disabled = false; up.textContent = isImg ? 'Görsel yükle' : 'Dosya yükle'; fin.value = '';
      } });
      const up = h('button', { type: 'button', class: 'btn-s', onclick: () => fin.click() }, isImg ? 'Görsel yükle' : 'Dosya yükle');
      const rm = h('button', { type: 'button', class: 'btn-s ghost', onclick: () => { url.value = ''; set(''); draw(); } }, 'Kaldır');
      draw();
      return labelled(f, h('div', { class: 'media' }, prev, h('div', { class: 'row' }, url, up, rm, fin)));
    }
    case 'richtext': return labelled(f, richEditor(v, (html) => set(html), ctx.upload, ctx.media));
    case 'list': return listField(f, obj, ctx);
    default: return h('p', {}, `Bilinmeyen alan: ${f.type}`);
  }
}

function listField(f, obj, ctx) {
  if (!Array.isArray(obj[f.key])) obj[f.key] = [];
  const arr = obj[f.key];
  const box = h('div', { class: 'list' });
  const open = new Set();
  const draw = () => {
    box.innerHTML = '';
    arr.forEach((item, i) => {
      const title = (f.itemTitle && f.itemTitle(item)) || `Öğe ${i + 1}`;
      const sub = f.itemSub ? f.itemSub(item) : '';
      const body = h('div', { class: 'li-body', hidden: !open.has(i) });
      const head = h('div', { class: 'li-head' },
        h('button', { type: 'button', class: 'li-toggle', 'aria-expanded': String(open.has(i)), onclick: () => { open.has(i) ? open.delete(i) : open.add(i); draw(); } },
          h('span', { class: 'li-n' }, String(i + 1)), h('span', { class: 'li-t' }, h('b', {}, title), sub ? h('small', {}, sub) : null)),
        h('div', { class: 'li-acts' },
          h('button', { type: 'button', class: 'ic', title: 'Yukarı taşı', 'aria-label': 'Yukarı taşı', disabled: i === 0 ? true : null, onclick: () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; ctx.onChange(); open.clear(); draw(); } }, '↑'),
          h('button', { type: 'button', class: 'ic', title: 'Aşağı taşı', 'aria-label': 'Aşağı taşı', disabled: i === arr.length - 1 ? true : null, onclick: () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; ctx.onChange(); open.clear(); draw(); } }, '↓'),
          h('button', { type: 'button', class: 'ic danger', title: 'Sil', 'aria-label': 'Sil', onclick: () => { if (confirm(`"${title}" silinsin mi?`)) { arr.splice(i, 1); ctx.onChange(); open.clear(); draw(); } } }, '✕')));
      if (open.has(i)) body.append(renderForm(f.fields, item, { ...ctx, onChange: () => { ctx.onChange(); const t = head.querySelector('.li-t b'); if (t) t.textContent = (f.itemTitle && f.itemTitle(item)) || `Öğe ${i + 1}`; } }));
      box.append(h('div', { class: 'li' + (open.has(i) ? ' open' : '') }, head, body));
    });
    const full = f.max && arr.length >= f.max;
    box.append(h('button', { type: 'button', class: 'btn-s add', disabled: full ? true : null, onclick: () => { arr.push(JSON.parse(JSON.stringify(f.defaults || {}))); open.add(arr.length - 1); ctx.onChange(); draw(); } }, full ? `En fazla ${f.max} öğe` : '+ Yeni ekle'));
  };
  draw();
  return h('div', { class: 'fld fld-list' }, h('label', { class: 'fld-l' }, f.title, h('span', { class: 'cnt' }, ` (${arr.length})`)), f.help ? h('p', { class: 'fld-h' }, f.help) : null, box);
}
