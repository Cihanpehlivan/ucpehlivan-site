// Karakter sheet'ten (açık zemin) maskot pozu kesimi. Hesaplarım çalışma pozu bununla üretildi:
//   CHROME=<yol> node scripts/kes-maskot-sheet.mjs "Pehlivan character sheet with coffee poses.png" public/assets/brand/pehlivan-poz-calisma-2.webp 870 712 360 280
// Kurallar: kenardan flood zemin; büyük nötr kapalı cepler zemin (göz akları küçük, korunur); yer gölgesi yalnız zeminden yayılarak;
// kenar 2 px bandında az doygun ara tonlar siyah çizgiye ayrıştırılır (koyu temada hale kalmaz). Sonucu koyu ve açık zeminde 3x büyütüp kontrol et.
// kenardan flood (zemin rengine uzaklık < T), küçük benek bileşenleri atılır,
// kenar piksellerinde saydamlık zemin uzaklığından, renk zeminden ayrıştırılır. node kes-sheet.mjs <sheet.png> <çıktı.webp> x0 y0 w h
import { spawn } from 'node:child_process'; import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'; import { join } from 'node:path'; import { tmpdir } from 'node:os';
const [src, out, X0, Y0, W, H] = process.argv.slice(2);
const chrome = spawn(process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=9348', '--user-data-dir=' + mkdtempSync(join(tmpdir(), 'chr-')), 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 50; i++) { try { await fetch('http://127.0.0.1:9348/json/version'); break; } catch { await sleep(200); } }
const t = await (await fetch('http://127.0.0.1:9348/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const w = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (w.has(d.id)) { w.get(d.id)(d); w.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; w.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const data = 'data:image/png;base64,' + readFileSync(src).toString('base64');
const r = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async()=>{const i=new Image();i.src=${JSON.stringify(data)};await i.decode();
const X0=${X0},Y0=${Y0},W=${W},H=${H},N=W*H;const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(i,-X0,-Y0);const im=x.getImageData(0,0,W,H),d=im.data;
let s=[0,0,0],n=0;for(const [a,b] of [[2,2],[W-12,2],[2,H-12],[W-12,H-12]])for(let yy=b;yy<b+10;yy++)for(let xx=a;xx<a+10;xx++){const k=(yy*W+xx)*4;s[0]+=d[k];s[1]+=d[k+1];s[2]+=d[k+2];n++}const BG=s.map(v=>v/n);
const dist=k=>Math.hypot(d[k]-BG[0],d[k+1]-BG[1],d[k+2]-BG[2]);const T=30;
const bg=new Uint8Array(N);const st=[];for(let xx=0;xx<W;xx++)st.push(xx,(H-1)*W+xx);for(let yy=0;yy<H;yy++)st.push(yy*W,yy*W+W-1);
while(st.length){const p=st.pop();if(bg[p])continue;if(dist(p*4)>=T)continue;bg[p]=1;const px=p%W;if(px>0)st.push(p-1);if(px<W-1)st.push(p+1);if(p>=W)st.push(p-W);if(p<N-W)st.push(p+W)}

// 1) Kapalı zemin cepleri: yalnız BÜYÜK (≥60 px), nötr (R-B<20) ve zemine çok yakın (ort. uzaklık <22) açık bileşenler. Göz akları küçük olduğu için kalır.
{const light=new Uint8Array(N);for(let p=0;p<N;p++){if(bg[p])continue;const k=p*4;const mx=Math.max(d[k],d[k+1],d[k+2]),mn=Math.min(d[k],d[k+1],d[k+2]);if(mx>200&&mx-mn<40)light[p]=1}
 const seen=new Uint8Array(N);for(let p=0;p<N;p++){if(!light[p]||seen[p])continue;const st=[p];const cm=[];seen[p]=1;let rb=0,ds=0;while(st.length){const q=st.pop();cm.push(q);const k=q*4;rb+=d[k]-d[k+2];ds+=dist(k);const qx=q%W;for(const r of [q-1,q+1,q-W,q+W]){if(r<0||r>=N)continue;if((r===q-1&&qx==0)||(r===q+1&&qx==W-1))continue;if(light[r]&&!seen[r]){seen[r]=1;st.push(r)}}}
  rb/=cm.length;ds/=cm.length;if(cm.length>=60&&rb<20&&ds<22)for(const q of cm)bg[q]=1}}
// 2) Yer gölgesi: zeminden başlayıp yalnız gölge tonuna (açıklık 150-228, R-B 10-55) yayılan dolgu, figürün alt 22 satırında.
//    Çizgi ve çizgi kenarı (açıklık <150) geçilmez; ayakkabı içi, tekerlek ve ayaklar korunur.
{let bottom=0;for(let p=0;p<N;p++)if(!bg[p]){const py=(p/W)|0;if(py>bottom)bottom=py}
 const sh=p=>{const py=(p/W)|0;if(py<bottom-22)return false;const k=p*4;const l=(d[k]+d[k+1]+d[k+2])/3,rb=d[k]-d[k+2];return l>=150&&l<=228&&rb>=10&&rb<=55};
 const st=[];for(let p=0;p<N;p++)if(bg[p])st.push(p);
 while(st.length){const q=st.pop();const qx=q%W;for(const r of [q-1,q+1,q-W,q+W]){if(r<0||r>=N)continue;if((r===q-1&&qx==0)||(r===q+1&&qx==W-1))continue;if(!bg[r]&&sh(r)){bg[r]=1;st.push(r)}}}}

// 3) alt bantta zemine değen açık, az doygun kırıntılar (gölge artığı): boyutu ne olursa olsun zemin
{let bottom=0;for(let p=0;p<N;p++)if(!bg[p]){const py=(p/W)|0;if(py>bottom)bottom=py}
 const lt=p=>{const k=p*4;const mx=Math.max(d[k],d[k+1],d[k+2]),mn=Math.min(d[k],d[k+1],d[k+2]);return !bg[p]&&((p/W)|0)>=bottom-22&&mx>170&&mx-mn<55};
 const seen=new Uint8Array(N);for(let p=0;p<N;p++){if(seen[p]||!lt(p))continue;const st=[p],cm=[];seen[p]=1;let touch=false;while(st.length){const q=st.pop();cm.push(q);const qx=q%W;for(const r of [q-1,q+1,q-W,q+W]){if(r<0||r>=N)continue;if((r===q-1&&qx==0)||(r===q+1&&qx==W-1))continue;if(bg[r])touch=true;if(!seen[r]&&lt(r)){seen[r]=1;st.push(r)}}}
  if(touch&&cm.length<400)for(const q of cm)bg[q]=1}}
const lab=new Int32Array(N).fill(-1);const comps=[];for(let p=0;p<N;p++){if(bg[p]||lab[p]>=0)continue;const s2=[p];const cm=[];lab[p]=comps.length;while(s2.length){const q=s2.pop();cm.push(q);const qx=q%W;for(const r of [q-1,q+1,q-W,q+W]){if(r<0||r>=N)continue;if((r===q-1&&qx==0)||(r===q+1&&qx==W-1))continue;if(!bg[r]&&lab[r]<0){lab[r]=comps.length;s2.push(r)}}}comps.push(cm)}
comps.sort((a,b)=>b.length-a.length);const big=comps[0].length;const keep=new Uint8Array(N);for(const cm of comps){if(cm.length>=big*0.01)for(const q of cm)keep[q]=1}
// zemine uzaklık (en fazla 3 px): kenar bandındaki açık ara tonlar da saydamlaştırılır (hale kalmasın)
const ring=new Uint8Array(N).fill(9);{let fr=[];for(let p=0;p<N;p++)if(!keep[p]){ring[p]=0;fr.push(p)}for(let dd=1;dd<=3;dd++){const nx=[];for(const q of fr){const qx=q%W;for(const r of [q-1,q+1,q-W,q+W]){if(r<0||r>=N)continue;if((r===q-1&&qx==0)||(r===q+1&&qx==W-1))continue;if(ring[r]>dd){ring[r]=dd;nx.push(r)}}}fr=nx}}
for(let p=0;p<N;p++){const k=p*4;if(!keep[p]){d[k+3]=0;continue}let edge=ring[p]<=2;
 if(edge){const L=(d[k]+d[k+1]+d[k+2])/3,BL=(BG[0]+BG[1]+BG[2])/3,ch=Math.max(d[k],d[k+1],d[k+2])-Math.min(d[k],d[k+1],d[k+2]);
  // az doygun ara ton = siyah çizgi + zemin karışımı: saydamlık açıklıktan; renkli pikseller (ceket, ten, saç) tam opak
  let a=ch<45?(BL-L)/(BL-15):1;a=Math.min(1,Math.max(0,a));if(a<1&&a>0){for(let j=0;j<3;j++)d[k+j]=Math.max(0,Math.min(255,(d[k+j]-(1-a)*BG[j])/a))}d[k+3]=Math.round(a*255)}}
x.putImageData(im,0,0);
let a0=W,a1=0,b0=H,b1=0;for(let p=0;p<N;p++){if(d[p*4+3]>8){const px=p%W,py=(p/W)|0;if(px<a0)a0=px;if(px>a1)a1=px;if(py<b0)b0=py;if(py>b1)b1=py}}
const o=document.createElement('canvas');o.width=a1-a0+3;o.height=b1-b0+3;o.getContext('2d').drawImage(c,-a0+1,-b0+1);
return {u:o.toDataURL('image/webp',0.95),w:o.width,h:o.height};})()` });
const v = r.result.result.value; writeFileSync(out, Buffer.from(v.u.split(',')[1], 'base64')); console.log(out, v.w + 'x' + v.h); ws.close(); chrome.kill();
