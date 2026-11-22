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

// RSS okunamazsa yayındaki videos.json kullanılır (geçici YouTube hatası bölümü boşaltmasın).
export async function fetchVideos() {
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`);
    if (!r.ok) throw new Error(String(r.status));
    return { videos: parseFeed(await r.text()), source: 'rss' };
  } catch (err) {
    try {
      const r = await fetch(FALLBACK);
      if (r.ok) return { videos: await r.json(), source: `yayındaki videos.json (RSS: ${err.message})` };
    } catch {}
    return { videos: [], source: `yok (RSS: ${err.message})` };
  }
}
