# Architecture — Casa Playa / Aruba residences platform

A static, multi-language, multi-property vacation-rental platform.
**Launches with one property (Casa Playa 204) and scales to six without restructuring.**

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 4 (static output) | Server-rendered HTML — every word readable by Google and AI assistants, zero JS by default, fast LCP |
| Hosting | Netlify (project **aruba**) | CDN, forms, serverless functions, env vars |
| Payments | Stripe Checkout via Netlify Function | Card data never touches our code; totals recomputed server-side |
| Lead capture | Netlify Forms (`itinerary-lead`, `abandoned-quote`) | Zero-backend email capture; wire to Klaviyo in Wave 2 |
| Images | Pre-processed WebP, SEO filenames, responsive sizes | `scripts/process-images.py` |

## The scaling model: data-driven properties

Everything about a property lives in **one JSON file**:

```
src/data/properties/<slug>.json    ← pricing, seasons, images+alt (5 langs), add-ons,
                                      reviews, distances, geo, policies
src/data/properties/index.mjs      ← THE REGISTRY: import the JSON, add to the list
src/data/availability/<slug>.json  ← blocked dates (manual now, OwnerRez iCal later)
public/images/<slug>/*.webp        ← that property's photos
```

**To add property #2 … #6:**
1. Copy `casa-playa-204.json`, edit the fields, set `"active": true`.
2. Run `scripts/process-images.py` (edit the MAP) to brighten/warm/rename its photos.
3. Add one line to `index.mjs` and an entry in `netlify/functions/create-checkout-session.mjs` (`PROPERTIES` + `AVAILABILITY`).

Exactly one property carries `"flagship": true` → it owns the root URLs (`/`, `/the-apartment`, `/book`).
When property #2 goes live, add `/stay/<slug>/` pages by reusing the page views in
`src/pageviews/` with a `property` prop — the components already take the property as data,
none of them hard-code Casa Playa.

## i18n — 5 languages, real URLs, localized slugs

- `src/i18n/index.mjs` — locale list, **route map** (`/the-apartment` ⇄ `/es/el-apartamento` ⇄ `/nl/het-appartement` …), `t()` lookup, hreflang helper.
- `src/i18n/{en,es,nl,pt,de}.json` — full dictionaries (UI, pages, FAQ, SEO titles/descriptions, add-ons).
- `src/pages/**` — 40 thin wrappers (3 lines each) mapping localized URLs onto 8 shared page views in `src/pageviews/`.
- Switcher keeps the page (`/location` → `/es/ubicacion`). Detect-and-offer bar, never auto-redirect; choice remembered in localStorage.
- hreflang + x-default emitted in every `<head>`; dates formatted per locale (03/11 ambiguity solved).
- English-only Wave-2 pages (`/work-from-aruba`, `/carnival`, `/guide/*` …) self-reference until translated.

## Booking: two clicks from any page

1. **Click 1** — tap a date range in the calendar (BookingWidget, present on every page + sticky mobile bar).
2. **Click 2** — "Book now" → `/book?checkin=…&checkout=…` with full itemised total (12.5% tourist levy, $3/night environmental levy), max 2 inline add-ons → "Continue to secure payment" → **Stripe Checkout**.

- `netlify/functions/create-checkout-session.mjs` **recomputes the price server-side** from the property JSON (client numbers never trusted), validates availability, itemises levies as Stripe line items, localizes Stripe's UI.
- `/availability.json` is a static endpoint built from the same source data — the calendar and the payment function cannot disagree.
- Abandoned-quote capture: email field appears with the quote, posts to Netlify Forms with dates + total.

## SEO / AI-assistant layer

- `VacationRental` + `LodgingBusiness` + `BreadcrumbList` JSON-LD on stay pages; `FAQPage` on FAQ and guide articles; `Article` on guides (`src/lib/schema.mjs`).
- Unique title/description per page per language (in the dictionaries).
- Sitemap (`@astrojs/sitemap`) with all 53 URLs; `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
- All facts as complete sentences with numbers, server-rendered (assistants cite sentences).

## Design system — from the building itself

`src/styles/global.css`: tile green `#1d6a50`, cream `#faf6ee`, terracotta `#c2492f`,
Caribbean blue `#1879a8`. The arch (999px top radii) shapes images, cards, buttons.
Section dividers and the 404 are the **pinwheel tile pattern** as inline SVG; the loading
spinner is one tile rotating. Fraunces (display) + Inter (body).

## Deliberately not built (per spec)

Guest accounts, scarcity counters, auto-playing carousels, pop-ups before the rate,
chat widgets that open themselves, an app.
