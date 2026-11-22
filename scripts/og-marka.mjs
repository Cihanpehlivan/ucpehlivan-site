// Paylaşım görseli (og.png) için marka değerleri. Kaynak: docs/Pehlivan-AI-Marka-Kimligi.md + public/assets/brand/pehlivan-tokens.css.
// Fontlar yerel woff2'den (public/assets/fonts) file:// ile yüklenir; Google Fonts'a gidilmez.
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const RENK = { kraft: '#E9DCC3', kagit: '#F8F2E6', murekkep: '#1B2340', silik: '#4A4F66', tukenmez: '#2747B0' };

export function ogFontCss(pub) {
  const u = (f) => pathToFileURL(join(pub, 'assets', 'fonts', f)).href;
  return ['schibsted-grotesk-latin.woff2', 'schibsted-grotesk-latin-ext.woff2'].map((f) => `@font-face{font-family:"Schibsted Grotesk";font-weight:400 800;src:url("${u(f)}") format("woff2")}`).join('')
    + ['ibm-plex-mono-500-latin.woff2', 'ibm-plex-mono-500-latin-ext.woff2'].map((f) => `@font-face{font-family:"IBM Plex Mono";font-weight:500;src:url("${u(f)}") format("woff2")}`).join('');
}
