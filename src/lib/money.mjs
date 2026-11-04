/** Prices are always US dollars, in every language, with one unambiguous format. */
export function money(n, locale = 'en', decimals = true) {
  const s = Number(n).toLocaleString('en-US', decimals ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 });
  return (locale === 'en' ? '$' : 'US$') + s;
}
export function moneyWhole(n, locale = 'en') {
  return money(n, locale, false);
}
