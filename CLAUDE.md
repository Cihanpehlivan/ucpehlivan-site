# CLAUDE.md — ucpehlivan.web.app

Bu dosya, bu repoda çalışan Claude için proje rehberidir.

> **Her oturumun başında:** Bu dosyayı oku. Önce **§11 Devam notları** bölümündeki en son notu oku, sonra işe başla.
> **Her oturumun sonunda:** §11'e yeni bir devam notu ekle (format §11'de). Bu adım zorunludur.

---

## 1. Bu site ne?

Umut Cihan Pehlivan'ın kişisel marka sitesi: **yapay zeka içeriklerinin kalıcı evi ve vitrini.**

```
   LinkedIn (bugün)      X (ileride)      YouTube (ileride)
        │                    │                   │
        └─────── kısa hal + link ────────────────┘
                             ▼
               ┌───────────────────────────┐
               │   ucpehlivan.web.app      │  ← uzun hal, arşiv, Google'da bulunur
               └─────────────┬─────────────┘
                             ▼
                  Hesaplarım → takip et
```

- **Ana fikir:** "Her gün yapay zeka kullanan birinden notlar ve tecrübeler."
- **Site bir CV değil.** Kariyer, vaka çalışması, müşteri listesi yok.
- **Blog merkezdir.** LinkedIn gönderisi kısa özet verir ve siteye link verir.
- **Sahibi şu an tam zamanlı çalışıyor.** Bu sebeple sitede iş arama veya hizmet satma izlenimi olmamalı.

---

## 2. Kesin kurallar (her değişiklikte kontrol et)

| Kural | Neden |
|---|---|
| İşveren adı, **"ajans"** kelimesi, müşteri/marka adları ve müşteri rakamları sitede **olmaz** (metin, URL, alt metin, dosya adı dahil). | Sahibi şu an çalışıyor. Müşteri verisi onun verisi değil. |
| Telefon numarası, açık adres (semt/mahalle), CV dosyası, "CV indir", "İşe alım" **olmaz**. | Gizlilik ve iş arama izlenimi. |
| "Birlikte çalışalım", "hizmet veriyorum", "uçtan uca çözüm sunuyorum" gibi hizmet satışı dili **olmaz**. | İşverenle çıkar çatışması riski. |
| Örnek vaka gerekirse **anonim** yaz: "Bir gıda markası projesinde…" | Aynı sebep. |
| **Sadece Firebase ücretsiz Spark planı.** Cloud Functions, Storage, Blaze ve ücretli servis **eklenmez**. | Sahibinin kararı. |
| Gizli anahtar, token, servis hesabı JSON'u repoya **yazılmaz**. | Repo herkese açık. |
| Bir şeyi **silmeden, push yapmadan, deploy etmeden önce** kısaca ne yapacağını söyle ve onay al. | |
| Önyüzde görsel bir değişiklik design system'i (`ui-kit/`) etkiliyorsa **push'tan önce uyar** ve kiti aynı commit'te güncelle (§6.1). | Kit ile site ayrışmasın. |
| Görsel kurallar için `docs/Pehlivan-AI-Marka-Kimligi.md`. | Markanın tek kaynağı. |

---

## 3. Benimle nasıl konuşmalısın

- **Türkçe** cevap ver. Kısa cümle, etken çatı, bir cümlede bir fikir (ASD-STE100 mantığı).
- **Önce çizim, sonra metin.** Akışı, yapıyı, önce/sonra farkını ASCII çizim veya tablo ile göster.
- Uzun açıklama yapma. Ne yaptığını, ne değiştiğini ve sıradaki adımı söyle.
- Ben belirsiz bir şey yazarsam, yanlış işe başlamadan **tek soru** sor.
- Büyük bir iş için önce **kısa plan** sun, onayımı bekle, sonra uygula.
- Oturum biterken (iş bitince, commit/push sonrası veya ben "bitirelim" deyince) §11'e devam notu yaz ve bu notu da commit'e ekle.
- Metin yazarken ton: **samimi, sade, agresif değil.** Başkalarıyla karşılaştırma yapma ("…yapanlardan değilim" gibi). Sadece kendi deneyimimi anlat.

---

## 4. Mimari

```
 ┌──────────────┐   Kaydet    ┌──────────────────────────┐
 │ /admin (CMS) │ ──────────► │ Firestore                │
 │ Google girişi│             │ content, posts, media    │
 └──────────────┘             │ site/public (yayın paketi)│
                              └────────────┬─────────────┘
                                           │ ziyaretçi tarayıcısı okur
 ┌──────────────┐   build    ┌─────────────▼─────────────┐
 │ shared/      │ ─────────► │ public/ (Firebase Hosting)│
 │ render.js    │            │ statik HTML + hydrate     │
 └──────────────┘            └───────────────────────────┘
```

| Parça | Konum | Not |
|---|---|---|
| Ortak şablon | `shared/render.js` | Ana sayfa, yazılar, yazı sayfası, 404, sitemap. Statik derleme, tarayıcı (hydrate) ve admin önizlemesi **aynı kodu** kullanır. Sayfa yapısını burada değiştir. |
| Admin paneli | `admin/src/` → `public/admin/admin.js` | `schema.js` form alanları, `main.js` ekranlar, `store.js` Firestore, `form.js` alan tipleri. |
| Site JS | `web/hydrate.js` → `public/assets/app.js` | Firestore'daki güncel içerikle sayfayı yeniler. |
| Site davranışı | `public/assets/main.js` | Tema, animasyon, kategori filtresi. `ucpInit()` her render sonrası çalışır. |
| Stiller | `public/assets/main.css` | Kaynak dosya budur (derleme yok). |
| İnteraktif yazı | `content/*.json` + `scripts/build-yazi.mjs` → `public/yazi/<ad>/` | Stil: `public/assets/yazi.css`, davranış: `public/assets/yazi.js`. |
| Blok biçimli interaktif yazı | `content/<ad>.json` (`"format": "blok"`) + `scripts/yazi-blok.mjs` (saf, tarayıcıda da çalışır) + `scripts/build-yazi-blok.mjs` (Node) | yazi.css/yazi.js ortak + `yazi-blok.css`/`yazi-blok.js` (önek `yb-`). Bloklar: summary, prose, flow, poll, jump, stack, version, report, outcome, questions, closing, share. İlk örnek: `/yazi/arac-degil-sonuc/`. |
| Başlangıç içeriği | `scripts/seed.json` = `public/admin/seed.json` | İkisi **aynı** kalmalı. |
| Design system | `ui-kit/` | Kit board'u + tokens/components/README. Yayına girmez. Senkron kuralı §6.1. |
| Paylaşım görseli | `scripts/build-og.mjs` → `public/og.png` | Google Chrome gerekir. |

### Ana sayfa bölümleri

```
 Hero → Yazılar → Hakkımda → Hesaplarım → Footer
```

