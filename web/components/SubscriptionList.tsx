"use client";

// Loads the saved subscriptions, sorts them by next renewal, and renders the
// cost summary plus one row per subscription. Data lives in the browser, so
// the server (and the first render) shows a loading line instead.

import Link from "next/link";
import { isTrialEndingSoon, sortByNextRenewal } from "@/lib/subscriptions";
import { emptyStateClass } from "@/lib/ui";
import { useSubscriptions, useToday } from "@/lib/use-subscriptions";
import { CostSummary } from "./CostSummary";
import { Loading } from "./Loading";
import { SubscriptionRow } from "./SubscriptionRow";

export function SubscriptionList() {
  const subscriptions = useSubscriptions();
  const today = useToday();

  if (!subscriptions || !today) {
    return <Loading label="Loading subscriptions…" />;
  }

  if (subscriptions.length === 0) {
    return (
      <div className={emptyStateClass}>
        <p className="font-medium text-zinc-900 dark:text-zinc-100">No subscriptions yet</p>
        <p className="text-sm">
          <Link href="/add" className="underline">Add one from a receipt</Link>, or use{" "}
          <strong>Load demo data</strong> at the bottom of the page to try Unhook with examples.
        </p>
      </div>
    );
  }

  const sorted = sortByNextRenewal(subscriptions);

  return (
    <div className="flex flex-col gap-6">
      <CostSummary subscriptions={sorted} />
      <ul aria-label="Subscriptions" className="flex flex-col gap-3">
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
