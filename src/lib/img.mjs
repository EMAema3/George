import { stock, stockSrc, stockSrcset, stockAlt } from '../data/stock.mjs';
import { flagship } from '../data/properties/index.mjs';

/**
 * Resolve an image reference used in content files:
 *   "prop:<file>"  → a photo of the property (public/images/<slug>/)
 *   "<stock-name>" → a stock photo (public/images/stock/)
 * Returns { src, srcset, alt, w, h }.
 */
export function img(ref, locale = 'en', size = 1200, property = flagship) {
  if (ref?.startsWith('prop:')) {
    const file = ref.slice(5);
    const g = property.images.gallery.find((x) => x.file === file);
    const dir = property.images.dir;
    return {
      src: `${dir}/${file}${size <= 480 ? '-480w' : size <= 800 ? '-800w' : ''}.webp`,
      srcset: `${dir}/${file}-480w.webp 480w, ${dir}/${file}-800w.webp 800w, ${dir}/${file}.webp 1024w`,
      alt: g ? (g.alt[locale] ?? g.alt.en) : '',
      w: 1024, h: 683,
    };
  }
  if (stock[ref]) {
    return { src: stockSrc(ref, size >= 1800 ? 1800 : size >= 1200 ? 1200 : 600), srcset: stockSrcset(ref), alt: stockAlt(ref, locale), w: 1800, h: 1200 };
  }
  return { src: '', srcset: '', alt: '', w: 1, h: 1 };
}