- Bölüm listesi: `SECTION_KEYS` (`shared/render.js`). Sıra ve aktif/pasif: admin › Ana sayfa › Düzen.
- Menü ve footer linkleri aktif bölümlerden **otomatik** oluşur. Footer'daki "Keşfet" menüsü Hesaplarım'ı göstermez (hesaplar zaten "Hesaplar" sütununda).
- Yeni bölüm eklemek için: `SECTION_KEYS` + `SECTIONS` içine render fonksiyonu + `admin/src/schema.js` içinde `homeSections` sekmesi + `seed.json` varsayılanı. Yeni bölüm **pasif** (`on: false`) başlar.

### İçerik türleri

| Tür | Nasıl eklenir |
|---|---|
| Normal yazı | Admin › Yazılar. Adres: `/blog/<slug>/` |
| İnteraktif yazı | `content/<ad>.json` yaz → `node scripts/build-yazi.mjs` → admin'de yazının **Özel sayfa adresi** alanına `/yazi/<ad>/` yaz. Kart ve `/blog/` adresi oraya gider. |

> Yeni interaktif yazıda: `firebase.json` › `redirects` içine `/blog/<slug>` → `/yazi/<ad>/` için **301** kaydı ekle. İçerik dosyasının `meta` alanında `updated`, `readingMinutes`, `summaryLabel` ve 3 maddelik `summary` (Özet alanı, `summaryLabel: "Özet"`), `cover` (blog kartındaki görsel: `src`, `width`, `height`, açıklayıcı `alt`), `crumbs`, `share` ve `faq` olsun.

> `build-yazi.mjs` yalnız prompt-brief'i (`content/prompt-yazisi.json`) üretir ve öyle kalır. **Yeni interaktif yazılar blok biçimiyle yapılır:** `content/<ad>.json` içinde `"format": "blok"`, `sections[].blocks[]`; `node scripts/build-yazi-blok.mjs` hepsini üretir. Node yokken `scripts/yazi-blok.mjs` tarayıcıda içe aktarılır (`renderBlok`), çıktı dosyaya yazılır. `yazi-blok.css`/`.js` değişirse sayfa yeniden üretilir (`?v=` = ikisinin SHA1 ilk 8; `kontrol.yml` denetler). Metinde `[DÜZENLE]`, `[SÜRE]`, `[ÖRNEK: …]` kalırsa önizlemede kırmızı görünür, `yayinla.yml` canlıda o yazının klasörünü çıkarır. Kapak (`kapak.webp` 1536×864) ve `og.png` (1200×630, kapak yüksekliğe sığar) elle/canvas ile üretilir.

### SEO ve GEO

| Parça | Nerede | Not |
|---|---|---|
| Yapılandırılmış veri | `identityLd`, `articleLd` (`shared/render.js`) | Her sayfada WebSite + Person (`/#website`, `/#person`); blogda Blog, yazıda BlogPosting. Kişi verisine işveren adı **yazılmaz** (§2). |
| Site adı | `og:site_name` (`layout`) | |
| llms.txt | `renderLlms` → `build-static.mjs` | Yayında Firestore'dan üretilir. |
| Site haritası | `renderSitemap` | Ana sayfa ve blog tarihi = en yeni yazının tarihi. |
| Yazı sayfası | `build-yazi.mjs` | Görünür yazar satırı (`.yz-byline`) ve Özet alanı (`.yz-tldr`). Düzen: `.yz-grid` 1. satır = `.yz-head` (sayfa yolu, başlık, yazar, kapak; **iki kolonu birden kaplar**, sol kenar logo ve menüyle aynı, kapak tam genişlik 16:9), 2. satır = bölüm menüsü + yazı; menü Özet ile aynı hizada başlar. Başlık bloğu için `<header>` kullanma (main.css'teki genel header kuralı). |
| Düz metin sürümü | `scripts/yazi-md.mjs` → `public/yazi/<ad>/index.md` | Arayüz metni olmadan yazının kendisi. Head'de `rel="alternate" type="text/markdown"`, llms.txt'te link. İçerik değişince yeniden üret. |
| Sayfa yolu | `breadcrumbLd` + görünür `.yz-crumb` | Yazıda Ana sayfa › Yazılar › Yazı (veri ve görünen aynı adımlar). **Dikkat:** `main.css`'te genel `nav{…}` kuralı 1020 altında tüm `<nav>`'ları gizler; yeni bir `<nav>` eklersen sınıfla `display` ver. |
| Paylaşım | `build-yazi.mjs` / `yazi-blok.mjs` › `share()` · `meta.share` | Yazı sonunda: LinkedIn'de paylaş, X'te paylaş, linki kopyala, (destekleyen cihazda) sistem paylaşımı. |
| Soru-cevap | `faqLd` · `content/<ad>.json` › `meta.faq` | Soru = bölüm sorusu, cevap = yazıda **görünen** cümleler. Yazı metni değişirse `faq`'ı da eşitle. |
| Simge ve tema rengi | `layout` head · `public/site.webmanifest` | `apple-touch-icon.png` (180), `icon-192/512.png` favicon'dan üretildi; `theme-color` açık/koyu. Favicon değişirse bunları yeniden üret. |
| RSS | `renderFeed` → `build-static.mjs` → `/feed.xml` | Yayında Firestore'dan üretilir. Her sayfanın head'inde `rel="alternate" type="application/rss+xml"`, llms.txt'te link. Tarihler yazılardan gelir. |
| Önbellek | `firebase.json` | `/assets/**` 1 yıl (`immutable`), görseller 7 gün, HTML ve `.md` `no-cache`. **`main.css`, `main.js`, `app.js` değişirse `ASSET_V` artırılmalı**; `kontrol.yml` artmadıysa hata verir. |

### Kategoriler ve filtre

- Kategori listesi: admin › Ana sayfa › Yazılar › Kategori listesi.
- Filtre çubuğu sadece **"Kategori filtresini göster" açıksa ve en az 2 farklı kategori varsa** görünür.

---

## 5. Komutlar

```bash
npm install                      # ilk kurulum
npm run dev                      # http://localhost:5050  ·  admin: /admin/?mock (Firebase gerekmez)
npm run build                    # admin + hydrate JS + statik sayfalar
node scripts/build-yazi.mjs      # interaktif yazı sayfasını üret  (--og: paylaşım görseli de)
node scripts/build-og.mjs        # site geneli og.png
firebase deploy                  # hosting + firestore kuralları
```

**Kod değişikliğinden sonra:** `npm run build` çalıştır, `npm run dev` ile kontrol et, sonra commit.

### İki bilgisayar: Mac ve Windows — oturum başında hangisinde olduğunu kontrol et

Sahibi aynı repoda hem Mac'te hem Windows'ta çalışır. **İlk iş:** `git --version`, `node --version`, `gh --version` ile araçlara bak, sonra aşağıdaki doğru satırı izle. Araçları varsayma.

| Adım | Mac (Git + Node olması beklenir) | Windows (Git yok, Node yok, `gh` var) |
|---|---|---|
| Repoyu al | `git clone` · varsa **`git pull`** | `gh api repos/Cihanpehlivan/ucpehlivan-site/zipball/main` ile ZIP indir |
| Derle | `npm install` (bir kez) · `npm run build` | Çalışmaz. Aşağıdaki "Node yokken" kuralı. |
| Yazı sayfası | `node scripts/build-yazi.mjs` | HTML'i elle güncelle + `yazi.css?v=` sürümünü artır |
| Yerel önizleme | `npm run dev` → `localhost:5050` | `public/`'i PowerShell `HttpListener` ile servis et (Python yok) |
| Push | `git add` · `git commit` · `git push` | `powershell -ExecutionPolicy Bypass -File scripts\gh-push.ps1 -Message "…" -Files "yol/a,yol/b" -ExpectSha <sha>` |
| Yayın | `gh workflow run …` varsa onu kullan; yoksa GitHub › Actions › "Siteyi yayına al" | `gh workflow run yayinla.yml -R Cihanpehlivan/ucpehlivan-site -f hedef=onizleme` → kontrol → `hedef=canli` |

**İki makine kuralları:**
- Başlamadan önce **GitHub'daki en son hâli al.** Diğer makinede push yapılmış olabilir. Yerel kopyayla çalışmaya başlama.
- Bir makinede bitince **her şeyi push'la**; diğer makineye push'lanmamış iş bırakma.
- `gh` girişi makineye özeldir. Mac'te `gh` yoksa veya giriş yoksa sahibine `gh auth login`'i kendisinin yapmasını söyle.
- **Mac'te ilk oturumda bir kez:** `npm install && npm run build` çalıştır ve `git diff` bak. Windows'ta elle düzenlenen `public/assets/app.js`, `public/admin/admin.js` ve `public/yazi/prompt-brief/index.html` kaynaktan yeniden üretilmiş olur. Fark yalnız biçimse (boşluk, sıra) commit'le; anlamlı fark varsa sahibine göster.

**Windows'ta Git + Node varsa (2026-11-22'den beri bu makinede var):** Mac satırını izle. Önce `git config core.autocrlf false` + `core.eol lf` (CRLF ile `yazi.css?v=` hash'i CI'dakinden farklı çıkar). `npm run build:pages` **seed.json**'dan üretir: `public/index.html`, `blog/`, `sitemap.xml`, `llms.txt`, `feed.xml` çıktısını commit'leme; bu dosyalarda yalnız hedefli değişiklik yap (canlı içerik yayında Firestore'dan gelir).

**Node yokken (Windows):** `render.js` değişikliğini tarayıcıda modül olarak içe aktarıp Firestore içeriğiyle test et; derlenmiş `app.js`/`admin.js`'e aynı değişikliği elle uygula; `build-yazi.mjs` çıktısını elle güncelle ve `yazi.css?v=` sürümünü (yazi.css + yazi.js SHA1'inin ilk 8 hanesi) artır. `index.md`'yi `scripts/yazi-md.mjs`'i tarayıcıda içe aktarıp üret. `ASSET_V` artınca: `render.js` + derlenmiş paketlerdeki sabit (`app.js` › `I="…"`, `admin.js` › `Tf="…"`; isimler derlemeyle değişebilir, `?v=${…}` yanında ara) + `public/**/*.html` içindeki `?v=`.

