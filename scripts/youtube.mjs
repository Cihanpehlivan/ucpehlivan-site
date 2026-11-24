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

// Önce "Yüklenenler" listesinin RSS'i (UU…): kanal RSS'i (channel_id) yeni kanalda/Shorts'ta
// boş dönebiliyor (2026-11-24: kanal RSS'i boş, UU listesi videoyu gösteriyordu).
// İkisi de boşsa boş liste; ikisi de okunamazsa yayındaki videos.json kullanılır
// (geçici YouTube hatası bölümü boşaltmasın).
export async function fetchVideos() {
  const feeds = [
    `https://www.youtube.com/feeds/videos.xml?playlist_id=UU${YT_CHANNEL_ID.slice(2)}`,
    `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
  ];
  let err = null, okEmpty = false;
  for (const url of feeds) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(String(r.status));
      const videos = parseFeed(await r.text());
      if (videos.length) return { videos, source: url.includes('playlist_id') ? 'rss (yüklenenler)' : 'rss (kanal)' };
      okEmpty = true;
    } catch (e) { err = e; }
  }
  if (okEmpty) return { videos: [], source: 'rss (boş)' };
  try {
    const r = await fetch(FALLBACK);
    if (r.ok) return { videos: await r.json(), source: `yayındaki videos.json (RSS: ${err.message})` };
  } catch {}
  return { videos: [], source: `yok (RSS: ${err.message})` };
}
