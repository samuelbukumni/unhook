"use client";

// Detail view for one subscription: summary line plus the edit form.
// Reads from and saves to browser storage (lib/storage.ts).

import Link from "next/link";
import { useState } from "react";
import { findCancelGuide } from "@/lib/cancel-guides";
import { DEFAULT_CURRENCY_PREFS } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { ruleInsights, sortInsights } from "@/lib/insights";
import { saveSubscription } from "@/lib/storage";
import { formatMoney } from "@/lib/subscriptions";
import { emptyStateClass, h1Class, mutedClass } from "@/lib/ui";
import { useCurrencyPrefs } from "@/lib/use-currency";
import { useStoredInsights } from "@/lib/use-insights";
import { useSubscriptions, useToday } from "@/lib/use-subscriptions";
import { CancelGuideModal } from "./CancelGuideModal";
import { InsightsSection } from "./InsightsSection";
import { Loading } from "./Loading";
import { SubscriptionEditor } from "./SubscriptionEditor";
import { Button } from "./ui/Button";

export function SubscriptionDetail({ id }: { id: string }) {
  const subscriptions = useSubscriptions();
  const today = useToday();
  const prefs = useCurrencyPrefs() ?? DEFAULT_CURRENCY_PREFS;
  const stored = useStoredInsights() ?? {};
  const [guideOpen, setGuideOpen] = useState(false);

  if (!subscriptions || !today) {
    return <Loading label="Loading subscription…" />;
  }

  const sub = subscriptions.find((s) => s.id === id);
  if (!sub) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className={h1Class}>Subscription not found</h1>
        <p className={emptyStateClass}>
          It may have been removed, or it was saved in another browser.{" "}
          <Link href="/" className="underline">See all subscriptions</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className={`${h1Class} break-words`}>
          {sub.service} <span className={mutedClass}>{sub.plan}</span>
        </h1>
        <p className={mutedClass}>
          {formatMoney(sub.price, sub.currency)} {sub.billing_period} ·{" "}
          <span className="capitalize">{sub.status}</span> ·{" "}
          {sub.status === "cancelled" ? "access ends" : "next charge"}{" "}
          {formatDate(sub.next_renewal_date)}
        </p>
        <Button variant="secondary" className="mt-1 min-h-9 self-start px-3 py-1.5 text-sm" onClick={() => setGuideOpen(true)}>
          How to cancel {sub.service}
        </Button>
      </header>
      <SubscriptionEditor subscription={sub} today={today} onSave={saveSubscription} />
      <InsightsSection subscription={sub} />
      {guideOpen && (
        <CancelGuideModal
          subscription={sub}
          warning={
            sortInsights([
              ...ruleInsights(sub, findCancelGuide(sub.service), prefs, today),
              ...(stored[sub.id] ?? []),
            ]).find((insight) => insight.category === "cancellation_difficulty") ?? null
          }
          showViewLink={false}
          onClose={() => setGuideOpen(false)}
        />
      )}
    </div>
  );
}
