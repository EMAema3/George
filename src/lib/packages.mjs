import data from '../data/packages.json';

export const packages = data.packages;

const inSeason = (md, f, t) => (f <= t ? md >= f && md <= t : md >= f || md <= t);
const iso = (d) => d.toISOString().slice(0, 10);

/** All-in total for the base number of guests (accommodation + cleaning + levies + package extras). */
export function packageTotal(pkg, property, checkinOverride) {
  const pr = property.pricing;
  let start, end;
  if (pkg.flexible) {
    // "from" price: minimum nights at the base (low-season) rate
    const nights = pkg.minNights;
    const acc = nights * pr.baseNightly;
    const levy = Math.round((acc + pr.cleaningFee) * pr.touristLevyPct) / 100;
    return acc + pr.cleaningFee + levy + nights * pr.environmentalLevyPerNight + pkg.extrasPrice;
  }
  start = new Date(`${checkinOverride ?? pkg.checkin}T00:00:00Z`);
  end = new Date(`${pkg.checkout}T00:00:00Z`);
  const nights = Math.round((end - start) / 86400000);
  let acc = 0;
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    const md = iso(d).slice(5);
    let r = pr.baseNightly;
    for (const s of pr.seasons || []) if (inSeason(md, s.from, s.to)) r = s.nightly;
    acc += r;
  }
  const levy = Math.round((acc + pr.cleaningFee) * pr.touristLevyPct) / 100;
  return acc + pr.cleaningFee + levy + nights * pr.environmentalLevyPerNight + pkg.extrasPrice;
}

/** Packages still bookable (book-by date not passed), sorted by date, for a market order. */
export function packagesFor(order, now = new Date()) {
  const today = new Date(now); today.setUTCHours(0, 0, 0, 0);
  const open = packages.filter((p) => !p.bookBy || new Date(`${p.bookBy}T00:00:00Z`) >= today);
  return order.flatMap((m) => open.filter((p) => p.market === m).sort((a, b) => (a.checkin ?? '9999').localeCompare(b.checkin ?? '9999')));
}
