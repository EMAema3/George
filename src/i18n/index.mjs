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
  confirmed: { en: 'book/confirmed', es: 'reservar/confirmado',   nl: 'boeken/bevestigd',      pt: 'reservar/confirmado',   de: 'buchen/bestaetigt' }
};

/** English-only at launch (hreflang self only). Wave 2 translates them. */
export const enOnlyRoutes = {
  work:     'work-from-aruba',
  cruise:   'before-your-cruise',
  weddings: 'weddings',
  carnival: 'carnival',
  monthly:  'monthly',
  guide:    'guide',
  about:    'about',
  privacy:  'privacy'
};

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
