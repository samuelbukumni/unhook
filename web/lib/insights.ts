// AI-insight data model plus deterministic insights derived from the user's
// own saved data (never invented): trial deadlines from saved dates, foreign-
// currency billing from saved currencies, and cancellation requirements only
// when the saved cancel guide's own steps state them (quoted as evidence).
//
// Insights produced by the model arrive via POST /api/insights and are stored
// separately (lib/insights-store.ts); both kinds share this shape.

import { daysBetween } from "./dates";
import type { CancelGuide } from "./cancel-guides";
import type { CurrencyPrefs } from "./currency";
import type { Subscription } from "./types";

export type InsightCategory =
  | "cancellation_difficulty"
  | "trial_conversion"
  | "price_currency"
  | "billing_transparency";

export type InsightSeverity = "info" | "caution" | "high";

/** Where an insight came from. "demo" insights are samples, never detections. */
export type InsightSource = "ai" | "data" | "demo";

export type Insight = {
  id: string;
  subscription_id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  explanation: string;
  /** Verbatim supporting quote (guide step, note, or receipt line), if any. */
  evidence: string | null;
  source: InsightSource;
  /** "YYYY-MM-DD" the insight was produced. */
  created_at: string;
};

const SEVERITY_RANK: Record<InsightSeverity, number> = { high: 3, caution: 2, info: 1 };

/** Highest-severity insight first; ties keep their original order. */
export function sortInsights(insights: Insight[]): Insight[] {
  return [...insights].sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
}

const PHONE_TERMS = ["phone", "call us", "call our", "by phone"];
const NOTICE_TERMS = ["written notice", "advance notice", "days before", "hours before", "notice period"];

/** Evidence-supported cancellation requirements found in a guide's steps. */
function guideWarnings(sub: Subscription, guide: CancelGuide, today: string): Insight[] {
  const found: Insight[] = [];
  for (const step of guide.steps) {
    const lower = step.toLowerCase();
    if (PHONE_TERMS.some((term) => lower.includes(term))) {
      found.push({
        id: `data-cancel-phone-${sub.id}`,
        subscription_id: sub.id,
        category: "cancellation_difficulty",
        severity: "caution",
        title: "Cancellation may require a phone call",
        explanation: `The saved cancellation guide for ${sub.service} mentions cancelling by phone. The guide is unverified, so check the official help page before relying on this.`,
        evidence: step,
        source: "data",
        created_at: today,
      });
    }
    if (NOTICE_TERMS.some((term) => lower.includes(term))) {
      found.push({
        id: `data-cancel-notice-${sub.id}`,
        subscription_id: sub.id,
        category: "cancellation_difficulty",
        severity: "caution",
        title: "Cancellation may need advance notice",
        explanation: `The saved cancellation guide for ${sub.service} mentions a notice requirement. The guide is unverified, so check the official help page before relying on this.`,
        evidence: step,
        source: "data",
        created_at: today,
      });
    }
  }
  return found.slice(0, 2);
}

/**
 * Deterministic insights from saved data alone. Safe to compute on every
 * render: no model calls, no invented requirements.
 */
export function ruleInsights(
  sub: Subscription,
  guide: CancelGuide | undefined,
  prefs: CurrencyPrefs,
  today: string,
): Insight[] {
  if (sub.status === "cancelled") return [];
  const insights: Insight[] = [];

  if (sub.status === "trial" && sub.trial_end_date) {
    const daysLeft = daysBetween(today, sub.trial_end_date);
    if (daysLeft >= 0 && daysLeft <= 3) {
      insights.push({
        id: `data-trial-${sub.id}`,
        subscription_id: sub.id,
        category: "trial_conversion",
        severity: daysLeft <= 1 ? "high" : "caution",
        title: daysLeft === 0 ? "Trial ends today" : `Trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
        explanation: `This trial converts to a paid ${sub.billing_period} subscription. The first charge is scheduled for ${sub.first_charge_date}. Cancel before then if you don't want to pay.`,
        evidence: `Trial ends ${sub.trial_end_date}; first charge ${sub.first_charge_date}.`,
        source: "data",
        created_at: today,
      });
    }
  }

  if (guide) {
    insights.push(...guideWarnings(sub, guide, today));
  } else {
    insights.push({
      id: `data-noguide-${sub.id}`,
      subscription_id: sub.id,
      category: "billing_transparency",
      severity: "info",
      title: "No cancellation guide on file",
      explanation: `Unhook doesn't have cancellation instructions for ${sub.service} yet. Check the account or billing settings on the service's website.`,
      evidence: null,
      source: "data",
      created_at: today,
    });
  }

  if (sub.currency.toUpperCase() !== prefs.target.toUpperCase()) {
    insights.push({
      id: `data-fx-${sub.id}`,
      subscription_id: sub.id,
      category: "price_currency",
      severity: "info",
      title: `Billed in ${sub.currency.toUpperCase()}`,
      explanation: `This subscription bills in ${sub.currency.toUpperCase()} while your display currency is ${prefs.target.toUpperCase()}. Converted amounts are estimates from your configured rate.`,
      evidence: null,
      source: "data",
      created_at: today,
    });
  }

  return insights;
}

/** Explicitly labelled sample insights, used only in development builds. */
export function demoInsights(sub: Subscription, today: string): Insight[] {
  return [
    {
      id: `demo-1-${sub.id}`,
      subscription_id: sub.id,
      category: "cancellation_difficulty",
      severity: "caution",
      title: "Demonstration insight (sample)",
      explanation:
        "This is a labelled sample shown because AI analysis isn't configured. A real analysis would only appear here with supporting evidence.",
      evidence: null,
      source: "demo",
      created_at: today,
    },
  ];
}
