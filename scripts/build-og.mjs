// Site geneli paylaşım görselini üretir: public/og.png (1200x630).
// Ad ve slogan Firestore'daki site ayarlarından gelir (ulaşılamazsa scripts/seed.json).
// Kullanım: node scripts/build-og.mjs      (yüklü Google Chrome gerekir; CHROME=... ile yol verilebilir)
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { RENK, ogFontCss } from './og-marka.mjs';
import { seedBundle } from './build-static.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const decode = (v) => {
  if (!v || typeof v !== 'object') return null;
  if ('stringValue' in v) return v.stringValue; if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue; if ('booleanValue' in v) return v.booleanValue; if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, decode(x)]));
  return null;
};

let c;
try {
  const pid = JSON.parse(readFileSync(join(root, '.firebaserc'), 'utf8')).projects.default;
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/site/public`);
  if (!r.ok) throw new Error(String(r.status));
  c = decode({ mapValue: { fields: (await r.json()).fields || {} } });
} catch (err) {
  console.warn(`Firestore okunamadı (${err.message}), seed.json kullanılıyor.`);
  c = seedBundle();
}
const s = c.settings || {};
const hero = (c.home || {}).hero || {};
const name = s.name || '';
const slogan = (hero.ariaLabel || s.seoDescription || '').replace(/\.$/, '');
const kicker = hero.badge || '';
const host = new URL(s.siteUrl || 'https://ucpehlivan.web.app').host;
// Sloganın son iki kelimesi vurgu renginde
const words = slogan.split(' ');
const titleHtml = words.length > 3 ? `${esc(words.slice(0, -2).join(' '))} <i>${esc(words.slice(-2).join(' '))}.</i>` : esc(slogan);

const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const page = join(tmp, 'og.html');
writeFileSync(page, `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<style>${ogFontCss(join(root, 'public'))}*{margin:0;box-sizing:border-box}html,body{width:1200px;height:630px;overflow:hidden}
body{background:${RENK.kraft};font-family:"Schibsted Grotesk",system-ui,sans-serif;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;position:relative}
.k{font:500 22px "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:${RENK.tukenmez};display:flex;gap:14px;align-items:center}
.k b{background:${RENK.tukenmez};color:${RENK.kagit};padding:6px 12px;border-radius:8px;font-weight:500}
h1{font-family:"Schibsted Grotesk",sans-serif;font-weight:800;font-size:84px;line-height:.98;letter-spacing:-.035em;color:${RENK.murekkep};max-width:1040px}
h1 i{font-style:normal;color:${RENK.tukenmez}}
.f{display:flex;justify-content:space-between;align-items:center;font-size:26px;color:${RENK.silik}}
.f b{font-weight:600;color:${RENK.murekkep}}
.bar{position:absolute;left:0;right:0;bottom:0;height:16px;background:${RENK.tukenmez}}</style></head>
<body><div class="k"><b>${esc(name.split(' ').map((w) => w[0]).join(''))}</b>${esc(kicker)}</div>
<h1>${titleHtml}</h1>
<div class="f"><b>${esc(name)}</b><span>${esc(host)}</span></div><div class="bar"></div></body></html>`);
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=4000', '--window-size=1200,630', `--screenshot=${join(root, 'public', 'og.png')}`, `file://${page}`], { stdio: 'ignore' });
rmSync(tmp, { recursive: true, force: true });
console.log('public/og.png üretildi (1200x630).');
