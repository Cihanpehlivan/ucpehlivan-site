// Admin panelindeki tüm formların alan tanımları.
const t = (key, title, extra = {}) => ({ key, title, type: 'text', ...extra });
const ta = (key, title, rows = 3, extra = {}) => ({ key, title, type: 'textarea', rows, ...extra });
const sel = (key, title, options, extra = {}) => ({ key, title, type: 'select', options, ...extra });
const strs = (key, title, extra = {}) => ({ key, title, type: 'strings', help: 'Her satıra bir öğe yaz.', ...extra });
const list = (key, title, fields, extra = {}) => ({ key, title, type: 'list', fields, ...extra });

export const PILL_OPTS = [['none', 'Yok'], ['check', 'Yapılacaklar listesi'], ['gantt', 'Gantt'], ['chart', 'Grafik']];
export const ICON_OPTS = [['document', 'Doküman'], ['team', 'Ekip'], ['trend', 'Grafik'], ['shield', 'Kalkan'], ['sparkle', 'Yıldız (AI)'], ['cart', 'Sepet'], ['code', 'Kod'], ['chat', 'Mesaj']];

export const settingsSchema = [
  { type: 'heading', title: 'Kimlik ve iletişim' },
  t('name', 'Ad soyad', { required: true }), t('role', 'Unvan'), t('location', 'Konum'),
  t('email', 'E-posta', { required: true }), t('phone', 'Telefon'), t('linkedin', 'LinkedIn adresi'),
  { key: 'cvUrl', title: 'CV dosyası (PDF)', type: 'file', accept: 'application/pdf', help: 'Yeni PDF yükle veya bir adres yaz. Varsayılan: /cv.pdf' },
  { type: 'heading', title: 'SEO ve analitik' },
  t('seoTitle', 'Sayfa başlığı (title)', { max: 70 }), ta('seoDescription', 'Meta açıklama', 3, { max: 170 }), t('gaId', 'Google Analytics kimliği', { help: 'Örnek: G-XXXXXXXXXX' }),
  { type: 'heading', title: 'Header ve footer' },
  t('headerCta', 'Header butonu metni'), ta('footerTagline', 'Footer sloganı', 2), t('footerNote', 'Footer alt notu'),
];

