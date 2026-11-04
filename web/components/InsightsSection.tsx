"use client";

// Insights for one subscription on its detail page: deterministic insights
// from saved data (computed live), stored AI results, and — in development
// only, when the model isn't configured — explicitly labelled demo samples.
// Analysis runs only when the user asks; results are stored per subscription.

import { useState } from "react";
import { findCancelGuide } from "@/lib/cancel-guides";
import { DEFAULT_CURRENCY_PREFS } from "@/lib/currency";
import {
  demoInsights,
  ruleInsights,
  sortInsights,
  type Insight,
  type InsightSeverity,
} from "@/lib/insights";
import { analyzeSubscription } from "@/lib/insights-client";
import { saveInsights } from "@/lib/insights-store";
import type { Subscription } from "@/lib/types";
import { useCurrencyPrefs } from "@/lib/use-currency";
import { useStoredInsights } from "@/lib/use-insights";
import { useToday } from "@/lib/use-subscriptions";
import { h2Class, mutedClass } from "@/lib/ui";
import { Button } from "./ui/Button";

const SEVERITY_STYLE: Record<InsightSeverity, { chip: string; box: string; label: string }> = {
  high: {
    chip: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    box: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
    label: "High",
  },
  caution: {
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    box: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
    label: "Caution",
  },
  info: {
    chip: "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-100",
    box: "border-line bg-white dark:border-navy-800 dark:bg-navy-900",
    label: "Info",
  },
};

const SOURCE_LABEL = { ai: "AI analysis", data: "From your data", demo: "Demonstration" } as const;

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string; canDemo: boolean };

export function InsightsSection({ subscription: sub }: { subscription: Subscription }) {
  const today = useToday();
  const prefs = useCurrencyPrefs() ?? DEFAULT_CURRENCY_PREFS;
  const storedMap = useStoredInsights() ?? {};
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  if (!today) return null;

  const guide = findCancelGuide(sub.service);
  const insights = sortInsights([
    ...ruleInsights(sub, guide, prefs, today),
    ...(storedMap[sub.id] ?? []),
  ]);

  async function handleAnalyze() {
    setStatus({ kind: "loading" });
    try {
      const results = await analyzeSubscription(sub, guide);
      saveInsights(sub.id, results);
      setStatus({ kind: "idle" });
    } catch (error) {
      const message = (error as Error).message;
      setStatus({
        kind: "error",
        message,
        canDemo: process.env.NODE_ENV === "development" && message.includes("MODEL_API_KEY"),
      });
    }
  }

  function handleDemo() {
    saveInsights(sub.id, demoInsights(sub, today!));
    setStatus({ kind: "idle" });
  }

  return (
    <section aria-labelledby="insights-heading" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="insights-heading" className={h2Class}>
          Insights
        </h2>
        <Button
          variant="secondary"
          className="min-h-9 px-3 py-1.5 text-sm"
          onClick={handleAnalyze}
          disabled={status.kind === "loading"}
          aria-busy={status.kind === "loading"}
        >
          {status.kind === "loading" ? "Analyzing…" : storedMap[sub.id] ? "Re-analyze with AI" : "Analyze with AI"}
        </Button>
      </div>

      {status.kind === "error" && (
        <div className="flex flex-col gap-2">
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            {status.message}
          </p>
          {status.canDemo && (
            <Button variant="secondary" className="self-start text-sm" onClick={handleDemo}>
              Add labelled demonstration insights (development only)
            </Button>
          )}
        </div>
      )}

      {insights.length === 0 ? (
        <p className={`text-sm ${mutedClass}`}>
          No insights right now. Analyze with AI to check for cancellation traps and billing risks.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </ul>
      )}
    </section>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const style = SEVERITY_STYLE[insight.severity];
  return (
    <li className={`rounded-xl border p-3 ${style.box}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.chip}`}>{style.label}</span>
        <span className="text-xs font-medium tracking-wide text-navy-600 uppercase dark:text-navy-100">
          {SOURCE_LABEL[insight.source]}
        </span>
      </div>
      <p className="mt-1 font-medium text-navy-900 dark:text-navy-50">{insight.title}</p>
      <p className="text-sm text-navy-800 dark:text-navy-100">{insight.explanation}</p>
      {insight.evidence && (
        <blockquote className="mt-1 border-l-2 border-navy-200 pl-3 text-sm text-navy-600 italic dark:border-navy-700 dark:text-navy-100">
          “{insight.evidence}”
        </blockquote>
      )}
    </li>
  );
}
