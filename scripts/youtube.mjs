// YouTube kanalının son videolarını herkese açık RSS'ten okur (API anahtarı gerekmez, ücretsiz).
// publish.mjs yayın sırasında çağırır → public/videos.json + Videolar bölümü.
// Kanal: @pehlivanai. Değiştirmek için YT_CHANNEL_ID ortam değişkeni.
export const YT_CHANNEL_ID = process.env.YT_CHANNEL_ID || 'UC6ldSrg9YUeQMuRRigDbMJQ';
const FALLBACK = 'https://ucpehlivan.web.app/videos.json';

const un = (s) => String(s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
const tag = (x, t) => un((x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) || [])[1]);

export function parseFeed(xml) {
  return [...String(xml).matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, x]) => ({
    id: tag(x, 'yt:videoId'),
    title: tag(x, 'title'),
    published: tag(x, 'published'),
    description: tag(x, 'media:description').slice(0, 300),
  })).filter((v) => /^[\w-]{6,}$/.test(v.id) && v.title);
}

// Shorts sitede gösterilmez (sahibinin kararı, 2026-11-26).
// YouTube her kanal için hazır listeler tutar: UU = tüm yüklenenler, UULF = yalnız normal
// videolar, UUSH = yalnız Shorts. Önce UULF okunur. Okunamazsa UU / kanal RSS'i okunur ve
// UUSH listesindeki (veya başlığında #shorts geçen) videolar elenir.
// UU'ya geçiş nedeni (2026-11-24): kanal RSS'i (channel_id) yeni kanalda boş dönebiliyor.
// Hepsi okunamazsa yayındaki videos.json kullanılır (geçici YouTube hatası bölümü boşaltmasın).
const feedUrl = (q) => `https://www.youtube.com/feeds/videos.xml?${q}`;
const list = (prefix) => feedUrl(`playlist_id=${prefix}${YT_CHANNEL_ID.slice(2)}`);
const isShortTitle = (v) => /#shorts?/i.test(`${v.title} ${v.description}`);

async function readFeed(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(String(r.status));
  return parseFeed(await r.text());
}

async function shortIds() {
  try { return new Set((await readFeed(list('UUSH'))).map((v) => v.id)); } catch { return new Set(); }
}

export async function fetchVideos() {
  const feeds = [
    [list('UULF'), 'rss (videolar, Shorts hariç)'],
    [list('UU'), 'rss (yüklenenler, Shorts elendi)'],
    [feedUrl(`channel_id=${YT_CHANNEL_ID}`), 'rss (kanal, Shorts elendi)'],
  ];
  let err = null, okEmpty = false, shorts = null;
  for (const [url, source] of feeds) {
    try {
      let videos = await readFeed(url);
      if (!url.includes('UULF')) {
        shorts ??= await shortIds();
        videos = videos.filter((v) => !shorts.has(v.id));
      }
      videos = videos.filter((v) => !isShortTitle(v));
      if (videos.length) return { videos, source };
      okEmpty = true;
      if (url.includes('UULF')) break; // UULF okundu ve boş: gerçekten normal video yok
    } catch (e) { err = e; }
  }
  if (okEmpty) return { videos: [], source: 'rss (Shorts dışında video yok)' };
  try {
    const r = await fetch(FALLBACK);
    if (r.ok) return { videos: (await r.json()).filter((v) => !isShortTitle(v)), source: `yayındaki videos.json (RSS: ${err.message})` };
  } catch {}
  return { videos: [], source: `yok (RSS: ${err.message})` };
}
