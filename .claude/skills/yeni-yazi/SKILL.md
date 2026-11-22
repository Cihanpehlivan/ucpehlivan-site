---
name: yeni-yazi
description: ucpehlivan.web.app'e yeni yazı ekler. Metin veya konu notundan blok biçimli interaktif yazı (veya kısa yazı) kurar, kapak/OG, 301, admin kaydı, önizleme, canlı, IndexNow, Search Console ve LinkedIn taslağına kadar götürür. Sahibi "yeni yazı", "yazı ekle", "/yeni-yazi" dediğinde kullan.
---

# /yeni-yazi — siteye yeni yazı ekleme hattı

Kurallar bu dosyaya **kopyalanmaz**; tek kaynak `CLAUDE.md` (§2 kesin kurallar, §3 iletişim, §4 içerik türleri, §8 süreç, §9 strateji) ve `docs/Pehlivan-AI-Marka-Kimligi.md`. Bu dosya yalnız **sırayı** ve **kontrol listesini** verir.

```
 0 OKU → 1 AL → 2 TARA → 3 ÖNER ─[ONAY 1]→ 4 KUR → 5 KAPAK → 6 ÖLÇ
   ─[ONAY 2: push+önizleme]→ 7 ÖNİZLEME ─[ONAY 3: canlı]→ 8 ADMIN → 9 CANLI → 10 BİLDİR → 11 PAYLAŞ → 12 NOT
```

Onay noktalarında dur. Sahibine Türkçe, kısa, tablo/çizimle sor. Push, deploy, admin kaydı ve silme **onaysız yapılmaz** (CLAUDE.md §2).

---

