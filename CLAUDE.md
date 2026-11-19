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
| Paylaşım | `build-yazi.mjs` › `share()` · `meta.share` | Yazı sonunda: LinkedIn'de paylaş, linki kopyala, (destekleyen cihazda) sistem paylaşımı. |
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

**Node yokken (Windows):** `render.js` değişikliğini tarayıcıda modül olarak içe aktarıp Firestore içeriğiyle test et; derlenmiş `app.js`/`admin.js`'e aynı değişikliği elle uygula; `build-yazi.mjs` çıktısını elle güncelle ve `yazi.css?v=` sürümünü (yazi.css + yazi.js SHA1'inin ilk 8 hanesi) artır. `index.md`'yi `scripts/yazi-md.mjs`'i tarayıcıda içe aktarıp üret. `ASSET_V` artınca: `render.js` + derlenmiş paketlerdeki sabit (`app.js` › `I="…"`, `admin.js` › `Tf="…"`; isimler derlemeyle değişebilir, `?v=${…}` yanında ara) + `public/**/*.html` içindeki `?v=`.

Önizleme adresi: `https://ucpehlivan--onizleme-qg07p53h.web.app` (7 gün geçerli; yeni yayında değişebilir, Actions log'una bak).

**Otomatik kontrol:** Her push'ta `.github/workflows/kontrol.yml` çalışır. §2'deki yasaklı içerik (ajans, CV/iş arama, hizmet satışı dili, telefon, gizli anahtar) bulunursa **hata** verir; önyüz CSS/şablonu değişip `ui-kit/` değişmediyse **uyarı** verir (§6.1). Push'tan sonra sonucuna bak (`gh run list -w kontrol.yml -L 1`); kırmızıysa canlıya alma. Müşteri/marka adları listede yok (liste herkese açık repoda durmamalı); onları sen kontrol et.

**Yayın:** GitHub Actions › "Siteyi yayına al" › önce `onizleme`, kontrol et, sonra `canli`. Workflow içeriği Firestore'dan alır (`scripts/publish.mjs`) ve sayfaları üretir.

---

## 6. Tasarım kuralları

- Renkler sadece CSS değişkenlerinden: `--bg`, `--surface`, `--surface-2`, `--ink`, `--text`, `--muted`, `--line`, `--accent`, `--on-accent`, `--go`. Açık ve koyu temada çalışmalı.
- Fontlar: Archivo (başlık, `.d` sınıfı) ve Geist (metin).
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
| Hesaplar: LinkedIn (vurgulu), GitHub, E-posta. X ve YouTube hesapları **henüz yok**. | Kas 2026 |
| Footer: büyük isim yazısı (wordmark) yok, telif satırı ortada, menü başlığı **"Keşfet"** (Yazılar, Hakkımda). | Kas 2026 |
| Sütun çizgileri (`.guides`) sadece ana sayfanın ilk ekranında; yazı ve blog sayfalarında yok. Bölümler mor şeritli çizgiyle ayrılır. | Kas 2026 |
| Hesaplarım illüstrasyonu telefonda (≤640) gizli, tablette (≤900) metnin altında. | Kas 2026 |
| Logo: iki satırlı SVG — “Umut Cihan” mor, “Pehlivan” kalın siyah; P ve h'de eğik kesik ayak, v içinde mor üçgen (`render.js` › `logoSvg`). Metin Archivo `<text>` (sitede yüklü font; dosya tek başına kullanılacaksa path'e çevrilmeli). Eski tek satır + nokta logosu (`.wl`) kaldırıldı. Favicon da buna uygun: kesik ayaklı P + mor üçgen (path, fonttan bağımsız). | Kas 2026 |
| Hakkımda'da SVG çizim yerine avatar (`/img/avatar.webp`, çay bardaklı illüstrasyon; fotoğraf değil). Tablette metnin altında, **telefonda da görünür** (240px, ortalı, metnin üstünde). Kaynak görsel değişirse `.about-avatar` maske ölçüleri (main.css) avatarın en/boy oranına göre yeniden hesaplanır. | Kas 2026 |

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
| Videolar | YouTube kanalı açılınca. |
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
| /yazi/arac-degil-sonuc/ canlıya alma | Sahibi + Claude | 3 yer tutucu metni (giriş + [SÜRE], 2. sebep, ölçülen fark) sahibinden gelecek. Sonra yeniden üret, admin kaydı (§11 19 Kas notu), önizleme, canlı. |
| Normal blog yazısı, kategori filtresi | Claude | Ekrana gelince `ui-kit`'e ekle (`template_only`). Normal yazı şablonuna (`renderPost`) da görünür sayfa yolu + paylaşım satırı ekle (yalnız interaktif yazıda var); `main.css` + `ASSET_V` + derleme gerekir (Mac). |
| Sonraki dönem: ayrı Hakkımda sayfası (`/hakkimda/`) + yazı sonunda yazar kutusu | Sahibi karar verdi: sonra | Person verisinin merkezi olur; "kim yazdı" sorusu (GEO) |
| LinkedIn paylaşımı · X/YouTube hesapları · pasif bölüm fikirleri (§10) | Sahibi | |
| Repo herkese açık: private repo / `CLAUDE.local.md` kararı | Sahibi | |
| Mac'te derlemeyi doğrula | Claude (Mac) | 2026-11-19 (2): `node scripts/build-yazi-blok.mjs` çalıştır; `public/yazi/arac-degil-sonuc/index.html` + `index.md` tarayıcı çıktısıyla aynı mı bak. 2026-11-19: `ILLUSTRATION` (avatar), logo SVG (`logoSvg`) + `ASSET_V` 13 (19 Kas'ta 14) paketlere elle işlendi; `build-yazi.mjs` (`aside`, `--og` kapaktan) değişti. Önceki: `render.js` (breadcrumbLd, faqLd, renderFeed, head'de RSS/simge/manifest/theme-color, llms satırları, ASSET_V 10) ve `build-yazi.mjs` değişti; Windows'ta paketlere yalnız `ASSET_V` elle işlendi. `npm run build:js` + `node scripts/publish.mjs` + `node scripts/build-yazi.mjs` → `git diff` |
| Google Analytics var, çerez onay bandı yok | Sahibi | KVKK açısından bakılmalı (SEO değil) |

### 2026-11-19 — İkinci yazı: /yazi/arac-degil-sonuc/ (Windows, blok biçimi)
- **Yapılan:** "Yapay Zekayla Araç Yapmak Kolaylaştı. Asıl Değer Hâlâ Sonuçta." interaktif yazı olarak kuruldu (sahibi brief'teki "normal yazı" yerine interaktif istedi). `build-yazi.mjs`'e ve prompt-brief'e dokunulmadı; yeni genel üretici: `scripts/yazi-blok.mjs` + `build-yazi-blok.mjs`, içerik `content/arac-degil-sonuc.json`, stil/davranış `yazi-blok.css/js` (yazi.css/js ortak). 7 bölüm: rapor akışı (Elle/Araçla), okura soru + üç sebebe atlama, iş kulesi (Sadece ben/Başkası), sürüm kaydırıcısı, örnek rapor (temsilî, anonim satırlar; Aracın/Benim gördüğüm), arka plan/ekibin gördüğü, vurgulu 3 soru kutusu. Kısaca tek paragraf (`.yb-tldr-one`). Kapak + og.png canvas ile çizildi (Archivo'nun Türkçe harfleri için `document.fonts.load(…, 'ğış…')` gerekir). HTML ve `index.md` tarayıcıda aynı modülle üretildi; masaüstü, 375 px, koyu tema, tüm etkileşimler test edildi. Ana sayfa/site haritası/llms.txt, admin kaydı varmış gibi tarayıcıda `render.js` ile simüle edildi: yazı listede ilk sırada, site haritası ve llms.txt'te var. `firebase.json` 301 (`/blog/arac-degil-sonuc` → yazı), `kontrol.yml` (yazi-blok hash + yer tutucu uyarısı), `yayinla.yml` (canlıda yer tutuculu yazı klasörü çıkarılır), `ui-kit` (8 bileşen + şablon).
- **Karar:** Yeni interaktif yazılar blok biçimiyle (§4). Yer tutucu kalan yazı canlıya çıkmaz.
- **Açık kalan:** Metinde 3 yer tutucu (giriş paragrafı + [SÜRE], 2. sebep paragrafı, Sonuç'taki ölçülen fark). Admin kaydı yok (listede görünmesi için gerekli; yer tutucular bitmeden yayınlanmamalı, çünkü ana sayfa Firestore'u canlı okur).
- **Sonraki adım:** Sahibinden 3 metni al → `content/arac-degil-sonuc.json` (flow.result.arac içindeki [SÜRE] dahil) → sayfayı yeniden üret → `meta.published/updated` yayın günü → admin › Yazılar: başlık, slug `arac-degil-sonuc`, Özel sayfa adresi `/yazi/arac-degil-sonuc/`, kategori, kısa özet = meta.description, kapak görseli `/yazi/arac-degil-sonuc/kapak.webp`, tarih → önizleme → canlı.
### 2026-11-19 — Search Console kontrolü + tema butonu + Node 20 (Windows)
- **Yapılan:** Repo `gh` token + `Invoke-WebRequest` ile ZIP alındı (`gh api … > dosya` PowerShell 5.1'de ikili veriyi bozar). Search Console'a uygulama panelinden girilemedi; Claude in Chrome eklentisiyle (sahibinin Chrome oturumu) bakıldı. `/sitemap.xml` hâlâ "Getirilemedi", son okuma yok, 0 sayfa; kayıt silinmedi. `/yazi/prompt-brief/` için dizine ekleme isteği → yine "Kota aşıldı" (sayfa "URL Google tarafından bilinmiyor"). Tema butonu: mobilde görünüm 36px kaldı, `::after` (inset -4px) ile dokunma alanı 44px oldu; 375 px'te ölçüldü. `ASSET_V` 13→14 (`render.js`, `app.js` › `I`, `admin.js` › `Tf`, 5 HTML). `yayinla.yml`: `checkout@v5`, `setup-node@v5` (son yayın log'undaki Node 20 uyarısı bu ikisindendi). `ui-kit/components.json` › `IconButton/Theme` güncellendi.
- **Karar:** Tema butonu görünüşü değişmez; yalnız dokunma alanı büyür.
- **Açık kalan:** Site haritası, dizine ekleme istekleri (Açık işler). Search Console için Claude in Chrome kullan (uygulama panelinde Google oturumu yok).
- **Sonraki adım:** Yarın Search Console: önce site haritası durumu, sonra `/yazi/prompt-brief/`, `/`, `/blog/` için dizine ekleme isteği.
### 2026-11-18 — Search Console site haritası + mobil bölüm menüsü (Windows)
- **Yapılan:** Repo `gh` olmadan GitHub ZIP ile alındı (uzun yol sınırı: `Expand-Archive` hata verir, önek kırpılarak açıldı). Canlı `sitemap.xml` ve `robots.txt` Googlebot UA ile 200. Search Console'da durum hâlâ "Getirilemedi" idi; `sitemap.xml` için "Canlı URL'yi test et" → "URL, Google tarafından kullanılabilir". Kayıt silindi ve yeniden gönderildi. `/yazi/prompt-brief/` için dizine ekleme isteği → "Kota Aşıldı". Yazıda mobil bölüm şeridi kesiliyordu (405 px içerik, 335 px alan; 06 görünmüyordu): 900 altı şeritte yalnız numara, `space-between`; bölüm adı görsel olarak gizli, ekran okuyucuda kalır. `yazi.css?v=05601ec7`, `ui-kit/components.json` güncellendi. Yerelde (PowerShell `HttpListener`, port 5077; 5050 bu makinede dolu) 375 px'te doğrulandı. Yazı kapağı yenilendi ("İyi prompt, iyi brief’tir" görseli): `kapak.webp` 1536×864 (16:9), 51 KB; tarayıcı canvas'ıyla sıkıştırıldı (bu makinede görüntü aracı yok). Dosya adı aynı → blog kartı da değişti (Firestore'a dokunulmadı). Mobildeki 3:2 kapak kırpması kaldırıldı (yazı kesilirdi). `meta.cover`, alt metin, `index.md`, `ui-kit/tokens.json` güncellendi, `yazi.css?v=7c88ef8d`. 01'in sonuna “Bu arada” not kutusu eklendi: Boris Cherny'nin X gönderisi (“Claude ile bir iş arkadaşınla konuşur gibi konuş”), link: x.com/bcherny/status/2107565388250874193. Yeni alan `section.aside {label, text}` (metinde `[ad](https://…)` linki); `build-yazi.mjs` (`aside()`, `mdLink`) ve `yazi-md.mjs` bunu işler; HTML ve `index.md` elle güncellendi. Yeni bileşen `Box/Aside` (`.yz-aside`, Özet ile aynı dil); `meta.updated` 2026-11-18; `yazi.css?v=1fd3e06c`. Yazının `og.png`'si yeni kapaktan üretildi: 1200×630, kapak kırpılmadan yüksekliğe sığdırıldı, yanlar kapak kenar rengiyle (`meta.cover.bg` = `#EFF1F5`) doldu; ~507 KB PNG. `build-yazi.mjs --og` artık kapak varsa aynısını üretir (Mac'te eski başlık şablonu geri gelmez). Kapak ve og.png aynı adla 7 gün önbellekte; LinkedIn eski önizlemeyi gösterirse Post Inspector ile yenile. Not kutusu etiketi “Bu arada” oldu. 2026-11-19: Hakkımda'daki SVG çizim yerine avatar geldi (`public/img/avatar.webp`, 680×880, 66 KB, kenar boşluğu kırpıldı, şeffaf). `render.js` › `ILLUSTRATION` + derlenmiş `app.js`/`admin.js` (elle, birebir değiştirme) + `public/index.html`; `main.css` › `.about-avatar` (daire zemin + maske); `ASSET_V` 10→11. Yerelde masaüstü, tablet ve 375 px'te doğrulandı (hydrate ile). Telefonda sola yapışık durduğu için ortalandı ve 240px yapıldı (`ASSET_V` 12). Yeni logo: iki satırlı SVG (`logoSvg`, mask id'leri `lgm-h`/`lgm-f`); P/h gövdesi ve v boşluğu tarayıcıda Archivo 800 ile ölçülüp sabitlendi; paketlere ve 5 HTML'e elle işlendi; `.wl` CSS'i kaldırıldı; `ASSET_V` 13. Saf path SVG için opentype.js ile glif çevirme denendi, dış kütüphane izni verilmediği için metinli SVG seçildi. Favicon logoya uyduruldu: elle çizilmiş path (kesik ayaklı P + mor üçgen, “UC” + nokta kalktı); `apple-touch-icon.png`, `icon-192/512.png` aynı SVG'den canvas ile üretildi (köşesiz kare).
- **Karar:** Site haritasında site tarafında düzeltilecek bir şey yok; bundan sonra yalnız beklenir, kayıt tekrar silinmez. Mobil yazı menüsünde bölüm adı gösterilmez (yalnız numara). Dış kaynak, sahibi isterse kaynak linkli kısa alıntı olarak girebilir (§8 istisnası); ton “ben demiştim” değil, “sonradan duydum”.
- **Açık kalan:** Site haritası durumu, dizine ekleme istekleri (Açık işler).
- **Sonraki adım:** Search Console › Site haritaları'na bak; sonra dizine ekleme isteklerini dene.
