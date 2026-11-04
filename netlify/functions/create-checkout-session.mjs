/**
 * Creates a Stripe Checkout session for a stay.
 * The price is recomputed HERE, server-side, from the property JSON —
 * the client's numbers are never trusted. Levies are itemised as separate
 * line items so the guest sees them before paying (Aruba disclosure rule).
 *
 * Required env var: STRIPE_SECRET_KEY  (sk_test_... first, then sk_live_...)
 */
import Stripe from 'stripe';
import casaPlaya204 from '../../src/data/properties/casa-playa-204.json';
import availability204 from '../../src/data/availability/casa-playa-204.json';
import en from '../../src/i18n/en.json';
import es from '../../src/i18n/es.json';
import nl from '../../src/i18n/nl.json';
import pt from '../../src/i18n/pt.json';
import de from '../../src/i18n/de.json';
const DICT = { en, es, nl, pt, de };
import packagesData from '../../src/data/packages.json';
import pkEn from '../../src/i18n/packages/en.json';
import pkEs from '../../src/i18n/packages/es.json';
import pkNl from '../../src/i18n/packages/nl.json';
import pkPt from '../../src/i18n/packages/pt.json';
import pkDe from '../../src/i18n/packages/de.json';
const PKDICT = { en: pkEn, es: pkEs, nl: pkNl, pt: pkPt, de: pkDe };
const PACKAGES = Object.fromEntries(packagesData.packages.map((x) => [x.id, x]));

const PROPERTIES = { 'casa-playa-204': casaPlaya204 };
const AVAILABILITY = { 'casa-playa-204': availability204.blocked };

const LOCALE_PATHS = {
  en: { book: '/book', confirmed: '/book/confirmed' },
  es: { book: '/es/reservar', confirmed: '/es/reservar/confirmado' },
  nl: { book: '/nl/boeken', confirmed: '/nl/boeken/bevestigd' },
  pt: { book: '/pt/reservar', confirmed: '/pt/reservar/confirmado' },
  de: { book: '/de/buchen', confirmed: '/de/buchen/bestaetigt' },
};
const STRIPE_LOCALES = { en: 'en', es: 'es', nl: 'nl', pt: 'pt-BR', de: 'de' };

const iso = (d) => d.toISOString().slice(0, 10);
const inSeason = (mmdd, from, to) => (from <= to ? mmdd >= from && mmdd <= to : mmdd >= from || mmdd <= to);

function computeQuote(p, checkin, checkout, guests, addonIds, minNights = p.pricing.minNights, maxGuests = p.specs.maxGuests) {
  const start = new Date(`${checkin}T00:00:00Z`);
  const end = new Date(`${checkout}T00:00:00Z`);
  if (isNaN(start) || isNaN(end)) throw new Error('Invalid dates');
  const nights = Math.round((end - start) / 86400000);
  if (nights < minNights) throw new Error(`Minimum stay is ${minNights} nights`);
  if (nights > 180) throw new Error('Stay too long');
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (start < today) throw new Error('Check-in is in the past');
  if (guests < 1 || guests > maxGuests) throw new Error('Guest count out of range');

  const blocked = new Set(AVAILABILITY[p.slug] ?? []);
  let acc = 0;
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    if (blocked.has(iso(d))) throw new Error('Those dates are no longer available');
    const mmdd = iso(d).slice(5);
    let rate = p.pricing.baseNightly;
    for (const s of p.pricing.seasons || []) if (inSeason(mmdd, s.from, s.to)) rate = s.nightly;
    acc += rate;
  }
  if (nights >= (p.pricing.monthlyMinNights || 9999)) acc = nights * p.pricing.monthlyNightly;

  const cleaning = p.pricing.cleaningFee;
  const levy = Math.round((acc + cleaning) * p.pricing.touristLevyPct) / 100;
  const env = nights * p.pricing.environmentalLevyPerNight;

  const addons = [];
  for (const id of addonIds ?? []) {
    const a = p.addons.find((x) => x.id === id);
    if (!a || a.stage !== 'booking') continue;
    addons.push({ id, amount: a.unit === 'per_person' ? a.price * guests : a.price });
  }
  return { nights, acc, cleaning, levy, env, addons };
}

