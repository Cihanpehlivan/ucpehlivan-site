// İnteraktif yazının düz metin (Markdown) sürümü: content/<ad>.json -> public/yazi/<ad>/index.md
// Neden: yazı sayfasının HTML'inde buton ve form metinleri ("Revize et", "Kopyala"…) yazıya karışıyor.
// Yapay zeka araçları ve okuyucu uygulamaları temiz metni bu dosyadan alır (GEO). llms.txt ve sayfa head'i buraya link verir.
// Saf fonksiyon: Node ve tarayıcıda aynı çalışır (build-yazi.mjs kullanır; Node yokken tarayıcıda test edilir).

const clean = (s = '') => String(s ?? '').replace(/\s+\n/g, '\n').trim();
const para = (arr = []) => arr.filter(Boolean).map(clean).join('\n\n');
const quote = (s = '') => clean(s).split('\n').map((l) => `> ${l}`).join('\n');

export function yaziMarkdown(C, { author = '', date = '', origin = 'https://ucpehlivan.web.app' } = {}) {
  const m = C.meta;
  const S = Object.fromEntries(C.sections.map((s) => [s.id, s]));
  const out = [];
  const push = (...xs) => xs.forEach((x) => { if (x !== '' && x != null) out.push(x); });
  const head = (s) => { push(`## ${s.num} · ${s.title}`); if (s.lede) push(`*${clean(s.lede)}*`); };

  push(`# ${m.title}`);
  push([author, date, m.readingMinutes ? `${m.readingMinutes} dk okuma` : ''].filter(Boolean).join(' · ') + `  \nKaynak: ${origin}${m.path}`);
  if (m.cover) push(`![${m.cover.alt}](${origin}${m.cover.src})`);
  push(quote(m.description));
  if ((m.summary || []).length) push(`## ${m.summaryLabel || 'Özet'}`, m.summary.map((x) => `- ${clean(x)}`).join('\n'));

  // 01 Giriş
  const n = S.neden, h = n.hero;
  push(`## ${n.num} · ${n.title}`);
  push(`**${h.claimLabel}:** ${h.claim.map((p) => p.text).join('')}`);
  push(h.pillars.map((p) => `- **${p.label}:** ${p.text}`).join('\n'));
  push(para(n.paragraphs));
  if (n.aside) push(quote(`**${n.aside.label}:** ${n.aside.text}`));

  // 02 Alışkanlıklar
  const a = S.inanclar;
  head(a);
  push(clean(a.intro));
  a.habits.forEach((x, i) => {
    push(`### ${i + 1}. ${x.name}`, clean(x.why));
    push(`**Eski:**\n${quote(x.old)}`, `**Yerine:**\n${quote(x.new)}`);
  });
  push(clean(a.after));

  // 03 Tarif / hedef
  const t = S.sinir;
  head(t);
  push(clean(t.intro));
  push(t.parts.map((p) => `- **${p.label.replace(/:$/, '')}:** ${p.text}`).join('\n'));
  t.switch.options.forEach((o) => {
    push(`### ${o.label}`, `${o.flow.join(' → ')}`, `**${o.exampleLabel}:**\n${quote(o.example)}`);
  });
  push(`*${clean(t.switch.caption)}*`);
  push(para(t.paragraphs));

  // 04 Modeller
  const d = S.modeller;
  head(d);
  push(clean(d.intro));
  d.tabs.forEach((tab) => push(`### ${tab.label}`, tab.rows.map((r, i) => `- **${d.rowLabels[i]}:** ${clean(r)}`).join('\n')));
  push(para(d.paragraphs));

  // 05 Şablon ve örnekler
  const b = S.sablon;
  head(b);
  push(clean(b.intro));
  push(`### ${b.templateLabel || 'Şablon'}`, '```text\n' + clean(b.template) + '\n```');
  push(`### ${b.checkTitle || 'Kontrol listesi'}`, b.checks.map((c) => `- **${c.label}:** ${c.hint}`).join('\n'));
  push('### Örnekler');
  b.examples.forEach((x) => {
    const lim = clean(x.limits).split('\n').filter(Boolean).map((l) => `  - ${l}`).join('\n');
    push(`**${x.title}**`, [`- ${b.oldLabel || 'Eski prompt'}: “${x.old}”`, `- ${b.whyLabel || 'Neden zayıf'}: ${x.why}`, `- Hedef: ${x.goal}`, `- Elindekiler: ${x.inputs}`, lim ? `- Sınırlar:\n${lim}` : '', x.measure ? `- Ölçü: ${x.measure}` : ''].filter(Boolean).join('\n'));
  });

  // 06 Sonuç
  const r = S.sonuc;
  head(r);
  push(para(r.paragraphs));
  if (r.linkedin) push(`[${r.linkedin.label}](${r.linkedin.href})`);

  return out.join('\n\n') + '\n';
}