Önizleme adresi: `https://ucpehlivan--onizleme-qg07p53h.web.app` (7 gün geçerli; yeni yayında değişebilir, Actions log'una bak).

**Otomatik kontrol:** Her push'ta `.github/workflows/kontrol.yml` çalışır. §2'deki yasaklı içerik (ajans, CV/iş arama, hizmet satışı dili, telefon, gizli anahtar) bulunursa **hata** verir; önyüz CSS/şablonu değişip `ui-kit/` değişmediyse **uyarı** verir (§6.1). Push'tan sonra sonucuna bak (`gh run list -w kontrol.yml -L 1`); kırmızıysa canlıya alma. Müşteri/marka adları listede yok (liste herkese açık repoda durmamalı); onları sen kontrol et.

**Yayın:** GitHub Actions › "Siteyi yayına al" › önce `onizleme`, kontrol et, sonra `canli`. Workflow içeriği Firestore'dan alır (`scripts/publish.mjs`) ve sayfaları üretir.

---

## 6. Tasarım kuralları

- **Marka katmanı:** renk ve font değerleri `public/assets/brand/pehlivan-tokens.css` (`--pa-*`) dosyasında; her sayfada `main.css`'ten önce yüklenir. Site değişkenleri `main.css` başında bu adlara bağlanır. Kurallar: `docs/Pehlivan-AI-Marka-Kimligi.md`.
- Renkler sadece CSS değişkenlerinden: `--bg` (Kraft), `--surface` (Kâğıt), `--surface-2` (Kâğıt üstünde Kraft), `--ink`/`--text` (Mürekkep), `--muted` (Silik), `--line`, `--accent` (Tükenmez), `--on-accent`, durum için `--go` (Zeytin) / `--stop` (Pas) ve kelime rengi `--go-ink` / `--stop-ink`. Açık ve koyu temada çalışmalı. Durum renkleri süs için kullanılmaz; durumun yanında kelime veya simge olur. Ceket metin rengi olmaz.
- Fontlar yerelden (`public/assets/fonts/`, OFL): Schibsted Grotesk (başlık 800, metin 400, link/buton 600) ve IBM Plex Mono 500 (yazı sayfası etiket/kod). Logo da Schibsted Grotesk 800 (`logoSvg`). Google Fonts kullanılmaz.
- Zemin düz Kâğıt (en açık marka rengi); **doku kullanılmaz** (sahibinin kararı, markadaki doku kuralının yerine geçer). Koyu temada zemin Gece Mürekkep. Uzun metin Kâğıt panelde (`.prose`, `.yz-article`). Metin içi link: Tükenmez, 600, 2 px alt çizgi, 5 px aralık.
- Koyu mod yalnız tema düğmesiyle (`data-theme`); `prefers-color-scheme` ile otomatik geçiş **yok** (bilinçli).
- `[hidden]{display:none!important}` kuralı var. Bir öğeyi gizlemek için `hidden` kullan.
- Header'da buton **yok** (bilinçli karar). Tek "Takip et" hero'daki dönen rozettir ve Hesaplarım'a gider.
- Çizimler SVG, sitenin renk değişkenleriyle. Animasyonlar `prefers-reduced-motion` ile kapanır.
- Metinde Türkçe tipografi: kesme işareti ’, tırnak “ ”.

### 6.1 Design system senkronu (`ui-kit/`)

```
 Tek kaynak: public/assets/main.css + yazi.css + shared/render.js (+ build-yazi.mjs)
        │
        ├──► UI-00-Kit.html  ── public/ sayfalarından CANLI okur → otomatik güncellenir
        └──► tokens.json / components.json / README.md ── ELLE güncellenir
```

| Durum | Ne yap |
|---|---|
| **Önyüzde değişiklik** (CSS, şablon, yeni sınıf, yeni bileşen) | Push'tan önce kontrol et: bir token değeri, bileşen ölçüsü, varyant veya durum değişti mi? Değiştiyse kullanıcıya **"Bu değişiklik design system'i etkiliyor: …"** diye listeyle uyar. `tokens.json` / `components.json` / `README.md`'yi aynı commit'te güncelle. Yeni bileşen veya varyant varsa `UI-00-Kit.html`'e öğe ekle. |
| **Design system'de değişiklik** (ör. "buton köşesini değiştir") | Kit üretim kodu değildir. Değişikliği **önce kaynağa** (`main.css`, `yazi.css`, `render.js`) uygula, sonra `ui-kit/*.json`'u güncelle. Kit board'u kendiliğinden yenilenir. Etkilenen tüm sayfaları say ve önizlemede göster. |
| **Kullanılmayan stil silinirse** | `components.json` › `dropped_selectors` listesinden de çıkar. |
| **Şablonda olup ekranda olmayan yapı ekrana gelirse** | `template_only`'den çıkarıp kite öğe olarak ekle (ör. ilk normal blog yazısı, kategori filtresi). |

Kontrol: `ui-kit/UI-00-Kit.html` repo kökünden yerel sunucuyla açılır (`npx serve .` → `/ui-kit/UI-00-Kit.html`).

---

## 7. Alınmış kararlar (tekrar önerme)

| Karar | Tarih |
|---|---|
| CV sitesinden kişisel marka sitesine geçildi. | Kas 2026 |
| Kaldırıldı: markalar şeridi, rakamlar, "ne yaparım", vakalar, çalışma şekli/sistemim, seriler, "yazdığım konular" şeridi, araçlar şeridi, kariyer çizelgesi, fotoğraf, telefon, CV, header butonu. | Kas 2026 |
| Bölüm adı "Arşiv" değil **"Yazılar"**. | Kas 2026 |
| Hero başlığı: "Her gün yapay zeka kullanan birinden notlar ve tecrübeler". | Kas 2026 |
| Hesaplar: LinkedIn (vurgulu), GitHub, YouTube (`@pehlivanai`, 2026-11-22), E-posta. X hesabı **henüz yok**. | Kas 2026 |
| Footer: büyük isim yazısı (wordmark) yok, telif satırı ortada, menü başlığı **"Keşfet"** (Yazılar, Hakkımda). | Kas 2026 |
| Sütun çizgileri (`.guides`) sadece ana sayfanın ilk ekranında; yazı ve blog sayfalarında yok. Bölümler mor şeritli çizgiyle ayrılır. | Kas 2026 |
| Hesaplarım görseli telefonda (≤640) gizli, tablette (≤900) metnin altında. 2026-11-22'den beri SVG çizim yerine çalışma masasındaki maskot; masaüstünde **solda**, liste sağda. | Kas 2026 |
| Logo (2026-11-22): iki satırlı SVG — “Umut Cihan” Tükenmez, “Pehlivan” Mürekkep; Schibsted Grotesk 800 `<text>`; **yalnız P'nin ayağı eğik kesik** (h kesiği ve v üçgeni kalktı). Ölçüler Schibsted glif ölçümünden (`render.js` › `logoSvg`; dosya tek başına kullanılacaksa path'e çevrilmeli). Favicon: Mürekkep kare + Kâğıt, ayağı kesik P (path); `apple-touch-icon`, `icon-192/512` ondan. Önceki logo Archivo'daydı. | Kas 2026 |
| Telefonda yazı listesi yatay kaydırılan kartlar (sonraki kartın kenarı görünür). "Öne çıkan + küçük satırlar" denendi, seçilmedi. | Kas 2026 |
| Kapak görselleri 16:9 (1536×864) üretilir; blog kartında görselli kapak da 16:9 kutuda, kırpılmadan durur (`.bcover.has-img`). Kapağa yazı koyarken kenarlara yakın yazılabilir. | Kas 2026 |
| Marka katmanı (Pehlivan AI): Tükenmez paleti, düz Kâğıt zemin (doku yok), Schibsted Grotesk + IBM Plex Mono (yerel), Hakkımda'da avatar yerine maskot (anlatım pozu, metne doğru; masaüstü 340px, telefon 240px; `pehlivan-poz-anlatim-2x.webp`). Hesaplarım'da çalışma masasındaki maskot (solda, 400px). Yazı kapakları koyu zeminli maskotlu görseller (`kapak-2.webp`, `kapak-3.webp`). Düzen, metin ve URL'ler değişmedi. | Kas 2026 |
| ~~Hakkımda'da avatar~~ → 2026-11-22'den beri marka maskotu (yukarıdaki satır). Eski karar: SVG çizim yerine avatar (`/img/avatar.webp`, çay bardaklı illüstrasyon; fotoğraf değil). Tablette metnin altında, **telefonda da görünür** (240px, ortalı, metnin üstünde). Kaynak görsel değişirse `.about-avatar` maske ölçüleri (main.css) avatarın en/boy oranına göre yeniden hesaplanır. | Kas 2026 |

