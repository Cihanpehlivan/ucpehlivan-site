// Blok biçimli interaktif yazıları üretir: content/*.json içinde "format": "blok" olanlar -> public/yazi/<ad>/index.html + index.md
// Sayfa kodu scripts/yazi-blok.mjs'tedir (Node yokken aynı modül tarayıcıda çalıştırılır).
// prompt-brief bu scriptle üretilmez (scripts/build-yazi.mjs).
// Kullanım: node scripts/build-yazi-blok.mjs
// Kapak (kapak.webp) ve paylaşım görseli (og.png) elle/tarayıcıda üretilir ve sayfa klasöründe durur.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { renderBlok, TODO_RE } from './yazi-blok.mjs';
import { seedBundle } from './build-static.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const pub = join(root, 'public');
const ORIGIN = 'https://ucpehlivan.web.app';
const hash = (...files) => { const h = createHash('sha1'); files.forEach((f) => h.update(readFileSync(join(pub, 'assets', f)))); return h.digest('hex').slice(0, 8); };

const decode = (v) => {
  if (!v || typeof v !== 'object') return null;
  if ('stringValue' in v) return v.stringValue; if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue; if ('booleanValue' in v) return v.booleanValue; if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, decode(x)]));
  return null;
};
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

const site = await siteBundle();
const yaziV = hash('yazi.css', 'yazi.js');
const blokV = hash('yazi-blok.css', 'yazi-blok.js');
for (const f of readdirSync(join(root, 'content')).filter((x) => x.endsWith('.json'))) {
  const C = JSON.parse(readFileSync(join(root, 'content', f), 'utf8'));
  if (C.format !== 'blok') continue;
  const { html, md } = renderBlok(C, site, { origin: ORIGIN, yaziV, blokV });
  const out = join(pub, ...C.meta.path.split('/').filter(Boolean));
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'index.html'), html);
  writeFileSync(join(out, 'index.md'), md);
  const left = JSON.stringify(C).match(TODO_RE);
  console.log(`${C.meta.path} üretildi (yazi ${yaziV}, blok ${blokV}).${left ? ` UYARI: ${left.length} yer tutucu var, canlıya alınamaz.` : ''}`);
}
