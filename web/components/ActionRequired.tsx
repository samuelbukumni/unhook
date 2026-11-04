"use client";

// Action Required: subscriptions renewing or ending their trial within the
// next three days, most urgent first. Cancelled subscriptions never appear.
// Each item links to its detail page and can open the cancellation guide.

import { useState } from "react";
import { findCancelGuide } from "@/lib/cancel-guides";
import { DEFAULT_CURRENCY_PREFS } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { ruleInsights, sortInsights, type Insight } from "@/lib/insights";
import { formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";
import { urgentEvents, type UrgentEvent, type UrgencyLevel } from "@/lib/urgency";
import { useCurrencyPrefs } from "@/lib/use-currency";
import { useStoredInsights } from "@/lib/use-insights";
import { CancelGuideModal } from "./CancelGuideModal";
import { Button } from "./ui/Button";
import { ButtonLink } from "./ui/Button";

const LEVEL_CHIP: Record<UrgencyLevel, { label: (days: number) => string; className: string }> = {
  critical: {
    label: () => "Due today",
    className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  },
  high: {
    label: () => "Due tomorrow",
    className: "bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
  },
  upcoming: {
    label: (days) => `In ${days} days`,
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
};

const PERIOD_LABEL = { monthly: "/month", yearly: "/year", weekly: "/week" } as const;

function eventText(event: UrgentEvent): string {
  const what = event.kind === "trial_end" ? "Trial ends" : "Renews";
  const when = event.daysLeft === 0 ? "today" : event.daysLeft === 1 ? "tomorrow" : `in ${event.daysLeft} days`;
  return `${what} ${when} — ${formatDate(event.eventDate)}`;
}

export function ActionRequired({
  subscriptions,
  today,
}: {
  subscriptions: Subscription[];
  today: string;
}) {
  const [guideSub, setGuideSub] = useState<Subscription | null>(null);
  const prefs = useCurrencyPrefs() ?? DEFAULT_CURRENCY_PREFS;
  const stored = useStoredInsights() ?? {};
  const events = urgentEvents(subscriptions, today);

  function topWarning(sub: Subscription): Insight | null {
    const all = sortInsights([
      ...ruleInsights(sub, findCancelGuide(sub.service), prefs, today),
      ...(stored[sub.id] ?? []),
    ]);
    return all.find((insight) => insight.category === "cancellation_difficulty") ?? null;
  }

  return (
    <section
      aria-labelledby="action-required-heading"
      className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30"
    >
      <h2
        id="action-required-heading"
        className="text-sm font-semibold tracking-wide text-amber-900 uppercase dark:text-amber-100"
      >
        Action required
      </h2>
      {events.length === 0 ? (
        <p className="mt-1 text-sm text-amber-900 dark:text-amber-100">
          You&apos;re all caught up. Nothing renews or ends its trial in the next three days.
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-amber-900 dark:text-amber-100">
            Subscriptions and trials that need your attention soon.
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {events.map((event) => {
              const sub = event.subscription;
              const chip = LEVEL_CHIP[event.level];
              return (
                <li
                  key={`${sub.id}-${event.kind}`}
                  className="flex flex-col gap-2 rounded-lg bg-white p-3 dark:bg-navy-900"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-navy-900 dark:text-navy-50">{sub.service}</span>
                    <span className="text-sm text-navy-600 dark:text-navy-100">{sub.plan}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${chip.className}`}>
                      {chip.label(event.daysLeft)}
                    </span>
                  </div>
                  <p className="text-sm text-navy-600 dark:text-navy-100">
                    {eventText(event)} · {formatMoney(sub.price, sub.currency)}
                    {PERIOD_LABEL[sub.billing_period]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href={`/subscriptions/${sub.id}`} variant="secondary" className="min-h-9 px-3 py-1.5 text-sm">
                      View Details
                    </ButtonLink>
                    <Button className="min-h-9 px-3 py-1.5 text-sm" onClick={() => setGuideSub(sub)}>
                      Cancellation Guide
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {guideSub && (
        <CancelGuideModal
          subscription={guideSub}
          warning={topWarning(guideSub)}
          onClose={() => setGuideSub(null)}
        />
      )}
    </section>
  );
}
