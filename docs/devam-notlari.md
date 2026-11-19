# Devam notları arşivi

CLAUDE.md §11'de yalnız son 3 not durur. Daha eski notlar buraya, **en üste** taşınır (yeniden eskiye). Güncel açık işler CLAUDE.md §11 › "Açık işler" listesindedir; buradaki "Açık kalan" satırları o günün durumudur.

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

