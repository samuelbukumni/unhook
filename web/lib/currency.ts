// User-configured currency conversion. Rates are estimates the user enters
// by hand; nothing here fetches live market data, and converted amounts are
// always labelled as estimates. Original amounts are never overwritten.
//
// No runtime imports, so Node can run this file directly for tests.

export type ExchangeRate = {
  /** Units of target currency per 1 unit of source currency. */
  rate: number;
  /** "YYYY-MM-DD" the rate was last saved. */
  updatedAt: string;
};

export type CurrencyPrefs = {
  /** Preferred display (target) currency, e.g. "NGN". */
  target: string;
  /** Configured rates keyed by source currency code. */
  rates: Record<string, ExchangeRate>;
};

export const DEFAULT_CURRENCY_PREFS: CurrencyPrefs = { target: "NGN", rates: {} };

export type Conversion = {
  amount: number;
  rate: number;
  updatedAt: string;
  from: string;
  to: string;
};

/**
 * Converts `amount` from `from` into the preferred target currency using the
 * user's configured rate. Returns null when no conversion applies (same
 * currency) or no rate is configured. Rounds to whole minor units (cents).
 */
export function convert(amount: number, from: string, prefs: CurrencyPrefs): Conversion | null {
  const source = from.toUpperCase();
  const target = prefs.target.toUpperCase();
  if (source === target) return null;
  const entry = prefs.rates[source];
  if (!entry || !Number.isFinite(entry.rate) || entry.rate <= 0) return null;
  return {
    amount: Math.round(amount * entry.rate * 100) / 100,
    rate: entry.rate,
    updatedAt: entry.updatedAt,
    from: source,
    to: target,
  };
}

/** True when a usable rate exists for converting out of `from`. */
export function hasRate(from: string, prefs: CurrencyPrefs): boolean {
  return convert(1, from, prefs) !== null;
}

/** "1,500" or "1,512.75" — a configured rate without currency symbols. */
export function formatRate(rate: number): string {
  return rate.toLocaleString("en-US", { maximumFractionDigits: 4 });
}
