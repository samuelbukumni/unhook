// Loading and saving subscriptions. Today this uses the browser's
// localStorage; swapping in a real database later only touches this file.
// On first run (nothing saved yet) it saves the mock data as a starting point.
// Demo controls: loadDemoData() writes the 8 mock subscriptions, and
// clearAllData() saves an empty list (so the mock data doesn't come back).
// Saved data that can't be read (bad JSON, malformed items) is skipped and
// reported through getLoadError() instead of crashing the page.
// Browser-only: call these from Client Components, never during server render.

import { toISODate } from "./dates";
import { buildMockSubscriptions } from "./mock-data";
import { withComputedFields } from "./subscriptions";
import type { Subscription } from "./types";

const STORAGE_KEY = "unhook.subscriptions.v1";
const listeners = new Set<() => void>();

// Cache so repeated reads return the same array (React needs a stable value).
let cachedRaw: string | null = null;
let cachedList: Subscription[] = [];
let cachedError: string | null = null;

const PERIODS = ["weekly", "monthly", "yearly"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Enough of a Subscription to render and compute dates without crashing. */
function isReadable(item: unknown): item is Subscription {
  if (!item || typeof item !== "object") return false;
  const sub = item as Record<string, unknown>;
  return (
    typeof sub.id === "string" &&
    typeof sub.service === "string" &&
    typeof sub.price === "number" &&
    Number.isFinite(sub.price) &&
    typeof sub.currency === "string" &&
    /^[A-Za-z]{3}$/.test(sub.currency) &&
    PERIODS.includes(sub.billing_period as string) &&
    typeof sub.first_charge_date === "string" &&
    DATE.test(sub.first_charge_date) &&
    (sub.trial_end_date === null || (typeof sub.trial_end_date === "string" && DATE.test(sub.trial_end_date)))
  );
}

function readRaw(): string {
  let raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    raw = JSON.stringify(buildMockSubscriptions(toISODate(new Date())));
    localStorage.setItem(STORAGE_KEY, raw);
  }
  return raw;
}

function parse(raw: string): { list: Subscription[]; error: string | null } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { list: [], error: "Your saved data couldn't be read." };
  }
  if (!Array.isArray(data)) return { list: [], error: "Your saved data couldn't be read." };

  const readable = data.filter(isReadable);
  const skipped = data.length - readable.length;
  // Saved dates can be days old, so refresh next renewal and trial status.
  const today = toISODate(new Date());
  return {
    list: readable.map((sub) => withComputedFields(sub, today)),
    error: skipped > 0 ? `${skipped} saved item${skipped === 1 ? "" : "s"} couldn't be read.` : null,
  };
}

function refresh(): void {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    ({ list: cachedList, error: cachedError } = parse(raw));
  }
}

/** All saved subscriptions that could be read. */
export function loadSubscriptions(): Subscription[] {
  refresh();
  return cachedList;
}

/** A message when some or all saved data couldn't be read, else null. */
export function getLoadError(): string | null {
  refresh();
  return cachedError;
}

/** Replaces the whole saved list and notifies listeners. */
export function saveSubscriptions(subs: Subscription[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  listeners.forEach((listener) => listener());
}

/** Adds a subscription, or replaces the one with the same id. */
export function saveSubscription(sub: Subscription): void {
  const others = loadSubscriptions().filter((s) => s.id !== sub.id);
  saveSubscriptions([...others, sub]);
}

/** Replaces everything with the 8 mock subscriptions (handy for demos). */
export function loadDemoData(): void {
  saveSubscriptions(buildMockSubscriptions(toISODate(new Date())));
}

/** Deletes every saved subscription, leaving an empty list. */
export function clearAllData(): void {
  saveSubscriptions([]);
}

/** Calls `listener` whenever the data changes, in this tab or another one. */
export function subscribe(listener: () => void): () => void {
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
