// Static availability endpoint — built from src/data/availability/*.json.
// The booking widget fetches this; the Stripe function imports the same source files,
// so there is a single source of truth. Nothing erodes trust faster than a date
// that was not really free.
import { activeProperties } from '../data/properties/index.mjs';
import cp204 from '../data/availability/casa-playa-204.json';

const byProperty = { 'casa-playa-204': cp204.blocked };

export function GET() {
  const out = {};
  for (const p of activeProperties) out[p.slug] = byProperty[p.slug] ?? [];
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
}
