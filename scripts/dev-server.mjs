// Yerel deneme sunucusu: Firebase Hosting kurallarını ve Firestore okumasını taklit eder.
// Site: http://localhost:5050   Admin (deneme modu): http://localhost:5050/admin/?mock
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';


const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public');
const seed = JSON.parse(await readFile(new URL('./seed.json', import.meta.url), 'utf8'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf', '.txt': 'text/plain', '.ttf': 'font/ttf' };
const PORT = Number(process.env.PORT || 5050);

// Firestore REST taklidi: site/public ve media dokümanları (bellekte)
const enc = (v) => v === null || v === undefined ? { nullValue: null } : Array.isArray(v) ? { arrayValue: { values: v.map(enc) } } : typeof v === 'object' ? { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } } : typeof v === 'number' ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }) : typeof v === 'boolean' ? { booleanValue: v } : { stringValue: String(v) };
const fsDocs = {};
if (process.env.LIVE_TEST) { const b = JSON.parse(await readFile(new URL('./seed.json', import.meta.url), 'utf8')); b.home.hero.badge = 'CANLI İÇERİK TESTİ'; const img = (await readFile(join(root, 'img', 'pp.jpeg'))).toString('base64'); fsDocs['media/testphoto123'] = { data: 'data:image/jpeg;base64,' + img, type: 'image/jpeg' }; b.home.about.photo = 'media:testphoto123'; fsDocs['site/public'] = { version: 'live-2', settings: b.settings, home: b.home, cases: b.cases, posts: [{ ...b.posts[0], slug: 'yeni-yazi', title: 'Firestore\'dan gelen yeni yazı' }, ...b.posts] }; }
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = decodeURIComponent(url.pathname);
  if (p === '/__/firebase/init.json') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ projectId: 'demo', firestoreApi: `http://localhost:${PORT}/__fs` })); }
  const fsm = p.match(/^\/__fs\/projects\/demo\/databases\/\(default\)\/documents\/(.+)$/);
  if (fsm) { const d = fsDocs[fsm[1]]; res.writeHead(d ? 200 : 404, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(d ? { fields: enc(d).mapValue.fields } : { error: { code: 404 } })); }
  if (p === '/admin' || p.startsWith('/admin/') && !extname(p)) p = '/admin/index.html';
  if (p.endsWith('/')) p += 'index.html';
  try {
    const f = join(root, p);
    if ((await stat(f)).isFile()) { res.writeHead(200, { 'Content-Type': TYPES[extname(f)] || 'application/octet-stream' }); return res.end(await readFile(f)); }
  } catch {}
  // Firebase Hosting kuralları: /blog/** -> /blog/post.html, diğerleri -> 404.html
  const fallback = p.startsWith('/blog/') ? '/blog/post.html' : '/404.html';
  try { res.writeHead(fallback === '/404.html' ? 404 : 200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(await readFile(join(root, fallback))); }
  catch { res.writeHead(404); res.end('Bulunamadı'); }
}).listen(PORT, () => console.log(`Hazır: http://localhost:${PORT}  |  Admin: http://localhost:${PORT}/admin/?mock`));
