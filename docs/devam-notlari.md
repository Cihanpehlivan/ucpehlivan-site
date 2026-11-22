# Devam notları arşivi

CLAUDE.md §11'de yalnız son 3 not durur. Daha eski notlar buraya, **en üste** taşınır (yeniden eskiye). Güncel açık işler CLAUDE.md §11 › "Açık işler" listesindedir; buradaki "Açık kalan" satırları o günün durumudur.

### 2026-11-18 — Search Console site haritası + mobil bölüm menüsü (Windows)
- **Yapılan:** Repo `gh` olmadan GitHub ZIP ile alındı (uzun yol sınırı: `Expand-Archive` hata verir, önek kırpılarak açıldı). Canlı `sitemap.xml` ve `robots.txt` Googlebot UA ile 200. Search Console'da durum hâlâ "Getirilemedi" idi; `sitemap.xml` için "Canlı URL'yi test et" → "URL, Google tarafından kullanılabilir". Kayıt silindi ve yeniden gönderildi. `/yazi/prompt-brief/` için dizine ekleme isteği → "Kota Aşıldı". Yazıda mobil bölüm şeridi kesiliyordu (405 px içerik, 335 px alan; 06 görünmüyordu): 900 altı şeritte yalnız numara, `space-between`; bölüm adı görsel olarak gizli, ekran okuyucuda kalır. `yazi.css?v=05601ec7`, `ui-kit/components.json` güncellendi. Yerelde (PowerShell `HttpListener`, port 5077; 5050 bu makinede dolu) 375 px'te doğrulandı. Yazı kapağı yenilendi ("İyi prompt, iyi brief’tir" görseli): `kapak.webp` 1536×864 (16:9), 51 KB; tarayıcı canvas'ıyla sıkıştırıldı (bu makinede görüntü aracı yok). Dosya adı aynı → blog kartı da değişti (Firestore'a dokunulmadı). Mobildeki 3:2 kapak kırpması kaldırıldı (yazı kesilirdi). `meta.cover`, alt metin, `index.md`, `ui-kit/tokens.json` güncellendi, `yazi.css?v=7c88ef8d`. 01'in sonuna “Bu arada” not kutusu eklendi: Boris Cherny'nin X gönderisi (“Claude ile bir iş arkadaşınla konuşur gibi konuş”), link: x.com/bcherny/status/2107565388250874193. Yeni alan `section.aside {label, text}` (metinde `[ad](https://…)` linki); `build-yazi.mjs` (`aside()`, `mdLink`) ve `yazi-md.mjs` bunu işler; HTML ve `index.md` elle güncellendi. Yeni bileşen `Box/Aside` (`.yz-aside`, Özet ile aynı dil); `meta.updated` 2026-11-18; `yazi.css?v=1fd3e06c`. Yazının `og.png`'si yeni kapaktan üretildi: 1200×630, kapak kırpılmadan yüksekliğe sığdırıldı, yanlar kapak kenar rengiyle (`meta.cover.bg` = `#EFF1F5`) doldu; ~507 KB PNG. `build-yazi.mjs --og` artık kapak varsa aynısını üretir (Mac'te eski başlık şablonu geri gelmez). Kapak ve og.png aynı adla 7 gün önbellekte; LinkedIn eski önizlemeyi gösterirse Post Inspector ile yenile. Not kutusu etiketi “Bu arada” oldu. 2026-11-19: Hakkımda'daki SVG çizim yerine avatar geldi (`public/img/avatar.webp`, 680×880, 66 KB, kenar boşluğu kırpıldı, şeffaf). `render.js` › `ILLUSTRATION` + derlenmiş `app.js`/`admin.js` (elle, birebir değiştirme) + `public/index.html`; `main.css` › `.about-avatar` (daire zemin + maske); `ASSET_V` 10→11. Yerelde masaüstü, tablet ve 375 px'te doğrulandı (hydrate ile). Telefonda sola yapışık durduğu için ortalandı ve 240px yapıldı (`ASSET_V` 12). Yeni logo: iki satırlı SVG (`logoSvg`, mask id'leri `lgm-h`/`lgm-f`); P/h gövdesi ve v boşluğu tarayıcıda Archivo 800 ile ölçülüp sabitlendi; paketlere ve 5 HTML'e elle işlendi; `.wl` CSS'i kaldırıldı; `ASSET_V` 13. Saf path SVG için opentype.js ile glif çevirme denendi, dış kütüphane izni verilmediği için metinli SVG seçildi. Favicon logoya uyduruldu: elle çizilmiş path (kesik ayaklı P + mor üçgen, “UC” + nokta kalktı); `apple-touch-icon.png`, `icon-192/512.png` aynı SVG'den canvas ile üretildi (köşesiz kare).
- **Karar:** Site haritasında site tarafında düzeltilecek bir şey yok; bundan sonra yalnız beklenir, kayıt tekrar silinmez. Mobil yazı menüsünde bölüm adı gösterilmez (yalnız numara). Dış kaynak, sahibi isterse kaynak linkli kısa alıntı olarak girebilir (§8 istisnası); ton “ben demiştim” değil, “sonradan duydum”.
- **Açık kalan:** Site haritası durumu, dizine ekleme istekleri (Açık işler).
- **Sonraki adım:** Search Console › Site haritaları'na bak; sonra dizine ekleme isteklerini dene.