export const homeSections = [
  { key: 'hero', title: 'Hero', anchor: 'top', fields: [
    t('badge', 'Üst etiket'),
    list('lines', 'Başlık satırları', [t('before', 'Görselden önce'), sel('pill', 'Görsel kutusu', PILL_OPTS), t('after', 'Görselden sonra')], { itemTitle: (x) => [x.before, x.pill && x.pill !== 'none' ? `[${x.pill}]` : '', x.after].filter(Boolean).join(' '), help: 'Büyük harfle yaz. Her satır sayfada ayrı bir satırdır.', defaults: { before: '', pill: 'none', after: '' } }),
    t('ariaLabel', 'Başlığın düz metni (SEO ve ekran okuyucu)'),
    ta('text', 'Giriş metni', 4), t('cvLabel', 'CV butonu metni'), t('projectsLabel', 'Projeler butonu metni'),
    t('badgeText', 'Dönen rozet metni', { help: 'Sonda bir boşluk bırak.' }),
  ] },
  { key: 'brands', title: 'Markalar', anchor: 'top', fields: [t('label', 'Etiket'), strs('items', 'Marka adları')] },
  { key: 'stats', title: 'Rakamlar', anchor: 'rakamlar', fields: [
    t('kicker', 'Küçük etiket'), ta('title', 'Başlık', 2, { help: 'Satır atlamak için Enter kullan.' }), ta('intro', 'Açıklama'),
    list('tiles', 'Kartlar', [
      sel('visual', 'Kart tipi', [['none', 'Sadece rakam/metin'], ['sparkline', 'Rakam + çizgi grafik'], ['bars', 'Rakam + sütun grafik'], ['trophy', 'Ödül kartı'], ['board', 'Sprint panosu']]),
      t('title', 'Başlık (sadece ödül kartı)'),
      t('value', 'Gösterilen değer', { help: 'Örnek: %43, 10+, AI. Sayaç doluysa bu alan kullanılmaz.' }),
      { key: 'countTo', title: 'Sayaç hedefi', type: 'number', help: 'Doldurursan rakam 0\'dan bu sayıya sayar.' },
      t('prefix', 'Sayaç ön eki', { help: 'Örnek: %' }), t('suffix', 'Sayaç son eki', { help: 'Örnek: +' }),
      ta('label', 'Açıklama', 2),
      sel('size', 'Boyut', [['normal', 'Normal'], ['wide', 'Geniş (2 sütun)'], ['tall', 'Uzun (2 satır)']]),
      sel('theme', 'Renk', [['default', 'Standart'], ['accent', 'Vurgu (mor)'], ['ink', 'Ters (koyu/açık)']]),
    ], { itemTitle: (x) => x.title || (x.countTo != null && x.countTo !== '' ? `${x.prefix || ''}${x.countTo}${x.suffix || ''}` : x.value) || ({ board: 'Sprint panosu', trophy: 'Ödül kartı' }[x.visual]) || 'Yeni kart', itemSub: (x) => x.label, defaults: { visual: 'none', size: 'normal', theme: 'default', value: '', label: '' }, help: 'Sıra, ızgaradaki yerleşimi belirler.' }),
  ] },
  { key: 'services', title: 'Ne yaparım', anchor: 'neler', fields: [
    t('kicker', 'Küçük etiket'), t('title', 'Başlık'), ta('intro', 'Açıklama'), t('buttonLabel', 'Buton metni'),
    list('items', 'Hizmet kartları', [sel('icon', 'Simge', ICON_OPTS), t('title', 'Başlık'), ta('text', 'Metin'), strs('tags', 'Etiketler (opsiyonel)')], { itemTitle: (x) => x.title, defaults: { icon: 'document', title: '', text: '', tags: [] } }),
  ] },
  { key: 'work', title: 'Projeler', anchor: 'vakalar', fields: [
    t('kicker', 'Küçük etiket'), t('title', 'Başlık'), ta('intro', 'Açıklama'),
    { type: 'note', title: 'Vaka kartlarını soldaki "Öne çıkan işler" sayfasından yönetirsin.' },
    t('otherTitle', '"Diğer projeler" başlığı'),
    list('other', 'Diğer projeler', [t('name', 'Proje adı'), t('type', 'Proje türü')], { itemTitle: (x) => x.name, itemSub: (x) => x.type, defaults: { name: '', type: '' } }),
  ] },
  { key: 'process', title: 'Çalışma şekli', anchor: 'surec', fields: [
    t('kicker', 'Küçük etiket'), ta('title', 'Başlık', 2), ta('intro', 'Açıklama'),
    list('steps', 'Adımlar', [t('title', 'Başlık'), ta('text', 'Metin')], { itemTitle: (x) => x.title, defaults: { title: '', text: '' } }),
    t('loopNote', 'Döngü notu'),
  ] },
  { key: 'about', title: 'Hakkımda', anchor: 'hakkimda', fields: [
    t('kicker', 'Küçük etiket'), t('title', 'Başlık'), { key: 'photo', title: 'Fotoğraf', type: 'image' },
    strs('paragraphs', 'Paragraflar', { help: 'Her satır ayrı bir paragraftır.' }),
    list('timeline', 'Deneyim ve eğitim', [t('org', 'Kurum'), t('period', 'Tarih aralığı'), { key: 'current', title: 'Devam ediyor', type: 'bool' }, t('role', 'Rol / bölüm'), strs('bullets', 'Maddeler', { help: 'Her satıra bir madde. Kalın yazı için **iki yıldız** kullan.' })], { itemTitle: (x) => x.org, itemSub: (x) => x.role, defaults: { org: '', period: '', current: false, role: '', bullets: [] } }),
  ] },
  { key: 'skills', title: 'Yetkinlikler', anchor: 'hakkimda', fields: [strs('row1', '1. şerit'), strs('row2', '2. şerit')] },
  { key: 'blog', title: 'Blog', anchor: 'yazilar', fields: [
    t('kicker', 'Küçük etiket'), t('title', 'Ana sayfa başlığı'), ta('intro', 'Ana sayfa açıklaması'),
    { key: 'count', title: 'Ana sayfada gösterilecek yazı sayısı', type: 'number' },
    t('pageTitle', 'Blog sayfası başlığı'), ta('pageIntro', 'Blog sayfası açıklaması'),
  ] },
  { key: 'contact', title: 'İletişim', anchor: 'iletisim', fields: [
    t('kicker', 'Küçük etiket'), t('title', 'Başlık'),
    list('paths', 'İletişim kartları', [t('title', 'Başlık'), ta('text', 'Metin'), t('primaryLabel', 'Ana buton metni'), t('primaryUrl', 'Ana buton adresi', { help: 'mailto:, tel:, https:// veya /cv.pdf' }), t('secondaryLabel', 'İkinci buton metni'), t('secondaryUrl', 'İkinci buton adresi')], { itemTitle: (x) => x.title, defaults: { title: '', text: '' } }),
  ] },
];

