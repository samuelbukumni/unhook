// Loading and saving subscriptions. Today this uses the browser's
// localStorage; swapping in a real database later only touches this file.
// On first run (nothing saved yet) it saves the mock data as a starting point.
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

function readRaw(): string {
  let raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    raw = JSON.stringify(buildMockSubscriptions(toISODate(new Date())));
    localStorage.setItem(STORAGE_KEY, raw);
  }
  return raw;
}

function parse(raw: string): Subscription[] {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    // Saved dates can be days old, so refresh next renewal and trial status.
    const today = toISODate(new Date());
    return (data as Subscription[]).map((sub) => withComputedFields(sub, today));
  } catch {
    return [];
  }
}

/** All saved subscriptions. */
export function loadSubscriptions(): Subscription[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parse(raw);
  }
  return cachedList;
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

/** Puts the mock data back (handy for demos). */
export function resetToMockData(): void {
  saveSubscriptions(buildMockSubscriptions(toISODate(new Date())));
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
