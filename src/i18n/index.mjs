/**
 * i18n — 5 locales, real URLs per language, localised slugs (never translated query strings).
 * English lives at the root; other locales under /es/, /nl/, /pt/, /de/.
 * Switching language keeps the page: /the-apartment -> /es/el-apartamento.
 */
import en from './en.json';
import es from './es.json';
import nl from './nl.json';
import pt from './pt.json';
import de from './de.json';
import pEn from './pages/en.json';
import pEs from './pages/es.json';
import pNl from './pages/nl.json';
import pPt from './pages/pt.json';
import pDe from './pages/de.json';
export const pagesDict = { en: pEn, es: pEs, nl: pNl, pt: pPt, de: pDe };
export const pageContent = (locale, key) => (pagesDict[locale] ?? pagesDict.en)[key] ?? pagesDict.en[key];

export const locales = ['en', 'es', 'nl', 'pt', 'de'];
export const defaultLocale = 'en';
export const localeNames = { en: 'English', es: 'Español', nl: 'Nederlands', pt: 'Português', de: 'Deutsch' };
export const dict = { en, es, nl, pt, de };

/** pageKey -> localized slug ('' = homepage). Add new pages here once, all locales. */
export const routes = {
  home:      { en: '',               es: '',                      nl: '',                      pt: '',                      de: '' },
  apartment: { en: 'the-apartment',  es: 'el-apartamento',        nl: 'het-appartement',       pt: 'o-apartamento',         de: 'das-apartment' },
  building:  { en: 'the-building',   es: 'el-edificio',           nl: 'het-gebouw',            pt: 'o-edificio',            de: 'das-gebaeude' },
  location:  { en: 'location',       es: 'ubicacion',             nl: 'locatie',               pt: 'localizacao',           de: 'lage' },
  reviews:   { en: 'reviews',        es: 'resenas',               nl: 'beoordelingen',         pt: 'avaliacoes',            de: 'bewertungen' },
  faq:       { en: 'faq',            es: 'preguntas-frecuentes',  nl: 'veelgestelde-vragen',   pt: 'perguntas-frequentes',  de: 'haeufige-fragen' },
  book:      { en: 'book',           es: 'reservar',              nl: 'boeken',                pt: 'reservar',              de: 'buchen' },
  confirmed: { en: 'book/confirmed', es: 'reservar/confirmado',   nl: 'boeken/bevestigd',      pt: 'reservar/confirmado',   de: 'buchen/bestaetigt' },
  aruba:     { en: 'aruba',          es: 'aruba',                 nl: 'aruba',                 pt: 'aruba',                 de: 'aruba' },
  work:      { en: 'work-from-aruba', es: 'trabajar-desde-aruba', nl: 'werken-vanuit-aruba',   pt: 'trabalhar-de-aruba',    de: 'arbeiten-auf-aruba' },
  cruise:    { en: 'before-your-cruise', es: 'antes-de-su-crucero', nl: 'voor-je-cruise',      pt: 'antes-do-cruzeiro',     de: 'vor-der-kreuzfahrt' },
  weddings:  { en: 'weddings',       es: 'bodas',                 nl: 'bruiloften',            pt: 'casamentos',            de: 'hochzeiten' },
  carnival:  { en: 'carnival',       es: 'carnaval',              nl: 'carnaval',              pt: 'carnaval',              de: 'karneval' },
  monthly:   { en: 'monthly',        es: 'estadias-largas',       nl: 'lang-verblijf',         pt: 'estadias-longas',       de: 'langzeitaufenthalt' },
  packages:  { en: 'packages',       es: 'paquetes',              nl: 'arrangementen',         pt: 'pacotes',               de: 'pakete' }
};

/** Package copy per locale (falls back to English). */
const pkFiles = import.meta.glob('./packages/*.json', { eager: true, import: 'default' });
export const packageContent = (locale) => pkFiles[`./packages/${locale}.json`] ?? pkFiles['./packages/en.json'];
/** Which package market each language leads with. */
export const marketOrder = { en: ['us', 'br', 'ar'], nl: ['us', 'ar', 'br'], de: ['us', 'br', 'ar'], pt: ['br', 'us', 'ar'], es: ['ar', 'us', 'br'] };

/** English-only at launch (hreflang self only). Wave 2 translates them. */
export const enOnlyRoutes = {
  guide:    'guide',
  about:    'about',
  privacy:  'privacy'
};

/** Occasion pages, in menu order, with their hero image (stock name or prop:file). */
export const occasions = [
  { key: 'weddings', img: 'aruba-beach-wedding-flower-arch' },
  { key: 'carnival', img: 'aruba-carnival-costume-feathers-ocean' },
  { key: 'cruise',   img: 'oranjestad-cruise-ship-palm-trees' },
  { key: 'work',     img: 'remote-work-laptop-pool-terrace' },
  { key: 'monthly',  img: 'oranjestad-shopping-street-palms' },
];

export function urlFor(pageKey, locale = 'en') {
  const slug = routes[pageKey]?.[locale] ?? routes[pageKey]?.en ?? enOnlyRoutes[pageKey] ?? '';
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const path = slug ? `/${slug}` : '';
  return `${prefix}${path}/`.replace(/\/+$/, '/') || '/';
}

export function t(locale) {
  const d = dict[locale] ?? dict.en;
  return (key) => key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), d)
    ?? key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), dict.en)
    ?? key;
}

/** All alternate URLs of a page, for hreflang + the language switcher. */
export function alternatesFor(pageKey) {
  return locales.map((l) => ({ locale: l, name: localeNames[l], url: urlFor(pageKey, l) }));
}

/** Date format per locale — an American reading 03/11 as March 11 when it means 3 November is a cancelled booking. */
export const dateLocaleTag = { en: 'en-US', es: 'es-AR', nl: 'nl-NL', pt: 'pt-BR', de: 'de-DE' };
