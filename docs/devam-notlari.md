# Devam notları arşivi

CLAUDE.md §11'de yalnız son 3 not durur. Daha eski notlar buraya, **en üste** taşınır (yeniden eskiye). Güncel açık işler CLAUDE.md §11 › "Açık işler" listesindedir; buradaki "Açık kalan" satırları o günün durumudur.

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

