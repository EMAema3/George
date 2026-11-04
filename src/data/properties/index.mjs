/**
 * PROPERTY REGISTRY — the single place where properties are added.
 *
 * To add a property (up to 6 and beyond):
 *   1. Create src/data/properties/<slug>.json  (copy casa-playa-204.json as the template)
 *   2. Add its images to public/images/<slug>/  (SEO-named WebP, use scripts/process-images.py)
 *   3. Import and add it to the list below, set `active: true` in its JSON
 *
 * Everything else — /stay/<slug> pages in all 5 languages, gallery, booking,
 * Stripe pricing, schema.org markup, the sitemap — is generated from this list.
 *
 * `flagship: true` on exactly one property maps it to the root URLs
 * (/, /the-apartment, /book …) as the site's primary stay. When property #2
 * goes live, the homepage automatically shows the portfolio section.
 */
import casaPlaya204 from './casa-playa-204.json';

export const properties = [casaPlaya204];

export const activeProperties = properties.filter((p) => p.active);
export const flagship = activeProperties.find((p) => p.flagship) ?? activeProperties[0];
export const getProperty = (slug) => activeProperties.find((p) => p.slug === slug);
