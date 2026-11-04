// Stored AI insights, keyed by subscription id, in the browser — same
// defensive pattern as lib/storage.ts. Rule-based insights (lib/insights.ts)
// are computed live and never stored; only model/demo results live here.

import type { Insight } from "./insights";

const STORAGE_KEY = "unhook.insights.v1";
const listeners = new Set<() => void>();

export type InsightMap = Record<string, Insight[]>;

let cachedRaw: string | null = null;
let cachedMap: InsightMap = {};

function isInsight(value: unknown): value is Insight {
  if (!value || typeof value !== "object") return false;
  const insight = value as Record<string, unknown>;
  return (
    typeof insight.id === "string" &&
    typeof insight.subscription_id === "string" &&
    typeof insight.title === "string" &&
    typeof insight.explanation === "string" &&
    (insight.evidence === null || typeof insight.evidence === "string")
  );
}

function parse(raw: string | null): InsightMap {
  if (raw === null) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const map: InsightMap = {};
  for (const [id, value] of Object.entries(data as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const valid = value.filter(isInsight);
      if (valid.length > 0) map[id] = valid;
    }
  }
  return map;
}

function refresh(): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedMap = parse(raw);
  }
}

/** All stored insights, keyed by subscription id. */
export function loadInsights(): InsightMap {
  refresh();
  return cachedMap;
}

/** Replaces the stored insights for one subscription and notifies listeners. */
export function saveInsights(subscriptionId: string, insights: Insight[]): void {
  const next = { ...loadInsights(), [subscriptionId]: insights };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

/** Calls `listener` whenever stored insights change, in this tab or another. */
export function subscribeInsights(listener: () => void): () => void {
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
