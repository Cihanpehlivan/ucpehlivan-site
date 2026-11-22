// Kraft lif dokusu: SVG feTurbulence (seed 7, stitchTiles) → şeffaf WebP döşeme (opaklık ~0,3 içinde).
// Kullanım: CHROME=<yol> node scripts/build-doku.mjs public/assets/brand/doku-kraft.webp [önizleme.png]
// Yayındaki dosyayı değiştirirsen yeni ad ver (assets 1 yıl önbellekte) ve main.css › --doku'yu güncelle.
import { spawn } from 'node:child_process'; import { writeFileSync, mkdtempSync } from 'node:fs'; import { join } from 'node:path'; import { tmpdir } from 'node:os';
const [out, prev] = process.argv.slice(2); const N = 200;
const svg = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${N}" height="${N}" viewBox="0 0 ${N} ${N}">
<defs>
 <filter id="lif" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.04 0.22" numOctaves="3" seed="7" stitchTiles="stitch" result="n"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.106  0 0 0 0 0.137  0 0 0 0 0.251  -3.2 0 0 0 1.62"/>
 </filter>
 <filter id="tane" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="7" stitchTiles="stitch"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.973  0 0 0 0 0.949  0 0 0 0 0.902  0 3.2 0 0 -1.75"/>
 </filter>
</defs>
${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''}
<g opacity="0.3"><rect width="${N}" height="${N}" filter="url(#lif)" opacity=".4"/><rect width="${N}" height="${N}" filter="url(#tane)"/></g>
</svg>`;
const chrome = spawn(process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=9334', '--force-device-scale-factor=1', '--user-data-dir=' + mkdtempSync(join(tmpdir(), 'chr-')), 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 50; i++) { try { await fetch('http://127.0.0.1:9334/json/version'); break; } catch { await sleep(200); } }
const t = await (await fetch('http://127.0.0.1:9334/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const w = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (w.has(d.id)) { w.get(d.id)(d); w.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; w.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const shoot = async (html, W, H, file) => {
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  await send('Page.navigate', { url: 'data:text/html;base64,' + Buffer.from(html).toString('base64') }); await sleep(700);
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
  writeFileSync(file, Buffer.from(s.result.data, 'base64'));
};
const r = await (async()=>{await send('Page.navigate',{url:'about:blank'});await sleep(200);const src='data:image/svg+xml;base64,'+Buffer.from(svg('')).toString('base64');const e=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`new Promise(r=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=c.height=${N};c.getContext('2d').drawImage(i,0,0);r(c.toDataURL('image/webp',0.82))};i.src='${src}'})`});return e.result.result.value})();writeFileSync(out, Buffer.from(r.split(',')[1],'base64'));
if (prev) {
  const tile = 'data:image/svg+xml;base64,' + Buffer.from(svg('')).toString('base64');
  await shoot(`<meta charset="utf-8"><style>body{margin:0;background:#E9DCC3 url(${tile});font:18px/1.6 sans-serif;color:#1B2340}div{display:flex;gap:24px;padding:24px}p{background:#F8F2E6;padding:20px;border-radius:16px;width:300px}section{background:#141A30 url(${tile});padding:24px;color:#E9DCC3}</style><div><b style="width:300px">Kraft zemin üzerinde metin · ğüşıöç İĞÜŞÖÇ</b><p>Kâğıt kart: doku yok.</p></div><section>Koyu zemin</section>`, 720, 420, prev);
}
ws.close(); chrome.kill();
