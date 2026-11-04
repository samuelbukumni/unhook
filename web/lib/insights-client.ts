// Client helper for POST /api/insights. Sends only the fields the analysis
// needs (plus the saved guide's steps as evidence) and normalizes the result
// into stored Insight records. Throws an Error with a readable message.

import { toISODate } from "./dates";
import type { CancelGuide } from "./cancel-guides";
import type { Insight } from "./insights";
import type { Subscription } from "./types";

/** Runs one AI analysis for a subscription. User-triggered, never automatic. */
export async function analyzeSubscription(
  sub: Subscription,
  guide: CancelGuide | undefined,
): Promise<Insight[]> {
  let response: Response;
  try {
    response = await fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: sub.service,
        plan: sub.plan || null,
        price: sub.price,
        currency: sub.currency,
        billing_period: sub.billing_period,
        trial_end_date: sub.trial_end_date,
        first_charge_date: sub.first_charge_date,
        status: sub.status,
        notes: sub.notes,
        guide_steps: guide?.steps ?? null,
        guide_verified: guide?.verified ?? false,
      }),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : `Analysis failed (HTTP ${response.status}).`;
    throw new Error(message);
  }
  if (!data || typeof data !== "object" || !Array.isArray((data as { insights?: unknown }).insights)) {
    throw new Error("The analysis came back in an unexpected shape.");
  }

  const today = toISODate(new Date());
  return (data as { insights: Omit<Insight, "id" | "subscription_id" | "source" | "created_at">[] }).insights.map(
    (insight, index) => ({
      ...insight,
      id: `ai-${sub.id}-${today}-${index}`,
      subscription_id: sub.id,
      source: "ai" as const,
      created_at: today,
    }),
  );
}