---

## 8. İnteraktif yazı nasıl hazırlanır (örnek: /yazi/prompt-brief/)

Sitedeki ilk interaktif yazı "Prompt Yazmak, Aslında İyi Bir Brief Yazmak" bu süreçle yapıldı. Yeni interaktif yazılarda aynı yolu izle.

```
 1. İLHAM        Bir video / okuma / gerçek iş deneyimi
      │          (Dış kaynağın adı, metni, rakamı sayfaya GİRMEZ. Fikir kendi
      │           deneyimimle, PM bakışıyla yeniden yazılır.
      │           İstisna: sahibi açıkça isterse, yazıyı destekleyen kısa bir
      ▼           alıntı kaynağı ve linkiyle not kutusu olur: Box/Aside.)
 2. METİN        claude.ai'da Claude Doc olarak yazılır → Markdown dışa aktarılır
      │
      ▼
 3. EŞLEME       Her metin bölümü → bir etkileşim
      │
      ▼
 4. GÖRSEL REF.  Ekran görüntüsü. Sadece STİL alınır, içerik alınmaz.
      │
      ▼
 5. TALİMAT      Brief şablonu ile Claude Code'a verilir (aşağıda)
      │
      ▼
 6. PLAN → ONAY → KURULUM → ÖNİZLEME → YAYIN
      │
      ▼
 7. PAYLAŞIM     og.png (1200x630) + LinkedIn gönderisi (özet + link)
```