### 2026-11-17 — SEO/GEO teknik tur 2 (Windows)
- **Yapılan:** Canlı tarama (PageSpeed API 429 verdi; başlık, boyut, önbellek elle ölçüldü). Uygulanan: `/assets/**` 1 yıl önbellek + `ASSET_V` 8→9 + `kontrol.yml`'ye sürüm denetimi; yazının düz metin sürümü (`scripts/yazi-md.mjs` → `index.md`, head'de alternate link, llms.txt'te link); BreadcrumbList (yazı ve normal yazı şablonu); RSS beslemesi (`/feed.xml`, `renderFeed`, tüm sayfalarda head linki); uygulama simgeleri + manifest + theme-color; yazıya FAQPage (`meta.faq`); yazıda görünür sayfa yolu ve paylaşım satırı (ui-kit: `Nav/Breadcrumb`, `Share/Row`, molekül 21); ana sayfa illüstrasyonları telefonda gizli, tablette metnin altında (`ASSET_V` 10, telefonda sayfa ~690px kısaldı); yazı sayfasına kapak görseli (`meta.cover`, yazar satırının altında, BlogPosting `image` dizisinde ilk sırada, `index.md`'de de); 2026-11-18: bölüm menüsü Özet ile hizalı başlıyor (başlık bloğu `.yz-head` ızgaranın ilk satırına alındı); başlık bloğu tam genişliğe yayıldı, kapak iki kolonu kaplıyor (sayfa sağa kaymış görünüyordu). Kod tarayıcıda gerçek Firestore içeriğiyle test edildi; `index.md` ve yazı HTML'i tarayıcı çıktısından yazıldı.
- **Karar:** Sürüm artırma insan hafızasına bırakılmaz; `kontrol.yml` zorlar. 2026-11-17 taramasındaki tüm teknik maddeler tamam; kalan SEO işleri sahibinde (Search Console, Bing, alan adı).
- **Açık kalan:** Açık işler tablosu (Mac'te derleme doğrulaması dahil).
- **Sonraki adım:** Search Console doğrulaması gelince head'e ekle.

### 2026-11-17 — Mac'te derleme doğrulaması
- **Yapılan:** Mac'te `git pull` (Windows'taki 17 commit alındı), `npm install`, `npm run build:js` + `node scripts/publish.mjs` + `node scripts/build-yazi.mjs`. Windows'ta elle düzenlenen `app.js`/`admin.js` kaynaktan yeniden üretildi; gövdeyi etkileyen tüm değişiklikler (footer "Keşfet", Hesaplarım linki yok, wordmark yok, yönlendirme, admin alanları) elle sürümde de vardı. Eksik olan yalnız head'deki şema kodu (`@graph`, `og:site_name`); hydrate head'e dokunmadığı için etkisiz. Yazı HTML'i birebir aynı çıktı. Statik sayfalar ve `public/llms.txt` canlıyla aynı hâle getirilip commit'lendi.
- **Karar:** Mac'te sayfa üretimi için `npm run build` değil `build:js` + `publish.mjs` + `build-yazi.mjs` kullanılır (`npm run build` sayfaları örnek veriden üretir).
- **Açık kalan:** Mac'te `gh` yok; push sonrası `kontrol.yml` sonucuna GitHub › Actions'tan bakılır.
- **Sonraki adım:** Açık işler tablosundan devam.

