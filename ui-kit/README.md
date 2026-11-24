# ucpehlivan.web.app — UI kit

Bu klasör sitenin design system'idir. **Üretim kodu değildir.** Site `public/assets/main.css` ve `yazi.css` ile çalışır. Buradaki değerler o dosyalardan birebir alındı.

Kit yalnız yayındaki ekranlarda **gerçekten kullanılan** öğeleri içerir: `/`, `/blog/`, `/yazi/prompt-muhendisligi/`, `404` ve `/blog/post.html` kabuğu. Ekranda olmayan renk, stil veya bileşen kitte yoktur.

Bu klasör yayına girmez. Hosting yalnız `public/` klasörünü yükler.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `UI-00-Kit.html` | Görsel kit (tek board, 3 kolon, 4740 px). Bileşenleri `public/` altındaki üretilmiş sayfalardan **canlı** kopyalar ve sitenin gerçek CSS'iyle çizer; böylece ekranlar değişince kit de değişir. Organizmalar 1440 ve 375 px iframe içinde, %50 ölçekte. **Açmak için** repo kökünü bir yerel sunucuyla servis edin (ör. `npx serve .`) ve `/ui-kit/UI-00-Kit.html` adresine gidin. Dosyayı çift tıklayarak açmak çalışmaz (tarayıcı `fetch` izni vermez). |
| `tokens.json` | Renk (açık/koyu), tipografi, kırılım, yerleşim, boşluk, köşe, gölge, hareket, katman, ikon, varlık. Kullanılmayan değerler `legacy.unused` altında. |
| `components.json` | Her bileşen: kod, seviye, grup, ölçü, CSS seçicisi, sayfalar, kullandığı alt bileşenler. Şablonda olup ekranda olmayanlar `template_only`, CSS'te olup hiç kullanılmayanlar `dropped_selectors` altında. |

## Seviyeler

| Seviye | Tanım | Örnek | Sayı |
|---|---|---|---|
| Token | Tek değer | `--accent`, `display.article`, `radius.card` | — |
| Görsel | Logo, illüstrasyon, kapak | `Logo/Wordmark`, `Illustration/About` | — |
| Atom | Bölünmeyen parça | `Button/Primary`, `Field/Textarea` | 24 |
| Molekül | Atomların tek işe yarayan birleşimi | `Card/Post`, `Nav/Breadcrumb`, `Share/Row` | 21 |
| Organizma | Sayfada tek başına anlam taşıyan bölüm | `Header`, `Bench/Brief` | 13 |
| Şablon | Organizmaların sayfa sırası | `Template/Home` | 5 |
| Section | Sayfaya özel bölüm, kitte çizilmez | `Section/Yazı sonuç` | 2 |

**Adlandırma:** `Grup/Ad`. ` · ` sonrası varyant ya da durum: `Button/Ghost · sm`, `Row/Account · hot`.

## Kodlarken sıra

1. **Token → CSS değişkeni.** Renk için yalnız `--bg`, `--surface`, `--surface-2`, `--ink`, `--text`, `--muted`, `--line`, `--accent`, `--on-accent`, `--go`, `--stop` (durum kelimesi için `--go-ink`, `--stop-ink`). Bileşen CSS'ine hex yazılmaz. Bu değişkenler marka dosyasına bağlıdır: `public/assets/brand/pehlivan-tokens.css` (`--pa-*`), kurallar `docs/Pehlivan-AI-Marka-Kimligi.md`. Kit sayfası da önce bu dosyayı yükler.
2. **Kırılımlar sayı olarak:** `1020`, `900`, `640` (max-width).
3. **Atom → molekül → organizma.** Yeni bir şey çizmeden önce kitte karşılığı var mı bak.
4. **Şablon sırası** ana sayfada admin › Ana sayfa › Düzen'den gelir. Menü ve footer linkleri aktif bölümlerden otomatik oluşur.

## Board'da çizilmeyen kurallar

| Konu | Kural |
|---|---|
| Buton devre dışı | Yalnız `Seçili örnekten doldur` (yazı tezgâhı): `opacity .45`, `cursor not-allowed`. Başka disabled buton yok. |
| Odak | Site geneli `outline 2px accent, offset 3px`. Yazı sayfası etkileşimleri `3px`. Odak hiçbir yerde kaldırılmaz. |
| Form hatası | Yalnız Hedef alanı zorunlu. Hata: kenar `#D93A3A` + halka + alanın altında metin; `aria-invalid`, `aria-describedby`. |
| Aria | İkon butonlarında `aria-label`; dekoratif SVG'ler `aria-hidden`; sekmeler `role=tab/tabpanel`; çevirme ve seçim butonları `aria-pressed`; durum mesajı `role=status aria-live=polite`. |
| Dokunma alanı | En az 44px hedeflenir. İstisna: tema butonu mobilde 36px (bilinen sapma, açık kalan). |
| Hareket | Tüm animasyonlar `prefers-reduced-motion: reduce` ile kapanır. |
| Görsel oranı | Kart kapağı 16:10; paylaşım görseli 1200×630. |
| İçerik | İşveren, müşteri, marka adı ve rakamı yok; hizmet satışı dili yok (CLAUDE.md §2). Tırnak “ ”, kesme ’. |
| CTA / izleme | İzleme kodu yok. Yazı sayfasında analitik bilinçli olarak kapalı. |

## Açık kalanlar

- Tema butonu mobilde 36px; 44px dokunma alanı kuralının altında.
- `main.css` içinde eski yapıdan kalan ~70 kullanılmayan seçici var (`dropped_selectors`). Silinirse CSS ~%40 küçülür; ayrı bir temizlik işi.
- Normal (interaktif olmayan) blog yazısı şablonu (`post-head`, `prose`, `post-cta`) ekranda yok. İlk normal yazı yayınlanınca kite eklenmeli.
- Kategori filtresi (`filters`, `fbtn`) 2+ kategori olunca görünür; o zaman kite eklenmeli.