### 3. adım örneği — prompt-brief eşlemesi

| Metin bölümü | Sayfadaki etkileşim |
|---|---|
| 01 Giriş | Dev başlık + "İddia" kutusu + Hedef / Sınır / Serbestlik blokları |
| 02 Üç yanlış inanç | 3 çevrilebilir kart (önyüz: inanç, arka yüz: yerine ne yap) |
| 03 Yol çizme, sınır çiz | Anahtar: "Adım adım reçete" / "Hedef + sınır" → örnek prompt ve SVG akış değişir |
| 04 Model mizacı | GPT / Claude sekmeleri: Davranış, Risk, Nasıl yazılır |
| 05 Şablon | Kopyalanabilir şablon + 6 çevrilebilir kart (eski / şablonlu prompt) + **Brief oluşturucu** |
| 06 Sonuç | Kapanış + "Şablonu kopyala" + LinkedIn butonu |

Genel: okuma ilerleme çubuğu, yapışkan numaralı bölüm gezinmesi.

### 4. adım — görsel referanstan ne alındı

- **Alındı:** koyu zemin, dev başlık, tek vurgu rengi, büyük boşluklar, monospace küçük etiketler, numaralı bölümler (01, 02 …).
- **Alınmadı:** logo, maskot, görseller, metinler, rakamlar. Vurgu rengi sitenin paletinden seçildi.

### 5. adım — Claude Code talimat şablonu

Talimat, yazının kendi anlattığı brief yapısıyla yazıldı. Yeni interaktif yazıda bu iskeleti kullan:

```text
HEDEF            Ne yapılacak, sayfa nerede paylaşılacak, okuyucu ne yapabilecek.
ÖNCE ŞUNU YAP    Repoyu incele → yerleşim önerisi sun → onayımı bekle.
TASARIM REFERANSI Ekteki görselden AL: … / ALMA: …
SAYFA AKIŞI      Her metin bölümü → hangi etkileşim (yukarıdaki tablo gibi).
SINIRLAR         Dış kaynak adı/metni yok · metni kısaltma · diğer sayfalara ve deploy
                 ayarlarına dokunma · yeni bağımlılık için sor · tüm metin tek içerik
                 dosyasında · takip/çerez yok · canlıya alma, sadece önizleme.
ÖLÇÜ             Bütün metin sayfada · her bölümde en az 1 etkileşim çalışıyor ·
                 klavye ile kullanılabilir · 375 px'te yatay kaydırma yok ·
                 prefers-reduced-motion açıkken animasyon yok · title, description, OG var.
RAPOR            Değişen dosyalar, önizleme komutu, içerik dosyasının yolu.
SERBESTLİK       Bileşen yapısı, animasyon, yerleşim sende. Talimatta hata görürsen önce söyle.
METİN            [Claude Doc'tan Markdown]
```

### Öğrenilen ders

İlk deneme, yazıdan ayrı bir "araç sayfası" (/prompt) oldu. Bu yanlıştı. Doğru hedef: **blog yazısının kendisi interaktif olsun**, okuyucu metni okurken etkileşime girsin. Talimatta bu hedefi ilk cümlede açıkça yaz.

### Teknik karşılığı

```
 content/<ad>.json  ──►  node scripts/build-yazi.mjs [--og]  ──►  public/yazi/<ad>/index.html (+ og.png)
                                                                          ▲
 Admin › Yazılar › yeni yazı › "Özel sayfa adresi" = /yazi/<ad>/  ────────┘  (kart ve /blog/ adresi buraya gider)
```

---

## 9. İçerik stratejisi (yazı yazarken veya önerirken)

- **Konum:** Yapay zekayı her gün gerçek işte kullanan bir proje yöneticisi.
- **Üç içerik tipi:**
  1. *Sahadan not / vaka* — gerçek bir işte AI ile ne değişti? (anonim)
  2. *Prompt ve şablon* — kopyalanıp uyarlanabilir prompt, skill dosyası, otomasyon. GitHub ile desteklenir.
  3. *Araç testi* — yeni bir aracı gerçek işte denedim: nerede işe yaradı, nerede durdu.
- **Bir konudan çok içerik:** Uzun yazı sitede → LinkedIn'de özet + link → (ileride) X thread, kısa video.
- LinkedIn: haftada 2–3 gönderi. Her gönderide sorun, çözüm, sonuç.

---

## 10. Pasif bölüm fikirleri (istenince ekle, pasif başlat)

| Bölüm | Not |
|---|---|
| Bülten aboneliği | Firestore'a e-posta kaydı (Spark'ta çalışır). Gönderim harici ücretsiz servisle. |
| Prompt kütüphanesi | Kopyala butonlu kartlar. |
| Öne çıkan içerik | Hero altında tek sabitlenmiş yazı/video. |
| Videolar | YouTube kanalı açıldı (`@pehlivanai`); bölüm istenince eklenir. |
| Şu an masamda | Şu an denenen araçlar. |
| Yaptıklarım | Kendi araçları ve deneyleri, GitHub linkli. |

Teknik fikirler: arama (20+ yazıda), RSS, yazı başına otomatik paylaşım görseli.

---

## 11. Devam notları

Her oturumun sonunda **en üste** yeni bir not ekle. Burada **en fazla 3 not** durur: 4. not olunca en eskisini `docs/devam-notlari.md`'nin en üstüne taşı (silme). Bu dosya her oturumda baştan okunur; kısa kalmalı. Eski bir karar veya bağlam gerekirse arşivi oku.

Not eklerken **Açık işler** listesini de güncelle: biten işi sil, yeni açık işi ekle. Bu liste arşive taşınmaz.

**Format:**

```markdown
### YYYY-AA-GG — <oturumun konusu>
- **Yapılan:** …
- **Karar:** … (varsa; kalıcı kararları §7'ye de ekle)
- **Açık kalan:** …
- **Sonraki adım:** …
```

### Açık işler (güncel)

