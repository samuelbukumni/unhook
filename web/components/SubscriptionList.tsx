"use client";

// Loads the saved subscriptions, sorts them by next renewal, and renders the
// cost summary plus one row per subscription. Data lives in the browser, so
// the server (and the first render) shows a loading line instead.

import { isTrialEndingSoon, sortByNextRenewal } from "@/lib/subscriptions";
import { ButtonLink } from "./ui/Button";
import { EmptyState } from "./ui/EmptyState";
import { useSubscriptions, useToday } from "@/lib/use-subscriptions";
import { ActionRequired } from "./ActionRequired";
import { CostSummary } from "./CostSummary";
import { Loading } from "./Loading";
import { SubscriptionRow } from "./SubscriptionRow";
import { UpcomingRenewals } from "./UpcomingRenewals";

export function SubscriptionList() {
  const subscriptions = useSubscriptions();
  const today = useToday();

  if (!subscriptions || !today) {
    return <Loading label="Loading subscriptions…" />;
  }

  if (subscriptions.length === 0) {
    return (
      <EmptyState
        title="No subscriptions yet"
        action={
          <ButtonLink href="/add" className="text-sm">
            Add a subscription
          </ButtonLink>
        }
      >
        Add your first one — paste a receipt and Unhook reads the details,
        or enter them by hand.
      </EmptyState>
    );
  }

  const sorted = sortByNextRenewal(subscriptions);

  return (
    <div className="flex flex-col gap-6">
      <ActionRequired subscriptions={sorted} today={today} />
      <CostSummary subscriptions={sorted} />
      <UpcomingRenewals subscriptions={sorted} today={today} />
      <ul aria-label="Subscriptions" className="flex flex-col gap-3">
        {sorted.map((sub) => (
          <SubscriptionRow
            key={sub.id}
            subscription={sub}
            endingSoon={isTrialEndingSoon(sub, today)}
            today={today}
          />
        ))}
      </ul>
    </div>
  );
}
