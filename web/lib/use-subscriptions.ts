// React hooks for reading browser-only values without hydration errors.
// useSyncExternalStore renders the server value (null) on the server and
// during hydration, then switches to the real browser value right after.

import { useSyncExternalStore } from "react";
import { toISODate } from "./dates";
import { getLoadError, loadSubscriptions, subscribe } from "./storage";
import type { Subscription } from "./types";

/** Saved subscriptions, or null until the browser has loaded them. */
export function useSubscriptions(): Subscription[] | null {
  return useSyncExternalStore(subscribe, loadSubscriptions, () => null);
}

/** A message when saved data couldn't be read; null otherwise (and on the server). */
export function useLoadError(): string | null {
  return useSyncExternalStore(subscribe, getLoadError, () => null);
}

const noSubscribe = () => () => {};

/** Today's date ("YYYY-MM-DD") in the user's time zone, or null on the server. */
export function useToday(): string | null {
  return useSyncExternalStore(noSubscribe, () => toISODate(new Date()), () => null);
}
