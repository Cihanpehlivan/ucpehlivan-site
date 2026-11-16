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
| Başlangıç içeriği | `scripts/seed.json` = `public/admin/seed.json` | İkisi **aynı** kalmalı. |
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

> Bilinen sınır: `build-yazi.mjs` şu an tek bir dosyayı (`content/prompt-yazisi.json`) okur. İkinci interaktif yazıda scripti, `content/` klasöründeki tüm JSON dosyalarını işleyecek şekilde genelleştir.

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

**Yayın:** GitHub Actions › "Siteyi yayına al" › önce `onizleme`, kontrol et, sonra `canli`. Workflow içeriği Firestore'dan alır (`scripts/publish.mjs`) ve sayfaları üretir.

---

## 6. Tasarım kuralları

- Renkler sadece CSS değişkenlerinden: `--bg`, `--surface`, `--surface-2`, `--ink`, `--text`, `--muted`, `--line`, `--accent`, `--on-accent`, `--go`. Açık ve koyu temada çalışmalı.
- Fontlar: Archivo (başlık, `.d` sınıfı) ve Geist (metin).
- `[hidden]{display:none!important}` kuralı var. Bir öğeyi gizlemek için `hidden` kullan.
- Header'da buton **yok** (bilinçli karar). Tek "Takip et" hero'daki dönen rozettir ve Hesaplarım'a gider.
- Çizimler SVG, sitenin renk değişkenleriyle. Animasyonlar `prefers-reduced-motion` ile kapanır.
- Metinde Türkçe tipografi: kesme işareti ’, tırnak “ ”.

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

---

## 8. İnteraktif yazı nasıl hazırlanır (örnek: /yazi/prompt-brief/)

Sitedeki ilk interaktif yazı "Prompt Yazmak, Aslında İyi Bir Brief Yazmak" bu süreçle yapıldı. Yeni interaktif yazılarda aynı yolu izle.

```
 1. İLHAM        Bir video / okuma / gerçek iş deneyimi
      │          (Dış kaynağın adı, metni, rakamı sayfaya GİRMEZ. Fikir kendi
      ▼           deneyimimle, PM bakışıyla yeniden yazılır.)
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

Her oturumun sonunda **en üste** yeni bir not ekle. Eski notları silme. 10 nottan fazlası olursa en eski notları tek satırlık özetlere indir.

**Format:**

```markdown
### YYYY-AA-GG — <oturumun konusu>
- **Yapılan:** …
- **Karar:** … (varsa; kalıcı kararları §7'ye de ekle)
- **Açık kalan:** …
- **Sonraki adım:** …
```

### 2026-11-16 — Okunurluk, ana sayfa düzeni ve footer
- **Yapılan:** Yazı sayfası (`yazi.css`): sütun çizgileri gizlendi, bölümlere mor şeritli ayırıcı, tekrar eden bölüm etiketi gizlendi, giriş cümlesi koyulaştı, küçük etiketler büyüdü. Ana sayfa (`main.css` sonundaki "Düzen ve okunurluk" bloğu): eşit bölüm boşlukları, ayırıcılar, başlık açıklaması başlığın altında, tek yazı kartı tam genişlikte. Footer: wordmark kaldırıldı, telif ortada, "Sayfa" → "Keşfet", Hesaplarım çıkarıldı (`render.js` + derlenmiş `app.js`/`admin.js` + statik HTML'ler). Hepsi önizleme → canlı ile yayında.
- **Karar:** §7'ye eklendi (footer, sütun çizgileri).
- **Açık kalan:** Bu bilgisayarda Node.js yok; `app.js` ve `admin.js` elle düzenlendi (kaynak `render.js` ile aynı). Node olan bir yerde `npm run build` çalıştırıp farkın çıkmadığını doğrula. `ASSET_V` (main.css `?v=8`) artırılmadı; `/assets/**` 1 saat önbellekte. Push ve yayın `gh` (GitHub CLI) ile yapılıyor, Git kurulu değil. Workflow'daki `actions/checkout@v4` ve `setup-node@v4` Node 20 uyarısı veriyor.
- **Sonraki adım:** Bir sonraki yazı. Fırsat olunca `npm run build` ile derlenmiş dosyaları kaynaktan yeniden üret.

### 2026-11-16 — CLAUDE.md eklendi
- **Yapılan:** Proje rehberi (bu dosya) oluşturuldu. İnteraktif yazı süreci (§8) ve devam notu kuralı eklendi.
- **Açık kalan:** Repo herkese açık; bu dosya da herkese açık. Private repo veya `CLAUDE.local.md` kararı verilmedi.
- **Sonraki adım:** Bir sonraki yazı veya interaktif yazı.

### 2026-11-16 — İnteraktif yazı yayında
- **Yapılan:** /yazi/prompt-brief/ yayına alındı (content/prompt-yazisi.json + scripts/build-yazi.mjs). Yazı şemasına "Özel sayfa adresi" alanı eklendi. og.png üretildi. Eski 3 yazı kaldırıldı; listede sadece bu yazı var.
- **Açık kalan:** `build-yazi.mjs` tek dosyaya bağlı (§4 notu). LinkedIn paylaşımı.
- **Sonraki adım:** İkinci interaktif yazıda scripti genelleştir.

### 2026-11-16 — Kişisel marka yapısına geçiş
- **Yapılan:** Site CV sitesinden içerik/vitrin sitesine çevrildi. Admin yeni yapıya uyarlandı (Düzen, Hero, Yazılar, Hakkımda, Hesaplarım). Bölüm aktif/pasif, kategori listesi ve filtresi, hesaplar listesi eklendi. CV, fotoğraf ve vaka görselleri silindi. Footer sadeleştirildi.
- **Karar:** §7'deki kararlar.
- **Açık kalan:** X ve YouTube hesapları yok. Pasif bölüm fikirleri (§10) bekliyor.

