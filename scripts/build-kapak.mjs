// Yazı kapağı ve paylaşım görseli üretir (marka şablonu): public/yazi/<ad>/<kapak>.webp (1536x864) + og.png (1200x630).
// Metin content/<ad>.json › meta'dan gelir: kapakBaslik (yoksa title), kicker. *iki yıldız* arası Tükenmez renginde.
// Kullanım:
//   CHROME=<yol> node scripts/build-kapak.mjs content/<ad>.json [--ad kapak-2] [--poz anlatim|calisma] [--cikti <klasör>]
//   --ad     kapak dosya adı (yayındaki görsel değişiyorsa YENİ ad ver: görseller 7 gün önbellekte). Varsayılan: kapak
//   --cikti  çıktı klasörü (deneme için). Varsayılan: public/yazi/<ad>/
// Sonra meta.cover = { src, width: 1536, height: 864, bg: "#141A30", alt } güncellenir (betik hatırlatır, JSON'a yazmaz).
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { ogFontCss } from './og-marka.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const file = args.find((a) => a.endsWith('.json'));
if (!file) { console.error('Kullanım: node scripts/build-kapak.mjs content/<ad>.json [--ad kapak-2] [--poz anlatim|calisma]'); process.exit(1); }
const m = JSON.parse(readFileSync(resolve(file), 'utf8')).meta;
const slug = m.path.replace(/^\/yazi\/|\/$/g, '');
const ad = opt('ad', 'kapak');
const out = resolve(opt('cikti', join(pub, 'yazi', slug)));
const POZ = { anlatim: ['pehlivan-poz-anlatim-2x.webp', 598, 857], calisma: ['pehlivan-poz-calisma-2.webp', 305, 261] };
const [pozDosya, pw, ph] = POZ[opt('poz', 'anlatim')] || POZ.anlatim;

// Koyu marka paleti (pehlivan-tokens.css, koyu tema)
const R = { zemin: '#141A30', kagit: '#F8F2E6', tukenmez: '#8FA6F0', silik: '#B9B3A3', serit: '#2747B0' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const vurgu = (s) => esc(s).replace(/\*([^*]+)\*/g, '<i>$1</i>');
const baslik = m.kapakBaslik || m.title;
const maskot = 'data:image/webp;base64,' + readFileSync(join(pub, 'assets', 'brand', pozDosya)).toString('base64');

// Tek şablon, iki boyut. Başlık kutuya sığana kadar küçülür.
const html = (W, H) => {
  const pad = Math.round(W * 0.06), mh = Math.round(H * (pozDosya.includes('calisma') ? 0.62 : 0.9));
  const mw = Math.round(mh * pw / ph);
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>${ogFontCss(pub)}
*{margin:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:${R.zemin};font-family:"Schibsted Grotesk",sans-serif;position:relative;color:${R.kagit}}
.t{position:absolute;left:${pad}px;top:${pad}px;bottom:${pad}px;width:${W - pad * 2 - mw * 0.82}px;display:flex;flex-direction:column;justify-content:space-between;gap:${Math.round(pad * 0.45)}px}
.k{font:500 ${Math.round(W * 0.016)}px "IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:${R.tukenmez}}
h1{font-weight:800;line-height:1;letter-spacing:-.035em;font-size:${Math.round(W * 0.072)}px}
h1 i{font-style:normal;color:${R.tukenmez}}
.f{font-size:${Math.round(W * 0.017)}px;color:${R.silik}}.f b{color:${R.kagit};font-weight:600}
.m{position:absolute;right:${Math.round(pad * 0.5)}px;bottom:${Math.round(H * 0.035)}px;width:${mw}px;height:${mh}px}
.bar{position:absolute;left:0;right:0;bottom:0;height:${Math.round(H * 0.018)}px;background:${R.serit}}
</style></head><body><div class="t"><div class="k">${esc(m.kicker || '')}</div><h1 id="h">${vurgu(baslik)}</h1><div class="f"><b>Umut Cihan Pehlivan</b> · ucpehlivan.web.app</div></div>
<img class="m" src="${maskot}" alt=""><div class="bar"></div></body></html>`;
};
const sigdir = `(async()=>{await document.fonts.load('800 40px "Schibsted Grotesk"','ğüşıöçİĞÜŞÖÇ');await document.fonts.load('500 20px "IBM Plex Mono"','ğüşıöç');await document.fonts.ready;
const h=document.getElementById('h'),box=h.parentElement;let f=parseFloat(getComputedStyle(h).fontSize);
const ok=()=>box.scrollHeight<=box.clientHeight+1&&h.scrollWidth<=h.clientWidth+1;while(!ok()&&f>20){f-=2;h.style.fontSize=f+'px'}
await Promise.all([...document.images].map(i=>i.decode()));return f})()`;

const port = 9350 + Math.floor(Math.random() * 40);
const udd = mkdtempSync(join(tmpdir(), 'kapak-'));
const chrome = spawn(process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${udd}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  for (let i = 0; i < 50; i++) { try { await fetch(`http://127.0.0.1:${port}/json/version`); break; } catch { await sleep(200); } }
  const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const w = new Map();
  ws.onmessage = (e) => { const d = JSON.parse(e.data); if (w.has(d.id)) { w.get(d.id)(d); w.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; w.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const cek = async (W, H, format) => {
    const tmp = join(udd, `${W}.html`); writeFileSync(tmp, html(W, H));
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'file:///' + tmp.replace(/\\/g, '/') }); await sleep(600);
    const f = (await send('Runtime.evaluate', { expression: sigdir, awaitPromise: true, returnByValue: true })).result?.result?.value;
    const r = await send('Page.captureScreenshot', { format, quality: format === 'webp' ? 88 : undefined, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
    return [Buffer.from(r.result.data, 'base64'), f];
  };
  await send('Page.enable');
  mkdirSync(out, { recursive: true });
  const [kapak, f1] = await cek(1536, 864, 'webp');
  const [og, f2] = await cek(1200, 630, 'png');
  writeFileSync(join(out, `${ad}.webp`), kapak); writeFileSync(join(out, 'og.png'), og);
  console.log(`${join(out, ad + '.webp')} (1536x864, ${(kapak.length / 1024).toFixed(0)} KB, başlık ${f1}px)\n${join(out, 'og.png')} (1200x630, ${(og.length / 1024).toFixed(0)} KB, başlık ${f2}px)`);
  console.log(`meta.cover: { "src": "${m.path}${ad}.webp", "width": 1536, "height": 864, "bg": "${R.zemin}", "alt": "…" }`);
  ws.close();
} finally {
  chrome.kill(); await sleep(300); try { rmSync(udd, { recursive: true, force: true }); } catch {}
}
