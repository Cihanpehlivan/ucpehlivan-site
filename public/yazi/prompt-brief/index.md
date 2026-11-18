# Prompt Yazmak, Aslında İyi Bir Brief Yazmak

Umut Cihan Pehlivan · 16 Kasım 2026 · 7 dk okuma  
Kaynak: https://ucpehlivan.web.app/yazi/prompt-brief/

![“İyi prompt, iyi brief’tir.” yazısı; yanında Hedef, Sınırlar ve Serbestlik maddeleri işaretlenmiş bir kâğıt altlığı ve kalem.](https://ucpehlivan.web.app/yazi/prompt-brief/kapak.webp)

> Yeni modeller zeki; adım adım reçeteyle kısıtlanınca değil, hedef ve sınırla yönlendirilince iyi iş çıkarıyor. Bir proje yöneticisinin gözünden interaktif bir okuma.

## Özet

- Yeni modellere adım adım tarif yazma. **Hedefi**, **sınırları** ve modele bıraktığın **serbest alanı** yaz.
- Rol vermek, uzun brief ve her şeyi tek mesaja sığdırmak artık işe yaramıyor. Yerine somut malzeme, kısa ve net metin, hazır proje bağlamı ver.
- Kopyalanabilir şablon: **Hedef + Elindekiler + Sınırlar**, sonunda “Talimatımda bir hata görürsen önce bana söyle.”

## 01 · Neden bu yazı

**Tek cümlelik brief:** İyi bir brief adımları saymaz: nereye varılacağını söyler, aşılmayacak çizgiyi belirler, yolu bulmayı uzmanına bırakır.

- **Hedef:** İş hangi hâlde teslim edilmiş sayılır?
- **Sınır:** Neye dokunulmayacak, hangi karar sende?
- **Serbestlik:** Geri kalan her seçim modelin.

İyi bir prompt da iyi bir proje brief'i gibi çalışır: nereye varılacağını ve neyin dışına çıkılmayacağını söyler, yolu bulmayı uzmanına bırakır.

Bir yıl önce ben de hazır prompt şablonlarıyla çalışıyordum: modele bir rol ver, adımları sırala, çıktının formatını dikte et. O dönem işe yarıyordu, çünkü modeller elinden tutulmadan yolu bulamıyordu. Bugünün modelleri farklı. Akıl yürütüyor, bağlamı okuyor, bazen benim aklıma gelmeyen bir yolu öneriyor. Onları eski şablonlarla adım adım yönlendirmek, zeki bir uzmanı kendi planımın sınırına hapsetmek demek. Adımları bırakıp sadece hedefi ve sınırları verdiğimde aynı model daha iyi iş çıkarıyor.

> **Sonradan duyduğum:** Claude Code’u geliştiren [Boris Cherny](https://x.com/bcherny/status/2107565388250874193), prompt yazmak için kısa bir öneri paylaştı: “Claude ile bir iş arkadaşınla konuşur gibi konuş.” Ona göre bunun bir sırrı yok; çoğu iş için her adımı dikte etmeye gerek yok. Okuyunca gülümsedim: bu yazının anlatmaya çalıştığı şey de tam olarak bu.

## 02 · Şablondan kalan üç alışkanlık

*Hazır prompt şablonlarındaki hangi alışkanlıklar yeni yapay zekâ modellerinde artık işe yaramıyor?*

Hazır şablonlardan bana üç alışkanlık kalmıştı. Üçü de bir zamanlar işe yarıyordu, bugün modeli yavaşlatıyor. Bir brief'i revize eder gibi üzerlerinden geçelim.

### 1. Modele unvan takmak

Modele unvan vermek, yeni gelen birine kartvizit bastırmak gibi; kimse bu yüzden daha iyi yazmaz. Farkı, eline koyduğun somut malzeme ve neyin iyi sayılacağını söyleyen ölçü yaratıyor.

**Eski:**
> Sen ödüllü bir metin yazarısın. Bu kampanya için slogan yaz.

**Yerine:**
> Beğendiğimiz iki eski slogan ve marka sesi notu ekte. Bu kampanya için 5 slogan öner; her biri en fazla 6 kelime olsun.

### 2. Brief'i romana çevirmek

Uzun bir brief'i insan okumaz; model okur ama asıl önemli satırı kalabalığın içinde kaçırır. Ne kadar az ve net yazarsan, o kadar az yanlış anlaşılırsın.

**Eski:**
> [Projenin bütün geçmişi, üç kez tekrarlanan aynı uyarı, "belki lazım olur" diye eklenmiş notlar…]

**Yerine:**
> Bu iş için gereken üç bilgi, bir hedef, iki sınır.

### 3. Her şeyi tek mesaja sığdırmak

Yazdığın mesaj, modelin önündeki masanın sadece bir köşesi. Masanın geri kalanında proje dosyaları, bağlı uygulamalar, kayıtlı talimatlar ve önceki konuşmalar duruyor. Masayı bir kez düzenlemek, her seferinde uzun mesaj yazmaktan daha çok işe yarıyor.

**Eski:**
> Marka kurallarını, renk kodlarını ve geçen ayki geri bildirimleri aşağıya yapıştırıyorum…

**Yerine:**
> Güncel marka kılavuzu ve Figma dosyası projede bağlı. Bu haftaki iş: kampanya sayfasının mobil versiyonu.

Üçüncüsü en sık atlananı. Her konuşmaya aynı açıklamaları yeniden yapıştırmak yerine, onları modelin her seferinde bulacağı yere koymak gerekiyor: proje dosyaları, kayıtlı talimatlar, bağlı uygulamalar. Mesaj kısalıyor, sonuç her seferinde aynı çizgide kalıyor. Prompt tek başına yetmiyor; masa da hazır olmalı.

## 03 · Tarifi değil, tabağı anlat

*Adım adım talimat yerine hedef ve sınır yazmak neden daha iyi sonuç veriyor?*

Güçlü bir modele adım adım tarif yazdığında, onu kendi planının içine kapatırsın. Model senin bildiğin sırayla ilerler; daha iyi bir yol olsa bile aramaz. İşe yarayan brief üç şeyi söyler, gerisini bırakır:

- **Hedef:** İş hangi hâlde teslim edilmiş sayılır?
- **Sınır:** Neye dokunulmayacak, hangi karar sende kalıyor?
- **Serbestlik:** Bu ikisinin dışında kalan her seçim modelin.

### Adım adım tarif

Adım adım tarif → Model talimatı satır satır uygular → Senin planın kadar bir sonuç

**Örnek prompt:**
> Önce metni oku. Sonra başlıkları çıkar. Her başlığın altına üç madde yaz. En sonda hepsini bir tabloya dök.

### Hedef + sınır

Hedef + sınır + serbestlik → Model kendi çözümünü kurar → Planının ötesine geçen sonuç

**Örnek prompt:**
> Hedef: yöneticinin iki dakikada okuyacağı bir özet. Sınırlar: metinde olmayan bilgi ekleme; beş maddeyi geçme.

*Tarif modeli senin planına bağlar; sınır çizilmiş bir alanda ise kendi çözümünü kurar.*

Tarif yazdığında modelden sadece uygulayıcı olmasını istemiş olursun. Senin planından iyi bir fikri varsa onu hiç duymazsın; planında bir hata varsa onu da harfiyen uygular.

Bunu restoranda zaten yapıyoruz. Şefe "soğanı önce kavur, sonra domatesi ekle" demeyiz. "Acısız olsun, fıstık alerjim var, yirmi dakikada gelsin" deriz. Tabağın nasıl yapılacağı onun işi.

Tek istisna: işin her adımını gerçekten biliyorsan ve sonucun birebir senin istediğin gibi olması gerekiyorsa, tarifi yaz. Bilmediğin bir alanda adım saymak ise modeli senin tahminlerinin peşine takar.

## 04 · Masamdaki iki model

*Claude ve GPT'ye prompt yazarken nelere dikkat ediyorum?*

Günlük işimde en çok Claude kullanıyorum; GPT'yi daha az, belirli işler için açıyorum. O yüzden aşağıdaki karşılaştırma bir uzman tablosu değil, kendi masamdan notlar. Model sürümleri değiştikçe bu notlar da değişebilir.

### Claude · her gün

- **Ne gördüm:** Ne istediğimi anlamaya çalışıyor; açık bıraktığım yeri kendi yorumuyla dolduruyor.
- **Dikkat ettiğim:** Bazen onun "tamam" dediği iş, benim kafamdaki tamamdan önce bitiyor ya da istemediğim bir ekleme geliyor.
- **Nasıl yazıyorum:** Amacı, kabul ölçüsünü ve dokunulmayacak yerleri yazıyorum; gerisini ona bırakıyorum.

### GPT · ara sıra

- **Ne gördüm:** Daha az kullandığım için gözlemim sınırlı; verdiğim talimata daha sadık kalıyor gibi.
- **Dikkat ettiğim:** Talimatımda bir eksik ya da hata varsa onu da olduğu gibi uygulayabiliyor.
- **Nasıl yazıyorum:** Talimatı daha açık, sınırları daha net yazıyorum; bir hata görürse önce söylemesini ayrıca istiyorum.

Bu bana ekip yönetimini hatırlatıyor. Bazı insanlar yazılanı birebir uygular, bazıları önce amacı sorar ve başka bir yol önerir. İkisine de aynı brief'i yazmazsın.

Benim için pratik sonuç şu: hangi modelle çalışırsam çalışayım önce amacı yazıyorum. Talimata sadık bir modelde sınırları daha net çiziyorum; niyeti okumaya çalışan bir modelde ise işin ne zaman bitmiş sayılacağını.

## 05 · Eski promptu brief'e çevir

*Prompt şablonu: hedef, elindekiler ve sınırlarla kendi brief'ini oluştur, kontrol et ve kopyala.*

Şimdi sıra sende. Aşağıdaki tezgâhta eski bir promptu brief'e çeviriyorsun: bir örnek seç ya da kendi promptunu yapıştır, sonra hedefi, elindekileri ve sınırları yaz. Sağdaki kontrol listesi brief'in nerede eksik kaldığını gösteriyor.

### Boş şablon

```text
Hedef: [iş hangi hâlde teslim edilmiş sayılır]
Elindekiler: [ham malzeme; özetleme, olduğu gibi yapıştır]
Sınırlar: [neye dokunmasın, neyi asla yapmasın]
Gerisi sende. Talimatımda bir hata görürsen önce bana söyle.
```

### Brief kontrolü

- **Hedef yazıldı:** İş hangi hâlde teslim edilmiş sayılır?
- **Ham malzeme eklendi:** Özetleme, olduğu gibi yapıştır.
- **En az bir sınır var:** Neye dokunulmayacak?
- **İstemediğini de yazdın:** Model, boş bıraktığın her alanı en sıradan seçenekle doldurur.
- **Ölçülebilir bir şey var:** Bir sayı, bir süre ya da bir kabul ölçüsü.
- **Unvan yok:** Rol cümlesi yerine malzeme ver.
- **Adım adım tarif yok:** Sırayı model kursun.

### Örnekler

**Toplantı notundan görev**

- Eski prompt: “Bu notlardan görev çıkar.”
- Neden zayıf: Belirsiz istek, belirsiz görev üretir.
- Hedef: ClickUp'a girilecek görevleri çıkar
- Elindekiler: [toplantı notlarının tamamı]
- Sınırlar:
  - süre tahmini ekleme
  - her görev tek bir iş olsun
  - sahibi belli olmayanları ayrı listele

**Kızgın bir maile cevap**

- Eski prompt: “Karşı taraf gecikmeye kızmış, özetle böyle. Cevap yaz.”
- Neden zayıf: Senin özetin tonu ve asıl derdi kaybettirir.
- Hedef: sakin ve çözüm odaklı bir cevap taslağı
- Elindekiler: [mailin tamamı]
- Sınırlar:
  - tarih sözü verme
  - suçu kimseye atma

**Figma QA**

- Eski prompt: “Tasarımı kontrol et.”
- Neden zayıf: "Kontrol et" bir hedef değil.
- Hedef: mobil ve masaüstü ekranlar arasındaki tutarsızlıkları bul
- Elindekiler: [ekran görüntüleri]
- Sınırlar:
  - sadece listele, çözüm önerme
  - her maddeye ekran adını yaz

**SEO meta açıklaması**

- Eski prompt: “Bu sayfa için SEO uyumlu bir açıklama yaz.”
- Neden zayıf: "SEO uyumlu" bir his, karakter sınırı bir ölçü.
- Hedef: arama sonucunda tıklatan 3 meta açıklama önerisi
- Elindekiler: [sayfa metni, hedef anahtar kelime]
- Sınırlar:
  - en fazla 155 karakter
  - abartılı vaat yok
  - marka adı sonda

**Çeviri dosyası**

- Eski prompt: “Bu Excel'i İngilizceye çevir.”
- Neden zayıf: İstemediğini söylemezsen model her şeyi çevirir.
- Hedef: marka sesine uygun, doğal bir çeviri
- Elindekiler: [dosya, marka ses notu]
- Sınırlar:
  - anahtar sütununa dokunma
  - ürün adlarını çevirme
  - satır sayısını değiştirme

**Haftalık durum raporu**

- Eski prompt: “Bu haftanın durum raporunu yaz.”
- Neden zayıf: Okuyucuyu ve süreyi tanımlarsan uzunluk kendiliğinden belirlenir.
- Hedef: yöneticinin 1 dakikada okuyacağı haftalık rapor
- Elindekiler: [ClickUp görev listesi]
- Sınırlar:
  - teknik terim yok
  - en fazla 5 madde
  - riskleri ayrı başlıkta yaz

## 06 · Sonuç

*Prompt yazmak neden aslında iyi bir brief yazmak?*

Prompt yazmak yeni bir meslek değil; kendini net ifade etmenin yeni adı. İyi brief yazan biri, iyi prompt yazmanın yarısını zaten biliyor.

[LinkedIn'de takip et](https://www.linkedin.com/in/umutcihanpehlivan/)
