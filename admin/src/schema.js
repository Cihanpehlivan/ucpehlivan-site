// Admin panelindeki tüm formların alan tanımları.
import { SECTION_KEYS } from '../../shared/render.js';

const t = (key, title, extra = {}) => ({ key, title, type: 'text', ...extra });
const ta = (key, title, rows = 3, extra = {}) => ({ key, title, type: 'textarea', rows, ...extra });
const sel = (key, title, options, extra = {}) => ({ key, title, type: 'select', options, ...extra });
const strs = (key, title, extra = {}) => ({ key, title, type: 'strings', help: 'Her satıra bir öğe yaz.', ...extra });
const list = (key, title, fields, extra = {}) => ({ key, title, type: 'list', fields, ...extra });

export const PILL_OPTS = [['none', 'Yok'], ['check', 'Yapılacaklar listesi'], ['gantt', 'Gantt'], ['chart', 'Grafik']];
export const ACCOUNT_ICON_OPTS = [['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['x', 'X'], ['youtube', 'YouTube'], ['instagram', 'Instagram'], ['mail', 'E-posta'], ['link', 'Diğer link']];
const SECTION_NAME = Object.fromEntries(SECTION_KEYS);

export const settingsSchema = [
  { type: 'heading', title: 'Kimlik' },
  t('name', 'Ad soyad', { required: true }), t('role', 'Unvan', { help: 'Sadece SEO verisinde kullanılır, sayfada görünmez.' }), t('location', 'Konum', { help: 'Footer\'da görünür. Boş bırakırsan gizlenir.' }),
  t('email', 'E-posta', { required: true }),
  { type: 'note', title: 'Sosyal hesap linklerini "Ana sayfa > Hesaplarım" sekmesinden yönetirsin.' },
  { type: 'heading', title: 'SEO ve analitik' },
  t('seoTitle', 'Sayfa başlığı (title)', { max: 70 }), ta('seoDescription', 'Meta açıklama', 3, { max: 170 }), t('gaId', 'Google Analytics kimliği', { help: 'Örnek: G-XXXXXXXXXX' }),
  { type: 'heading', title: 'Footer' },
  ta('footerTagline', 'Footer sloganı', 2), t('footerNote', 'Footer alt notu'),
];

export const homeSections = [
  { key: 'layout', title: 'Düzen', anchor: 'top', fields: [
    { type: 'note', title: 'Bölümlerin sırasını oklarla değiştir. "Sitede göster" kutusunu kaldırınca bölüm pasif olur: içerik silinmez, sadece sitede görünmez.' },
    list('layout', 'Ana sayfa bölümleri', [sel('key', 'Bölüm', SECTION_KEYS), { key: 'on', title: 'Sitede göster', type: 'bool', defaultOn: true }], {
      itemTitle: (x) => SECTION_NAME[x.key] || x.key, itemSub: (x) => (x.on === false ? 'Pasif' : 'Aktif'), defaults: { key: 'hero', on: true },
      help: 'Her bölüm listede bir kez olmalı. Menü ve footer linkleri aktif bölümlerden otomatik oluşur.' }),
  ] },
  { key: 'hero', title: 'Hero', anchor: 'top', fields: [
    t('badge', 'Üst etiket', { help: 'Boş bırakırsan gizlenir.' }),
    list('lines', 'Başlık satırları', [t('before', 'Görselden önce'), sel('pill', 'Görsel kutusu', PILL_OPTS), t('after', 'Görselden sonra')], { itemTitle: (x) => [x.before, x.pill && x.pill !== 'none' ? `[${x.pill}]` : '', x.after].filter(Boolean).join(' '), help: 'Büyük harfle yaz. Her satır sayfada ayrı bir satırdır.', defaults: { before: '', pill: 'none', after: '' } }),
    t('ariaLabel', 'Başlığın düz metni (SEO ve ekran okuyucu)'),
    ta('text', 'Giriş metni', 3), t('buttonLabel', 'Buton metni', { help: 'Yazılar bölümüne gider. Boş bırakırsan buton gizlenir.' }),
    t('badgeText', 'Dönen rozet metni', { help: 'Hesaplarım bölümüne gider. Sonda bir boşluk bırak.' }),
  ] },
  { key: 'blog', title: 'Yazılar', anchor: 'yazilar', fields: [
    t('kicker', 'Küçük etiket'), t('title', 'Ana sayfa başlığı'), ta('intro', 'Ana sayfa açıklaması', 2),
    { key: 'count', title: 'Ana sayfada gösterilecek yazı sayısı', type: 'number' },
    t('allLabel', '"Tümünü gör" buton metni'),
    t('pageTitle', 'Yazılar sayfası başlığı'), ta('pageIntro', 'Yazılar sayfası açıklaması', 2),
    { type: 'heading', title: 'Kategoriler' },
    strs('categories', 'Kategori listesi', { help: 'Her satıra bir kategori. Yazı formundaki kategori seçenekleri bu listeden gelir.' }),
    { key: 'showFilter', title: 'Kategori filtresini göster', type: 'bool', help: 'Açıkken ve yayındaki yazılarda en az 2 farklı kategori varsa, yazıların üstünde filtre butonları görünür.' },
  ] },
  { key: 'videos', title: 'Videolar', anchor: 'videolar', fields: [
    { type: 'note', title: 'Videolar YouTube kanalından (RSS) her yayında otomatik gelir; GitHub her sabah siteyi yeniden yayınlar. Kanalda video yokken bölüm ve menü linki görünmez. Bölümü açmak için: Düzen > Videolar > Sitede göster.' },
    t('kicker', 'Küçük etiket', { help: 'Boşsa: YouTube' }), t('title', 'Başlık', { help: 'Boşsa: Videolar' }), ta('intro', 'Açıklama', 2),
    { key: 'count', title: 'Gösterilecek video sayısı', type: 'number', help: 'Boşsa 3.' },
    t('allLabel', 'Kanal butonu metni', { help: 'Boşsa: Kanala git' }), t('channelUrl', 'Kanal adresi', { help: 'Boşsa: https://www.youtube.com/@pehlivanai' }),
  ] },
  { key: 'about', title: 'Hakkımda', anchor: 'hakkimda', fields: [
    t('kicker', 'Küçük etiket'), t('title', 'Başlık'),
    strs('paragraphs', 'Paragraflar', { help: 'Her satır ayrı bir paragraftır.' }),
    strs('facts', 'Kısa bilgi etiketleri', { help: 'Her satıra bir etiket. Örnek: 4+ yıl proje yönetimi' }),
    { key: 'illustration', title: 'Çizimi göster', type: 'bool', defaultOn: true },
  ] },
  { key: 'accounts', title: 'Hesaplarım', anchor: 'iletisim', fields: [
    t('kicker', 'Küçük etiket'), ta('title', 'Başlık', 2, { help: 'Satır atlamak için Enter kullan.' }), t('intro', 'Açıklama'),
    list('items', 'Hesaplar', [
      t('name', 'Ad', { help: 'Örnek: LinkedIn' }), t('sub', 'Alt metin', { help: 'Örnek: kullanıcı adı · ne paylaşıyorsun' }),
      t('url', 'Adres', { help: 'https://... veya mailto:...' }), sel('icon', 'Simge', ACCOUNT_ICON_OPTS),
      { key: 'highlight', title: 'Vurgulu göster (ana hesap)', type: 'bool', help: 'Vurgulu hesap, yazı sayfalarındaki "Takip et" butonunda da kullanılır.' },
      { key: 'visible', title: 'Sitede göster', type: 'bool' },
    ], { itemTitle: (x) => x.name, itemSub: (x) => [x.visible === false ? 'Gizli' : '', x.highlight ? 'Vurgulu' : '', x.sub].filter(Boolean).join(' · '), defaults: { name: '', sub: '', url: '', icon: 'link', highlight: false, visible: true }, help: 'Yeni hesap açınca buraya ekle. Sıra, sitedeki sıradır.' }),
    { key: 'illustration', title: 'Çizimi göster', type: 'bool', defaultOn: true },
  ] },
];

export function postSchema(categories = []) {
  return [
    t('title', 'Başlık', { required: true }),
    { key: 'slug', title: 'Adres (slug)', type: 'slug', source: 'title', required: true, help: 'Sadece küçük harf, rakam ve tire. Yayından sonra değiştirme.' },
    t('pageUrl', 'Özel sayfa adresi', { help: 'İsteğe bağlı. Yazının interaktif bir sayfası varsa adresini yaz (örn: /yazi/prompt-brief/). Doluysa yazı kartı oraya gider; /blog/ adresi de oraya yönlenir.' }),
    sel('status', 'Durum', [['draft', 'Taslak'], ['published', 'Yayında']]),
    t('category', 'Kategori', { suggest: categories, help: 'Elle yaz ya da listeden seç. Öneriler: Ana sayfa > Yazılar > Kategori listesi.' }),
    { key: 'publishedAt', title: 'Yayın tarihi', type: 'date' },
    { key: 'readingMinutes', title: 'Okuma süresi (dakika)', type: 'number', help: 'Boş bırakırsan kayıtta otomatik hesaplanır.' },
    ta('excerpt', 'Kısa özet (kartlarda görünür)', 3, { max: 220 }), ta('lede', 'Giriş paragrafı', 4),
    { key: 'body', title: 'Yazı metni', type: 'richtext' },
    { type: 'heading', title: 'Kapak' },
    sel('coverStyle', 'Kapak tipi', [['brief', 'Brief çizimi'], ['kanban', 'Kanban çizimi'], ['redirect', 'Yönlendirme (301) çizimi'], ['chat', 'Sohbet çizimi'], ['chart', 'Grafik çizimi'], ['image', 'Görsel yükle']]),
    { key: 'coverImage', title: 'Kapak görseli', type: 'image', showIf: (v) => v.coverStyle === 'image' },
    { key: 'coverColor', title: 'Kapak arka plan rengi', type: 'color' },
    { key: 'coverHighlight', title: 'Kapak çizim rengi', type: 'color', showIf: (v) => v.coverStyle !== 'image' },
    { type: 'heading', title: 'SEO' },
    ta('seoDescription', 'Meta açıklama', 3, { max: 170, help: 'Boş bırakırsan kısa özet kullanılır.' }),
  ];
}

export const newPost = (category = '') => ({ title: 'Yeni yazı', slug: '', status: 'draft', category, publishedAt: new Date().toISOString().slice(0, 10), readingMinutes: null, excerpt: '', lede: '', body: '<p></p>', coverStyle: 'chat', coverImage: '', coverColor: '#251845', coverHighlight: '#C2AEFF', seoDescription: '' });
