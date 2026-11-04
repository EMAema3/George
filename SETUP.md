# Setup — what you need to do (in order)

## 1. GitHub (one-time, 2 minutes)

The repo is `EMAema3/George`. To let Claude push code to it, install the **Claude GitHub App**:
- Go to https://github.com/apps/claude/installations/select_target → choose your account → grant access to the `George` repo.
- Or reconnect GitHub at https://claude.ai/customize/connectors (Settings → Connectors → GitHub).

Then connect the repo to Netlify (step 3) so every push auto-deploys.

## 2. Stripe (required before the first real booking)

1. Create/open your Stripe account → Developers → API keys.
2. In Netlify → the **aruba** project → Site configuration → Environment variables, add:
   - `STRIPE_SECRET_KEY` = `sk_test_…` (test mode first)
3. Make a test booking end-to-end with card `4242 4242 4242 4242`.
4. When happy, replace with `sk_live_…` and process **one real booking** on a phone, on 4G.

The checkout function never needs your publishable key — it uses Stripe-hosted Checkout.

## 3. Netlify

The site deploys from this repo. Recommended: connect the repo for CI
(Netlify → aruba project → Site configuration → Build & deploy → Link repository → `EMAema3/George`).
Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).

Netlify Forms captures two lead streams automatically — check **Forms** in the dashboard:
- `itinerary-lead` — the "Three days in Oranjestad" email capture
- `abandoned-quote` — people who picked dates but didn't pay (your hottest leads: email them within 24h)
Set a notification email: Forms → Settings → Form notifications.

## 4. Things to update in the data files (no code knowledge needed)

| What | Where |
|---|---|
| Nightly rates, seasons, cleaning fee, min nights | `src/data/properties/casa-playa-204.json` → `pricing` |
| Blocked/booked dates | `src/data/availability/casa-playa-204.json` → add `"2027-01-10"` style strings |
| WhatsApp number (currently a placeholder!) | `src/data/site.json` → `whatsapp` / `whatsappDisplay` |
| Contact email | `src/data/site.json` → `email` |
| Aruba registration number (when you get it) | `src/data/site.json` → appears in the footer automatically |
| Real guest reviews | `src/data/properties/casa-playa-204.json` → `reviews` (the 3 in there now are **placeholders — replace before launch**) |
| Exact geo coordinates | same file → `geo` (currently centred on L.G. Smith Blvd 94 area) |

## 5. Stock photos (weddings, carnival, cruise, Aruba, add-ons)

36 licensed Unsplash photos are listed in `src/data/stock.mjs` with SEO filenames and alt text in 5 languages.
Netlify downloads them **at build time** (brightened and warmed) into `/images/stock/`. If a download ever
fails, `public/_redirects` serves the same URL from Unsplash, so nothing breaks.
To swap a photo: replace its `id` in `stock.mjs` (the `photo-…` part of an images.unsplash.com URL).

## 6. Custom domain

When you buy casaplaya204.com (or similar): Netlify → Domain management → add domain.
Then update `SITE_URL` fallback in `astro.config.mjs` and the `Sitemap:` line in `public/robots.txt`.

## 7. Launch checklist (from the spec)

- [ ] Replace placeholder reviews with real ones (first name + month)
- [ ] Real WhatsApp number in `site.json`
- [ ] Stripe live key + one real test booking on a phone on 4G
- [ ] GA4 + Search Console: add IDs to `src/data/site.json` and the snippet to `Base.astro`
- [ ] Submit `sitemap-index.xml` in Search Console
- [ ] Claim Google Business Profile; identical name/address/phone everywhere
- [ ] Klaviyo: welcome + abandoned-quote flows fed by the two Netlify forms
- [ ] OwnerRez: sync its iCal into `availability/casa-playa-204.json` (Wave 2: automate via a scheduled function)
- [ ] Lighthouse mobile ≥ 90 on performance and accessibility
- [ ] Three strangers book a fake stay; watch where they hesitate

## Adding properties 2–6

See `ARCHITECTURE.md` → "The scaling model". It's one JSON file, one image folder, one registry line.
