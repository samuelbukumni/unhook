// React hook for stored AI insights (browser-only values, server-null
// pattern like lib/use-subscriptions.ts).

import { useSyncExternalStore } from "react";
import { loadInsights, subscribeInsights, type InsightMap } from "./insights-store";

/** Stored insights keyed by subscription id, or null until loaded. */
export function useStoredInsights(): InsightMap | null {
  return useSyncExternalStore(subscribeInsights, loadInsights, () => null);
}