| İş | Kimde | Not |
|---|---|---|
| Search Console: site haritası "Getirilemedi" | Sahibi + Claude | 2026-11-19: hâlâ "Getirilemedi" (son okuma yok), dizine ekleme kotası yine dolu. 2026-11-18: hâlâ "Getirilemedi" idi. Canlı URL testi `sitemap.xml` için başarılı (Google erişebiliyor). Kayıt silindi, 18 Kas'ta yeniden gönderildi. **Sonraki gün:** "Başarılı" ve keşfedilen sayfa sayısı 3 mü bak. Değilse sorun Google tarafında; bekle, tekrar silme. "Dizine eklenmesini iste" kotası 18 Kas'ta da doluydu: önce `/yazi/prompt-brief/`, sonra `/` ve `/blog/`. |
| Bing Webmaster Tools | Sahibi | Search Console'dan içe aktar (site haritası "Başarılı" olmadan da çalışır) |
| Kendi alan adı kararı | Sahibi | Firebase'e bağlamak ücretsiz, alan adı ücretli |
| `main.css` eski seçici temizliği (~70) | Claude | `ui-kit/components.json` › `dropped_selectors`; önce önizleme |
| Kategori adı `"AI "` (sonda boşluk) | Claude | İki yazıda da Firestore'da böyle; filtre birebir karşılaştırır. Admin'de ikisini birlikte `"AI"` yap (biri değişirse filtre iki kategori sanar). |
| Search Console: `/yazi/arac-degil-sonuc/` dizine ekleme | Sahibi + Claude | Kota açılınca listeye ekle (prompt-brief, /, /blog/ ile birlikte). Uygulama panelinde Google oturumu yok; Claude in Chrome kullan. |
| Normal blog yazısı, kategori filtresi | Claude | Ekrana gelince `ui-kit`'e ekle (`template_only`). Normal yazı şablonuna (`renderPost`) da görünür sayfa yolu + paylaşım satırı ekle (yalnız interaktif yazıda var); `main.css` + `ASSET_V` + derleme gerekir (Mac). |
| Sonraki dönem: ayrı Hakkımda sayfası (`/hakkimda/`) + yazı sonunda yazar kutusu | Sahibi karar verdi: sonra | Person verisinin merkezi olur; "kim yazdı" sorusu (GEO) |
| LinkedIn paylaşımı · X hesabı · pasif bölüm fikirleri (§10) | Sahibi | YouTube 2026-11-22'de eklendi |
| Repo herkese açık: private repo / `CLAUDE.local.md` kararı | Sahibi | |
| Google Analytics var, çerez onay bandı yok | Sahibi | KVKK açısından bakılmalı (SEO değil) |
| Marka: maskot 2x kaynak (480×590), kökteki `[1]` adlı marka dosyaları, hero 4 satır | Sahibi | 2026-11-22 marka katmanı notu |
| Marka: yasak biçimler (sol çizgili kutular `.yz-example`, `.yz-whybox`, `.yz-lesson`, `.yb-o`, `.yb-t-risk`; `.yz-claim` gölgesi; bölüm şeridi gradient'i) | Sahibi karar verirse Claude | Düzen değişikliği sayılır, ayrı iş |

### 2026-11-22 — Marka katmanı (Pehlivan AI) (Windows, Git + Node)
- **Yapılan:** Repo bu makineye `git clone` ile alındı (Git + Node 26 + gh var). Marka dosyaları: `docs/Pehlivan-AI-Marka-Kimligi.md`, `public/assets/brand/` (`pehlivan-tokens.css`, maskot PNG, `doku-kraft.webp`). Tokens: `@import` yerine yerel `@font-face` (Schibsted Grotesk değişken 400–800, IBM Plex Mono 500, Archivo 800 yalnız logo; latin + latin-ext, `font-display: swap`, `assets/fonts/OFL-*.txt`); `prefers-color-scheme` bloğu çıkarıldı. `main.css` başında site değişkenleri `--pa-*`'a bağlandı (eşleme: `ui-kit/tokens.json`); yeni `--stop`, `--go-ink`, `--stop-ink`. Sabit renkler (#D93A3A, #FF7A7A, rgba) değişkene; süs amaçlı `--go` (hero çipleri, yıldızlar) → `--accent`. Doku: SVG feTurbulence seed 7 → 200px WebP (51 KB), yalnız body; koyu temada `multiply`. Uzun metin Kâğıt panelde (`.prose`, `.yz-article`: düz renk box-shadow taşması, metin yeri değişmez). Link stili (Tükenmez 600, 2px, 5px). Maskot Hesaplarım illüstrasyonunun yerinde (`ACC_ILLUSTRATION`, `.acc-maskot`, en fazla 240px; kaynak PNG'nin üst 2px'inde koyu artık şerit var → `clip-path` ile kesildi). Avatar dairesi Kâğıt. Ters panel (`.yz-outbox`) ve koyu temada `--on-accent` kontrast için ayarlandı. `theme-color` + head (Google Fonts kalktı, font preload + tokens linki). OG şablonları (`build-og.mjs`, `build-yazi.mjs --og`, ortak `scripts/og-marka.mjs`) yeni palet/font; `public/og.png` yeniden üretildi (aynı ad; LinkedIn eski önizlemeyi gösterirse Post Inspector). `ASSET_V` 16→17. `app.js`/`admin.js` kaynaktan yeniden derlendi (önceki elle düzenlenmiş paketlerle fark yalnız küçültücünün değişken adlarıydı). Statik HTML'lere (index, blog, post kabuğu, 404) hedefli değişiklik; seed derlemesi commit'lenmedi. `ui-kit` (tokens, components: Illustration/Mascot, README, kit sayfası tokens'ı yükler).
- **Ölçüm:** Lighthouse erişilebilirlik 93→98 (ana), 96→99 (prompt-brief), 95→98 (arac); renk kontrastı hatası 0. Doku üstünde en koyu %1 pikselde silik metin 4,9:1. Türkçe glifler (ğüşıöç İĞÜŞÖÇ) Schibsted 400/600/800 ve Plex 500'de var. 375 px'te yatay kayma yok. prompt-brief etkileşimleri çalışıyor. Sayfa yükseklikleri +26…+240 px (font genişliği): hero 1280'de 3 yerine 4 satır.
- **Karar:** Koyu mod yalnız düğmeyle. Logo Archivo'da kalır. `--surface-2` = Kraft. Yasak biçimler (sol çizgili kutular, `.yz-claim` gölgesi, şerit gradient'leri) bu işte değişmedi, listelendi.
- **Aynı gün, 2. tur:** Sahibi dokulu zemini “kirli” buldu: zemin düz Kâğıt (`--bg: --pa-kagit`), doku kaldırıldı (dosya ve üretici repoda, kullanılmıyor). Maskot Hesaplarım'dan Hakkımda'ya taşındı (avatar yerine; açıklayıcı alt metin); Hesaplarım'a eski SVG çizim döndü. İki yazıya sahibinin yeni görselleri kapak oldu: `prompt-brief/kapak-2.webp`, `arac-degil-sonuc/kapak-3.webp` (1672×941 → 1536×864) ve yazı `og.png`'leri (aynı ad). `meta.cover` (src, bg, alt) güncellendi. `theme-color`/manifest #F8F2E6. Lighthouse 98/99/98 korundu.
- **Admin (aynı gün):** Kart kapakları Firestore medyasından gelir (`media:…`), repodaki dosyadan değil. Araç yazısının kaydında prompt görseli vardı (iki kayıt aynı dosya): Claude in Chrome ile `kapak-3.webp` medya olarak yüklendi (`media:IWHAUrQOuZppmUTJ3lvS`, admin 1536×864 yeniden kodladı), kaydedildi; kart kapağı canlıda hemen değişti. Prompt yazısının kartı zaten yeni görseldeydi. Önizleme (`c5ff784`) yeniden yayınlandı, iki kart doğru.
- **Canlı (aynı gün):** `63dab21` canlıya alındı; dosyalar 200, kartlar doğru.
- **Yeni logo (aynı gün):** Sahibinin görseline göre: Schibsted Grotesk 800, “Umut Cihan” Tükenmez / “Pehlivan” Mürekkep, yalnız P ayağı eğik kesik (viewBox 414×144; ölçüler tarayıcıda Schibsted 800 ile alındı). Archivo `@font-face` kaldırıldı (woff2 + OFL dosyası repoda, kullanılmıyor). Favicon + 3 PNG ikon yeniden üretildi (aynı ad). Statik HTML'lerde logo hedefli değişti. `ASSET_V` 17→18.
- **Logo canlıda (aynı gün):** `be054b5` canlıya alındı; dört sayfada yeni logo (viewBox 414×144), `?v=18`, favicon yeni, yalnız Schibsted yükleniyor.
- **Maskot büyüdü (aynı gün):** Sahibi maskotu metne baksın ve büyüsün istedi. 240×295 PNG büyütülünce bulanıktı; sheet'teki poz da aynı boyutta. Maskot `kapak-3` görselinden (1672×941) kesildi: kenardan flood fill + büyük koyu bölgeler zemin, yalnız en büyük bileşen (belge çizimi atıldı), lacivert kenar halesi çizgi rengine çekildi → `pehlivan-poz-anlatim-buyuk.webp` (591×844, 45 KB, alfa). Kapakta zaten sola bakıyor, aynalama yok. `.about-maskot img` max 340px (telefon 240px, mevcut kural), `clip-path` kalktı. `ASSET_V` 18→19.
- **Maskot kesimi düzeltildi (aynı gün):** İlk kesimde (flood fill + kenar halesini çizgi rengine çekme) dış çizgi kesik kesik kaldı; sahibi fark etti. Yeni yöntem: saydamlık mavi fazlasından (B−R; lacivert zemin ≈23, siyah çizgi ≈−7), yarı saydam piksellerin rengi zeminden ayrıştırıldı (unmix), yalnız en büyük bileşen + 3px kenar. Çıktı `pehlivan-poz-anlatim-2x.webp` (598×857); önizlemeye çıkmış `-buyuk.webp` silindi (yeni ad: 1 yıl önbellek). `ASSET_V` 19→20. **Ders:** kesimden sonra tam boyutta (1:1) dış çizgiye bak. `b0da3e5` canlıda (`?v=20`, maskot 340px doğrulandı).
- **YouTube hesabı (aynı gün):** Admin › Ana sayfa › Hesaplarım'a eklendi (Claude in Chrome): ad YouTube, alt metin “pehlivanai · videolar”, adres https://www.youtube.com/@pehlivanai, simge youtube, sıra GitHub ile E-posta arası. Kaydedince canlıda göründü (kart + footer). Statik HTML / JSON-LD `sameAs` / llms.txt bir sonraki canlı yayında güncellenir.
- **Hesaplarım maskotu (aynı gün):** SVG çizim yerine çalışma pozu: karakter sheet'ten (1536×1024, poz ~326×264) açık zemin kenardan flood ile kaldırıldı, yarım ton benekler (küçük bileşenler) atıldı, kenar saydamlığı zemin uzaklığından → `pehlivan-poz-calisma.webp` (326×264, 23 KB). Masaüstünde maskot solda / liste sağda (`order:-1`, 1fr 1.15fr, ≥901), 400px (sahibi “bir tık büyüt” dedi; kaynak 326px, ~1,2x); ≤900 listenin altında, ≤640 gizli. `ASSET_V` 20→21. Daha net olması için bu pozun 2x dışa aktarımı gerekir. `1a6911e` canlıda (`?v=21`).
- **Koyu tema düzeltmesi (aynı gün):** Sahibi koyu temada çalışma maskotunda açık lekeler gördü: kenardan flood kapalı alanlara (masa altı, sandalye–bacak arası) ulaşmamış, yer gölgesi de kalmıştı (açık temada zeminle aynı renk olduğu için görünmüyordu). Yeni kesim: açık ve az doygun bileşenlerden nötr olanlar (R−B<20) zemin, kenara değen koyuca olanlar gölge; figürün alt 16 satırında bej-gri tonlar (açıklık 135–222, R−B 12–58) zemin. → `pehlivan-poz-calisma-2.webp` (305×261), eski dosya silindi. `ASSET_V` 21→22. **Ders:** şeffaf kesimi koyu zeminde de kontrol et.
- **Açık kalan:** Kullanılmayan dosyalar: `doku-kraft.webp`, `build-doku.mjs`, `archivo-800-latin.woff2` + `OFL-Archivo.txt`, kökteki `[1]` dosyaları (silme onayı). Kökteki `pehlivan-tokens[1].css` ve `pehlivan-poz-anlatim-seffaf[1].png` (silme onayı). Maskot için 2x (480×590) kaynak. Hero satır kırılması.
- **Sonraki adım:** Onayla push → `kontrol.yml` → `yayinla.yml hedef=onizleme` → önizlemede kontrol → canlı.
### 2026-11-19 — İkinci yazı: /yazi/arac-degil-sonuc/ (Windows, blok biçimi)
- **Yapılan:** "Yapay Zekayla Araç Yapmak Kolaylaştı. Asıl Değer Hâlâ Sonuçta." interaktif yazı olarak kuruldu (sahibi brief'teki "normal yazı" yerine interaktif istedi). `build-yazi.mjs`'e ve prompt-brief'e dokunulmadı; yeni genel üretici: `scripts/yazi-blok.mjs` + `build-yazi-blok.mjs`, içerik `content/arac-degil-sonuc.json`, stil/davranış `yazi-blok.css/js` (yazi.css/js ortak). 7 bölüm: rapor akışı (Elle/Araçla), okura soru + üç sebebe atlama, iş kulesi (Sadece ben/Başkası), sürüm kaydırıcısı, örnek rapor (temsilî, anonim satırlar; Aracın/Benim gördüğüm), arka plan/ekibin gördüğü, vurgulu 3 soru kutusu. Kısaca tek paragraf (`.yb-tldr-one`). Kapak + og.png canvas ile çizildi (Archivo'nun Türkçe harfleri için `document.fonts.load(…, 'ğış…')` gerekir). HTML ve `index.md` tarayıcıda aynı modülle üretildi; masaüstü, 375 px, koyu tema, tüm etkileşimler test edildi. Ana sayfa/site haritası/llms.txt, admin kaydı varmış gibi tarayıcıda `render.js` ile simüle edildi: yazı listede ilk sırada, site haritası ve llms.txt'te var. `firebase.json` 301 (`/blog/arac-degil-sonuc` → yazı), `kontrol.yml` (yazi-blok hash + yer tutucu uyarısı), `yayinla.yml` (canlıda yer tutuculu yazı klasörü çıkarılır), `ui-kit` (8 bileşen + şablon).
- **Karar:** Yeni interaktif yazılar blok biçimiyle (§4). Yer tutucu kalan yazı canlıya çıkmaz.
- **Metin revizyonu (aynı gün):** Sahibi kişisel örnek dilini istemedi; omurga (7 bölüm, 3 sebep, 3 soru) korundu, tez netleşti: **LLM'ler zaten birer araç ve her SaaS'a rakip; onlarla yarışan uygulama kurmak yerine onları işin adımlarında, sonuca ulaşmak için kullanmak. Rakibimizi yapay zeka şirketleri yapamayız.** Terim: "yapay zeka modeli" (ilk geçtiği yerde "(LLM'ler)", sonra kısaca "model"); "AI" kullanılmadı (model/uygulama ayrımını siler, site Türkçe "yapay zeka" der). Son bölüm kişisel "kendime sorduğum sorular" değil, okura dönük: "Ürüne çevirmeden önce 3 soru" (sonraki model sürümü bunu yapar mı · değer üründe mi sonuçta mı · rakip yapay zeka şirketi mi); üçü "evet" → "Ürünü kurma, modeli işin içinde kullan." (Sürekli araç çıkarıyormuş izlenimi verilmez.) Yer tutucular bu tezle dolduruldu (kişisel rakam yok). Sonuç başlığı "Rakip değil, araç". "Hizmet" kelimesi bilinçli kullanılmadı (§2 hizmet satışı izlenimi); yerine "işin adımları".
- **Canlıda (2026-11-20):** Sayfa canlıya alındı; admin kaydı Claude in Chrome ile girildi (slug `arac-degil-sonuc`, Özel sayfa adresi `/yazi/arac-degil-sonuc/`, kategori `"AI "` mevcut yazıyla birebir, kapak `/yazi/arac-degil-sonuc/kapak.webp`, Yayında) → tekrar canlı yayın. Doğrulandı: ana sayfa ve /blog/ ilk kart, sitemap.xml, llms.txt (düz metin linkiyle), feed.xml; filtre çubuğu çıkmadı; /blog/arac-degil-sonuc/ 301. Admin formunda `ctrl+a` tümünü seçmiyor, harf ekliyor: alanları `form_input` ile doldur.
- **Kapak + kart (2026-11-20):** Yazının kapağı sahibinin görseliyle değişti ("Araç değil, sonuç.", kaynak 1672×941 → `kapak.webp` 1536×864, 52 KB, canvas; `og.png` aynı yöntemle, `meta.cover.bg` `#F1F2F6`). Aynı adla yayınlanınca dünkü ziyaretçilerin tarayıcısı eski kapağı gösterdi (görseller 7 gün önbellekte): kapak `kapak-2.webp` adıyla yeniden yayınlandı, `meta.cover.src` ve admin'deki kapak yolu buna çevrildi. **Kural: yayındaki bir görseli değiştirirken yeni dosya adı ver.** Eski `kapak.webp` repoda kaldı (gh-push.ps1 dosya silemez; Mac'te `git rm` ile silinebilir, hiçbir yer kullanmıyor). Blog kartında görselli kapak 16:10 kutuda kenarlardan kırpılıyordu: `main.css` sonunda `.bcover.has-img` her düzende 16:9 (tek kart, 2 kart, feat, normal yazı kapağı); çizimli kapaklar 16:10 kaldı. `ASSET_V` 14→15 (render.js, app.js `I`, admin.js `Tf`, 6 HTML). 1/2/3 kart ve 375 px'te kutu = görsel oranı 1.778 ölçüldü.
- **X'te paylaş (2026-11-20):** Paylaşım satırına "X'te paylaş ↗" eklendi (`x.com/intent/post`, başlık + link; sitenin X hesabı gerekmez). `meta.share.x` alanı; `yazi-blok.mjs` ve `build-yazi.mjs` › `share()`. prompt-brief HTML'i Node olmadan elle, `build-yazi.mjs` çıktısıyla aynı biçimde güncellendi (Mac'te yeniden üretince fark çıkmamalı).
- **Mobil yazı listesi (2026-11-20):** Telefonda (≤640) 2 yazı iki sıkışık sütunda kalıyordu: `.bgrid:has(> .bcard:nth-child(2):last-child)` kuralı mobil 1 kolon kuralından sonra geldiği için onu eziyordu. Önce "öne çıkan + liste" (ilk kart + küçük görselli satırlar) denendi, sahibi beğenmedi. Seçilen: **yatay kaydırılan kartlar** (kart %84, sonraki kartın kenarı görünür, scroll-snap; tek yazıda tam genişlik). Tablet ve masaüstü değişmedi. `main.css` sonu, `ASSET_V` 16. 375/500/768 px'te ölçüldü, sayfa yatay kaymıyor.
- **Açık kalan:** Kategori `"AI "` temizliği; Search Console dizine ekleme (Açık işler).
- **Sonraki adım:** LinkedIn gönderisi (özet + link); Search Console'da yeni URL için dizine ekleme.
### 2026-11-19 — Search Console kontrolü + tema butonu + Node 20 (Windows)
- **Yapılan:** Repo `gh` token + `Invoke-WebRequest` ile ZIP alındı (`gh api … > dosya` PowerShell 5.1'de ikili veriyi bozar). Search Console'a uygulama panelinden girilemedi; Claude in Chrome eklentisiyle (sahibinin Chrome oturumu) bakıldı. `/sitemap.xml` hâlâ "Getirilemedi", son okuma yok, 0 sayfa; kayıt silinmedi. `/yazi/prompt-brief/` için dizine ekleme isteği → yine "Kota aşıldı" (sayfa "URL Google tarafından bilinmiyor"). Tema butonu: mobilde görünüm 36px kaldı, `::after` (inset -4px) ile dokunma alanı 44px oldu; 375 px'te ölçüldü. `ASSET_V` 13→14 (`render.js`, `app.js` › `I`, `admin.js` › `Tf`, 5 HTML). `yayinla.yml`: `checkout@v5`, `setup-node@v5` (son yayın log'undaki Node 20 uyarısı bu ikisindendi). `ui-kit/components.json` › `IconButton/Theme` güncellendi.
- **Karar:** Tema butonu görünüşü değişmez; yalnız dokunma alanı büyür.
- **Açık kalan:** Site haritası, dizine ekleme istekleri (Açık işler). Search Console için Claude in Chrome kullan (uygulama panelinde Google oturumu yok).
- **Sonraki adım:** Yarın Search Console: önce site haritası durumu, sonra `/yazi/prompt-brief/`, `/`, `/blog/` için dizine ekleme isteği.
