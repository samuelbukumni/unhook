// React hook for the browser-saved currency preferences, following the same
// server-null pattern as lib/use-subscriptions.ts (no hydration errors).

import { useSyncExternalStore } from "react";
import { loadCurrencyPrefs, subscribeCurrency } from "./currency-prefs";
import type { CurrencyPrefs } from "./currency";

/** Saved currency preferences, or null until the browser has loaded them. */
export function useCurrencyPrefs(): CurrencyPrefs | null {
  return useSyncExternalStore(subscribeCurrency, loadCurrencyPrefs, () => null);
}