export const handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST only' }) };
  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 503, headers, body: JSON.stringify({ code: 'not_configured', error: 'Payments are not configured yet. Set STRIPE_SECRET_KEY in Netlify environment variables.' }) };
  }
  try {
    let { property, checkin, checkout, guests = 2, addons = [], locale = 'en', package: pkgId } = JSON.parse(event.body || '{}');
    const p = PROPERTIES[property];
    if (!p) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown property' }) };

    // Packages: server-side rules are the source of truth
    let pkg = null, pkgExtras = 0;
    if (pkgId) {
      pkg = PACKAGES[pkgId];
      if (!pkg || pkg.property !== property) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown package' }) };
      const today = new Date(); today.setUTCHours(0, 0, 0, 0);
      if (pkg.bookBy && today > new Date(`${pkg.bookBy}T00:00:00Z`)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'This package is closed for booking' }) };
      if (!pkg.flexible) { checkin = pkg.checkin; checkout = pkg.checkout; }
      addons = [];
      pkgExtras = pkg.extrasPrice + Math.max(0, Number(guests) - pkg.baseGuests) * pkg.extraGuestPrice;
    }
    const q = computeQuote(p, checkin, checkout, Number(guests), addons, pkg?.minNights ?? p.pricing.minNights, pkg?.maxGuests ?? p.specs.maxGuests);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = process.env.URL || `https://${event.headers.host}`;
    const paths = LOCALE_PATHS[locale] ?? LOCALE_PATHS.en;
    const cur = (p.pricing.currency || 'USD').toLowerCase();
    const cents = (n) => Math.round(n * 100);

    const L = (DICT[locale] ?? DICT.en);
    const S = L.stripe;
    const line_items = [
      { quantity: 1, price_data: { currency: cur, unit_amount: cents(q.acc), product_data: { name: `${p.name} — ${q.nights} ${S.nights} (${checkin} → ${checkout}, ${guests} ${S.guests})`, images: [`${origin}${p.images.dir}/${p.images.hero}-800w.webp`] } } },
      { quantity: 1, price_data: { currency: cur, unit_amount: cents(q.cleaning), product_data: { name: S.cleaning } } },
      { quantity: 1, price_data: { currency: cur, unit_amount: cents(q.levy), product_data: { name: S.levy } } },
      { quantity: 1, price_data: { currency: cur, unit_amount: cents(q.env), product_data: { name: S.env.replace('{n}', String(q.nights)) } } },
      ...q.addons.map((a) => ({ quantity: 1, price_data: { currency: cur, unit_amount: cents(a.amount), product_data: { name: `${S.addon}: ${L.addons?.[a.id]?.name ?? a.id}` } } })),
    ];
    if (pkg) {
      const PK = (PKDICT[locale] ?? PKDICT.en).packages?.[pkg.id] ?? PKDICT.en.packages[pkg.id];
      line_items.push({ quantity: 1, price_data: { currency: cur, unit_amount: cents(pkgExtras), product_data: { name: `${PK.name} — ${PK.includes.join(' · ')}`.slice(0, 250) } } });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: STRIPE_LOCALES[locale] ?? 'auto',
      line_items,
      success_url: `${origin}${paths.confirmed}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${paths.book}/?checkin=${checkin}&checkout=${checkout}&guests=${guests}`,
      metadata: { property, checkin, checkout, guests: String(guests), addons: addons.join(','), package: pkg ? pkg.id : '' },
      payment_intent_data: { description: `${p.name} ${checkin} → ${checkout}` },
      phone_number_collection: { enabled: true },
    });
    return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: err.message || 'Could not start checkout' }) };
  }
};
