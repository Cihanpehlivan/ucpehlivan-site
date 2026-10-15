// Firestore'daki yayın paketini okur ve statik sayfaları günceller (SEO ve paylaşım önizlemeleri için).
// Kullanım: npm run publish   (sonra otomatik olarak firebase deploy --only hosting çalışır)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectMedia, resolveMedia } from '../shared/render.js';
import { buildPages } from './build-static.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const pid = process.env.FIREBASE_PROJECT || JSON.parse(readFileSync(join(here, '..', '.firebaserc'), 'utf8')).projects.default;
const API = `${process.env.FIRESTORE_API || 'https://firestore.googleapis.com/v1'}/projects/${pid}/databases/(default)/documents`;

const decode = (v) => {
  if ('stringValue' in v) return v.stringValue; if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue; if ('booleanValue' in v) return v.booleanValue; if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode);
  if ('mapValue' in v) return fields(v.mapValue.fields || {});
  return null;
};
const fields = (f) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, decode(v)]));
const get = async (path) => { const r = await fetch(`${API}/${path}`); if (!r.ok) throw new Error(`${path} okunamadı (${r.status}). Admin panelinde en az bir kez kaydet.`); return fields((await r.json()).fields || {}); };

const bundle = await get('site/public');
const ids = [...collectMedia(bundle)];
const mediaDir = join(here, '..', 'public', 'media');
if (existsSync(mediaDir)) rmSync(mediaDir, { recursive: true });
mkdirSync(mediaDir, { recursive: true });
const map = {};
for (const id of ids) {
  const m = await get(`media/${id}`);
  const match = /^data:([^;]+);base64,(.*)$/.exec(m.data || '');
  if (!match) continue;
  const ext = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/svg+xml': 'svg', 'image/gif': 'gif', 'application/pdf': 'pdf' }[match[1]] || 'bin';
  writeFileSync(join(mediaDir, `${id}.${ext}`), Buffer.from(match[2], 'base64'));
  map[id] = `/media/${id}.${ext}`;
}
console.log(`${ids.length} medya dosyası indirildi.`);
buildPages(resolveMedia(bundle, map));