### 2026-11-16 — Çalışma ortamı ve süreklilik (Windows → yarın Mac)
- **Yapılan:** Bugünkü tüm iş Windows'ta, Git/Node olmadan `gh` ile yapıldı. `scripts/gh-push.ps1` eklendi. §5'e Mac/Windows tablosu ve iki makine kuralları yazıldı. §11 kısaltıldı: son 3 not + "Açık işler" tablosu; eski notlar `docs/devam-notlari.md`'ye taşındı. `.github/workflows/kontrol.yml` eklendi (§2 yasaklı içerik = hata, §6.1 ui-kit senkronu = uyarı).
- **Karar:** Süreklilik CLAUDE.md (repoda, iki makinede aynı) + kural kontrolü workflow'u ile sağlanır. Claude'un makineye özel hafızasına güvenilmez.
- **Açık kalan:** Mac'te ilk oturumda `npm install && npm run build` + `git diff` ile elle düzenlenmiş derleme dosyalarını doğrula (§5).
- **Sonraki adım:** Sahibi yarın Mac'ten devam edebilir. Önce `git pull`, sonra §11'deki en son notları oku.

### 2026-11-16 — Yazı özeti yeniden tasarlandı
- **Yapılan:** Yazı başındaki özet kutusu ("AI slop" görünüyordu: beyaz kart + kalın mor sol şerit + tireli liste) yeniden yapıldı: kenarsız, hafif gri tonlu (`surface-2` %60) alan; üstte mor nokta + "ÖZET" etiketi ve çizgi; 3 kolon madde, aralarında ince çizgi, mor `01–03` numaralar; mobilde alt alta. Etiket "Kısaca" → **"Özet"** (`content/prompt-yazisi.json` › `summaryLabel`). Özet ile yazının başı arasında 56px (mobil 40px) boşluk; yazı beyaz, gölgeli iddia kutusuyla başlar. `ui-kit/components.json` › `Box/TLDR` her adımda aynı commit'te güncellendi (§6.1). Canlıda.
- **Karar:** Özet "yazının dışındaki not" gibi düz ve tonlu kalır; yazının içeriği beyaz/gölgeli kartlarla başlar. Ayrım yeni öğeyle değil ton farkı + boşlukla yapılır.
- **Açık kalan:** Yok.
- **Sonraki adım:** Yeni interaktif yazıda aynı özet yapısını kullan (`meta.summary`, 3 madde).

### 2026-11-16 — Design system (ui-kit)
- **Yapılan:** `ui-kit/` kuruldu: `UI-00-Kit.html` (tek board, 3 kolon, bileşenleri `public/` sayfalarından canlı okur), `tokens.json`, `components.json`, `README.md`. 24 atom · 19 molekül · 13 organizma · 5 şablon. ~90 kullanılmayan seçici `dropped_selectors`'a ayrıldı. Yazı başlığı rahatlatıldı (96px, lh 1.02, ls -.03em).
- **Karar:** Kaynak her zaman CSS + render.js; kit onları yansıtır. Senkron kuralları §2 ve §6.1'de. "Design canvas" aracı olmadığı için skill'deki `canvas.json` adımı uygulanmadı.
- **Açık kalan:** Tema butonu mobilde 36px (<44). `main.css` eski seçici temizliği. Normal blog yazısı ve kategori filtresi ekrana gelince kite eklenecek.
- **Sonraki adım:** İstenirse `main.css` temizliği (ayrı iş, önce önizleme).

### 2026-11-16 — SEO ve GEO
- **Yapılan:** Tarama yapıldı, 12 madde çıktı; 1–9 uygulandı ve canlıda: yazıda görünür yazar/tarih satırı ve "Kısaca" kutusu, `/llms.txt`, `/blog/prompt-yazmak-brief/` için 301 (`firebase.json`), tüm sayfalarda `og:site_name` + WebSite/Person verisi, BlogPosting tamamlandı (dateModified, yayıncı, @id bağları), blogda Blog verisi, site haritasında ana sayfa/blog tarihleri. Kod `render.js`, `build-static.mjs`, `build-yazi.mjs`; yazı HTML'i elle güncellendi (Node yok). `render.js` tarayıcıda gerçek Firestore içeriğiyle test edildi.
- **Karar:** Kısaca kutusu metni Claude taslağıdır; sahibi onayladı. Kişi verisinde işveren yok.
- **Açık kalan (sahibinde):** Google Search Console (URL öneki + HTML etiketi + sitemap gönderimi), Bing Webmaster Tools (Search Console'dan içe aktar), kendi alan adı kararı.
- **Sonraki adım:** Search Console doğrulama etiketi gelince `layout` head'ine ekle ve yayınla.

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