export const caseSchema = [
  t('name', 'Marka adı', { required: true }), t('headline', 'Kart başlığı', { required: true }), ta('description', 'Açıklama', 4),
  strs('tags', 'Etiketler', { help: 'Her satıra bir etiket. En fazla 4.' }),
  list('kpis', 'Öne çıkan bilgiler', [t('value', 'Değer', { help: 'Örnek: %43, 4, Uçtan uca' }), t('label', 'Açıklama')], { itemTitle: (x) => x.value, itemSub: (x) => x.label, defaults: { value: '', label: '' }, max: 2 }),
  { key: 'screenshot', title: 'Site ekran görüntüsü', type: 'image', help: 'Önerilen oran 5:4. Görselin üst kısmı gösterilir.' },
  t('barStrong', 'Alt şerit: kalın kısım'), t('barText', 'Alt şerit: devamı'),
  { key: 'color', title: 'Kart arka plan rengi', type: 'color' }, { key: 'highlight', title: 'Vurgu rengi (rakamlar)', type: 'color' },
  { key: 'visible', title: 'Sitede göster', type: 'bool' },
];

export const postSchema = [
  t('title', 'Başlık', { required: true }),
  { key: 'slug', title: 'Adres (slug)', type: 'slug', source: 'title', required: true, help: 'Sadece küçük harf, rakam ve tire. Yayından sonra değiştirme.' },
  sel('status', 'Durum', [['draft', 'Taslak'], ['published', 'Yayında']]),
  sel('category', 'Kategori', [['Proje yönetimi', 'Proje yönetimi'], ['SEO', 'SEO'], ['AI ve otomasyon', 'AI ve otomasyon'], ['Kariyer', 'Kariyer'], ['Teknik', 'Teknik']]),
  { key: 'publishedAt', title: 'Yayın tarihi', type: 'date' },
  { key: 'readingMinutes', title: 'Okuma süresi (dakika)', type: 'number', help: 'Boş bırakırsan kayıtta otomatik hesaplanır.' },
  ta('excerpt', 'Kısa özet (kartlarda görünür)', 3, { max: 220 }), ta('lede', 'Giriş paragrafı', 4),
  { key: 'body', title: 'Yazı metni', type: 'richtext' },
  { type: 'heading', title: 'Kapak' },
  sel('coverStyle', 'Kapak tipi', [['kanban', 'Kanban çizimi'], ['redirect', 'Yönlendirme (301) çizimi'], ['chat', 'Sohbet çizimi'], ['chart', 'Grafik çizimi'], ['image', 'Görsel yükle']]),
  { key: 'coverImage', title: 'Kapak görseli', type: 'image', showIf: (v) => v.coverStyle === 'image' },
  { key: 'coverColor', title: 'Kapak arka plan rengi', type: 'color' },
  { key: 'coverHighlight', title: 'Kapak çizim rengi', type: 'color', showIf: (v) => v.coverStyle !== 'image' },
  { type: 'heading', title: 'SEO' },
  ta('seoDescription', 'Meta açıklama', 3, { max: 170, help: 'Boş bırakırsan kısa özet kullanılır.' }),
];

export const newCase = () => ({ name: 'Yeni proje', headline: '', description: '', tags: [], kpis: [], screenshot: '', barStrong: '', barText: '', color: '#1E2025', highlight: '#C2AEFF', visible: false });
export const newPost = () => ({ title: 'Yeni yazı', slug: '', status: 'draft', category: 'Proje yönetimi', publishedAt: new Date().toISOString().slice(0, 10), readingMinutes: null, excerpt: '', lede: '', body: '<p></p>', coverStyle: 'kanban', coverImage: '', coverColor: '#251845', coverHighlight: '#C2AEFF', seoDescription: '' });
