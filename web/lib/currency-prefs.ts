// Saving the user's currency preferences in the browser, mirroring
// lib/storage.ts: defensive parsing, a cache for stable React reads, and
// listeners so every component stays in sync. Browser-only.

import { DEFAULT_CURRENCY_PREFS, type CurrencyPrefs, type ExchangeRate } from "./currency";

const STORAGE_KEY = "unhook.currency.v1";
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedPrefs: CurrencyPrefs = DEFAULT_CURRENCY_PREFS;

function isRate(value: unknown): value is ExchangeRate {
  if (!value || typeof value !== "object") return false;
  const rate = value as Record<string, unknown>;
  return (
    typeof rate.rate === "number" &&
    Number.isFinite(rate.rate) &&
    rate.rate > 0 &&
    typeof rate.updatedAt === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(rate.updatedAt)
  );
}

function parse(raw: string | null): CurrencyPrefs {
  if (raw === null) return DEFAULT_CURRENCY_PREFS;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return DEFAULT_CURRENCY_PREFS;
  }
  if (!data || typeof data !== "object") return DEFAULT_CURRENCY_PREFS;
  const prefs = data as Record<string, unknown>;
  const target =
    typeof prefs.target === "string" && /^[A-Za-z]{3}$/.test(prefs.target)
      ? prefs.target.toUpperCase()
      : DEFAULT_CURRENCY_PREFS.target;
  const rates: Record<string, ExchangeRate> = {};
  if (prefs.rates && typeof prefs.rates === "object") {
    for (const [code, value] of Object.entries(prefs.rates as Record<string, unknown>)) {
      if (/^[A-Za-z]{3}$/.test(code) && isRate(value)) rates[code.toUpperCase()] = value;
    }
  }
  return { target, rates };
}

function refresh(): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedPrefs = parse(raw);
  }
}

/** The saved currency preferences (defaults until the user configures any). */
export function loadCurrencyPrefs(): CurrencyPrefs {
  refresh();
  return cachedPrefs;
}

/** Replaces the saved preferences and notifies listeners. */
export function saveCurrencyPrefs(prefs: CurrencyPrefs): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  listeners.forEach((listener) => listener());
}

/** Calls `listener` whenever the preferences change, in this tab or another. */
export function subscribeCurrency(listener: () => void): () => void {
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) listener();
  }
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
