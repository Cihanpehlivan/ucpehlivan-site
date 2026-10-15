# ucpehlivan.web.app — Site + kendi CMS'imiz (ücretsiz Spark planı)

Bu proje **sadece Firebase'in ücretsiz servislerini** kullanır: Hosting, Firestore ve Authentication. Cloud Functions ve Storage kullanılmaz, bu sebeple Blaze planına gerek yoktur.

| Parça | Konum | Görevi |
|---|---|---|
| Site | `public/` (Hosting) | Statik sayfalar. Ziyaretçinin tarayıcısı Firestore'daki yeni içeriği okur ve sayfayı anında günceller. |
| Admin paneli | `/admin` | Google ile giriş. Tüm alanları, projeleri ve blogu yönetirsin. |
| Veritabanı | Firestore | Düzenleme verisi (`content`, `cases`, `posts`), yayın paketi (`site/public`) ve görseller (`media`). |

**Akış:** /admin'de düzenle → Kaydet → site anında güncellenir.

---

## Kurulum (bir kez, yaklaşık 15 dakika)

### 1. Firebase konsolunda (proje: `ucpehlivan`, plan: Spark)

1. **Authentication → Sign-in method → Google →** Etkinleştir.
2. **Firestore Database → Create database →** Production mode → Konum: `eur3 (europe-west)`.

Storage ve Blaze planı **gerekmez**.

### 2. Bilgisayarında (Mac Terminal)

```bash
cd ~/Downloads/fcms2
npm install -g firebase-tools     # bir kez (izin hatası alırsan başına sudo ekle)
firebase login
firebase deploy
```

`firebase deploy` komutu siteyi, admin panelini ve veritabanı güvenlik kurallarını yükler. Bu adımda `npm install` gerekmez, tüm dosyalar hazırdır.

### 3. İçeriği yükle

1. https://ucpehlivan.web.app/admin adresini aç.
2. **Google ile giriş yap** (pehlivan.uc@gmail.com).
3. **Başlangıç içeriğini yükle** butonuna bas.

Kurulum tamam.

---

## Günlük kullanım

| Menü | Ne yönetirsin |
|---|---|
| **Ana sayfa** | 10 sekme: Hero, Markalar, Rakamlar, Ne yaparım, Projeler, Çalışma şekli, Hakkımda, Yetkinlikler, Blog, İletişim |
| **Öne çıkan işler** | Vaka kartları: görsel, etiket, rakamlar, renkler, göster/gizle, sıralama |
| **Blog yazıları** | Zengin metin editörü, görsel ekleme, taslak/yayında, kategori, tarih, kapak, SEO |
| **Site ayarları** | İletişim bilgileri, CV (PDF), SEO, Google Analytics, header ve footer |

- Sağdaki **canlı önizleme**, kaydetmeden önce sonucu gösterir.
- **Ctrl/Cmd + S** kaydeder.
- Yüklenen görseller otomatik küçültülür ve WebP'ye çevrilir. Görseller ve PDF en fazla 700 KB olabilir (sıkıştırmadan sonra).

### Paylaşım önizlemeleri ve SEO için (isteğe bağlı)

Site her zaman güncel içeriği gösterir. Ama LinkedIn ve WhatsApp gibi platformlar sayfanın **kayıtlı HTML'ini** okur. Yeni bir blog yazısını paylaşmadan önce bilgisayarında şu komutu çalıştır:

```bash
cd ~/Downloads/fcms2
npm run publish
```

Bu komut Firestore'daki içeriği okur, tüm sayfaları statik HTML olarak üretir, görselleri dosyaya çevirir ve Hosting'e yükler. Ücretsizdir. Ek paket kurulumu gerekmez.

---

## Ücretsiz kota

Spark planının günlük ücretsiz kotası kişisel site için yeterlidir. Her sayfa ziyareti genellikle Firestore'dan **1 okuma** yapar (yeni yüklenen görseller varsa birkaç okuma daha). Kota dolarsa site çalışmaya devam eder ve sayfanın kayıtlı sürümünü gösterir. Kota, ertesi gün sıfırlanır.

## Güvenlik

- Sadece `pehlivan.uc@gmail.com` hesabı içerik yazabilir (`firestore.rules`).
- Yönetici e-postasını değiştirmek için: `firestore.rules` ve `admin/src/store.js` (`ADMIN_EMAIL`) dosyalarını düzenle, `npm install && npm run build:js` çalıştır, sonra `firebase deploy`.

## Geliştirme

- `npm install` (sadece kodu değiştireceksen)
- `npm run dev` → site: http://localhost:5050, admin deneme modu: http://localhost:5050/admin/?mock
- `npm run build:js` → admin paneli ve site betiğini derler.
- Sayfa şablonları: `shared/render.js` (site, admin önizlemesi ve statik üretim aynı dosyayı kullanır).
- Stil: `public/assets/main.css`, davranış: `public/assets/main.js`.

## Eski siteye dönüş

Firebase konsolu → **Hosting → Release history** → eski sürüm → **Rollback**.