## 0. Oku
- `CLAUDE.md` (özellikle §11'deki son not ve Açık işler).
- `git pull` (diğer makinede push olmuş olabilir). Araçları kontrol et: `git`, `node`, `gh`.
- Örnek yazı: `content/arac-degil-sonuc.json` (bütün blok tipleri burada). Boş iskelet: bu klasördeki `sablon.json`.

## 1. Al
Sahibinden gelen: Claude Doc Markdown'ı, taslak veya konu notu. Varsa görsel(ler) ve referans ekran görüntüsü (yalnız **stil** alınır).
Eksikse **tek soru** sor (ör. "Metin hazır mı, yoksa konu notundan ben mi taslak çıkarayım?").

## 2. Tara (§2)
Metinde şunlar **olmamalı**; varsa listele, değiştirme önerisiyle sor:
- işveren / müşteri / marka adı, müşteri rakamı → anonimleştir ("Bir gıda markası projesinde…")
- "ajans", CV / iş arama, hizmet satışı dili ("birlikte çalışalım", "hizmet veriyorum")
- dış kaynağın adı, metni, rakamı (sahibi açıkça istemedikçe; isterse Aside + link)
- başkalarıyla karşılaştırma ("…yapanlardan değilim"); ton samimi, sade

## 3. Öner → **ONAY 1**
Tek mesajda:

| Karar | Seçenek |
|---|---|
| Tür | **İnteraktif (blok)** — varsayılan · **Kısa yazı** (admin › Yazılar, `/blog/<slug>/`, etkileşim yok) |
| Adres | `/yazi/<ad>/` — kısa, Türkçe karaktersiz, tireli |
| Bölüm → etkileşim | Tablo (CLAUDE.md §8 3. adım gibi). Her bölümde en az 1 etkileşim; zorlama yoksa `prose`. |
| `title` | Sayfadaki başlık (H1, paylaşım başlığı) |
| `seoTitle` | ≤38 karakter (" \| Umut Cihan Pehlivan" ile ≤60) |
| `description` | ≤155 karakter, yazının tezi |
| `kicker` | Sahadan not · Prompt ve şablon · Araç testi (§9) |
| Kapak | Sahibinin görseli mi, şablondan mı |

Blok kataloğu (ayrıntı: `scripts/yazi-blok.mjs`, örnek: `content/arac-degil-sonuc.json`):

| Blok | Ne işe yarar |
|---|---|
| `summary` | Kısaca kutusu (`meta.summary`, giriş bölümünde) |
| `prose` | Paragraflar (`**kalın**` olur) |
| `video` | YouTube videosu: `{ "type": "video", "id": "<videoId>", "title": "…", "date": "YYYY-AA-GG", "caption": "…", "description": "…" }`. Tıklayınca oynar; `date` varsa VideoObject. Yazının videosu varsa giriş bölümüne koy. |
| `flow` | İki seçenekli adım akışı + sonuç (önce/sonra) |
| `poll` | Okura soru, seçime göre cevap |
| `jump` | Numaralı bölümlere atlama listesi |
| `stack` | Seçenekle büyüyen kule (iş yükü, kapsam) |
| `version` | Kaydırıcı: zamanla değişen durum |
| `report` | Tablo, iki bakış açısı (temsilî, anonim satır) |
| `outcome` | Arka plan / ön yüz karşılaştırması |
| `questions` | İşaretlenebilir soru listesi + karar |
| `closing` | Kapanış paragrafı + LinkedIn butonu |
| `share` | Paylaş satırı (son blok) |

Yeni bir blok tipi gerekiyorsa: önce sor; `yazi-blok.mjs` + `yazi-blok.css/js` + `ui-kit` (§6.1) değişir.

## 4. Kur
1. `sablon.json` → `content/<ad>.json`; `<ad>` yerlerini doldur. Bölüm şekli: ilk bölüm `head: true`, diğerleri `title`, son bölüm `end: true`; `id` tekil, `num` 01, 02…
2. `meta.summary` 3 madde; `meta.faq` = bölüm sorusu + yazıda **görünen** cümleler (uydurma cevap yok).
3. `published`/`updated` = bugün; `readingMinutes` ≈ kelime / 200.
4. `firebase.json` › `redirects`: `{ "source": "/blog/<slug>{,/,/index.html}", "destination": "/yazi/<ad>/", "type": 301 }` (slug = admin'deki slug; genelde `<ad>`).
5. `node scripts/build-yazi-blok.mjs` → `public/yazi/<ad>/index.html` + `index.md`. "UYARI: yer tutucu" çıkarsa bitmemiştir.
6. Kısa yazıda 1–5 yok: içerik admin'e girilir (8. adım), sayfa yayında üretilir.

## 5. Kapak
- `kapak.webp` 1536×864 (16:9) + `og.png` 1200×630 (kapak yüksekliğe sığar, yanlar `meta.cover.bg`).
- **Şablondan (varsayılan, görsel yoksa):** `meta.kapakBaslik` yaz (kısa, 2–6 kelime; `*vurgu*` Tükenmez renginde; yoksa `title` kullanılır), sonra
  `CHROME=<yol> node scripts/build-kapak.mjs content/<ad>.json [--poz anlatim|calisma] [--ad kapak-2]` → `kapak.webp` + `og.png`. Çıktıdaki `meta.cover` satırını JSON'a işle, `alt` yaz. Windows'ta `CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe"`. Önce `--cikti <scratchpad>` ile deneyip görseli sahibine göster.
- Sahibinin görseli: oranı koruyarak canvas ile (headless Chrome) dönüştür; Türkçe harfler için `document.fonts.load(…, 'ğüşıöçİĞÜŞÖÇ')`.
- **Yayındaki bir görsel değişirse yeni dosya adı** (`kapak-2.webp`): görseller 7 gün önbellekte.
- `meta.cover.alt` görseli anlatır (dosya adında / alt metinde marka adı yok).

## 6. Ölç (raporla)
- [ ] Bütün metin sayfada; yer tutucu yok
- [ ] Her etkileşim çalışıyor (fare + klavye)
- [ ] 375 px'te yatay kayma yok; koyu tema okunur
- [ ] `prefers-reduced-motion` açıkken animasyon yok
- [ ] `<title>` ≤60, açıklama ≤155, OG görseli 200
- [ ] JSON-LD: BlogPosting + BreadcrumbList + FAQPage ayrışıyor
- [ ] §2 taraması temiz

Yerel önizleme: `.claude/launch.json` sunucusu veya `PORT=5077 node scripts/dev-server.mjs` → `/yazi/<ad>/`.

## 7. Önizleme → **ONAY 2 / ONAY 3**
- Commit (mesaj Türkçe) → push. Windows'ta push: `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin main`.
- `gh run list -w kontrol.yml -L 1` yeşil olmalı.
- `gh workflow run yayinla.yml -R Cihanpehlivan/ucpehlivan-site -f hedef=onizleme` → `https://ucpehlivan--onizleme-qg07p53h.web.app/yazi/<ad>/` kontrol.

## 8. Admin kaydı (Claude in Chrome, sahibinin oturumu)
Admin › Yazılar › yeni: başlık, slug, **Özel sayfa adresi** `/yazi/<ad>/`, kategori (mevcutla **birebir**; filtre birebir karşılaştırır), özet/açıklama, kapak görseli (medya olarak yükle), **Yayında**. Alanları `form_input` ile doldur (`ctrl+a` çalışmıyor). Kaydet = canlı veride hemen görünür; önce sor.

## 9. Canlı
`gh workflow run yayinla.yml … -f hedef=canli` → doğrula: `/yazi/<ad>/` 200, `/blog/<slug>` 301, ana sayfa ve `/blog/` ilk kart, `sitemap.xml`, `llms.txt`, `feed.xml`.

## 10. Bildir
- IndexNow canlı yayında otomatik (`yayinla.yml` log: `IndexNow: 200/202`).
- Search Console (Chrome, `https://search.google.com/u/1/search-console`, üstteki URL denetimi çubuğu) → yeni URL için "Dizine eklenmesini iste". "Kota aşıldı" ise devam notuna yaz, ertesi gün.

## 11. Paylaş
LinkedIn gönderi taslağı (sahibi yayınlar, sen yayınlamazsın): sorun → çözüm → sonuç, 3–6 kısa paragraf, sonda link. Tanıtım/hizmet dili yok. Taslağı mesajda ver.

## 12. Not
CLAUDE.md §11'e devam notu (en fazla 3 not; fazlası `docs/devam-notlari.md`'ye). Açık işleri güncelle. Bu adım commit'e girer.

---

**Bu skill'i geliştirirken:** bir adım aksarsa sahibine söyle, düzeltmeyi bu dosyaya işle. Kural değişikliği CLAUDE.md'ye gider, buraya değil.
