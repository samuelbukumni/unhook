"use client";

// Loads the saved subscriptions, sorts them by next renewal, and renders the
// cost summary plus one row per subscription. Data lives in the browser, so
// the server (and the first render) shows a loading line instead.

import { isTrialEndingSoon, sortByNextRenewal } from "@/lib/subscriptions";
import { useSubscriptions, useToday } from "@/lib/use-subscriptions";
import { CostSummary } from "./CostSummary";
import { SubscriptionRow } from "./SubscriptionRow";

export function SubscriptionList() {
  const subscriptions = useSubscriptions();
  const today = useToday();

  if (!subscriptions || !today) {
    return <p className="text-zinc-500">Loading subscriptions…</p>;
  }

  const sorted = sortByNextRenewal(subscriptions);

  return (
    <div className="flex flex-col gap-6">
      <CostSummary subscriptions={sorted} />
      {sorted.length === 0 && <p className="text-zinc-500">No subscriptions yet.</p>}
      <ul className="flex flex-col gap-3">
        {sorted.map((sub) => (
          <SubscriptionRow
            key={sub.id}
            subscription={sub}
            endingSoon={isTrialEndingSoon(sub, today)}
          />
        ))}
      </ul>
    </div>
  );
}
