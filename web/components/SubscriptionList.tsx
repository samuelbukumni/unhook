// Loads the subscriptions, sorts them by next renewal, and renders the cost
// summary plus one row per subscription. It is async (it waits on today's
// date), so the page wraps it in <Suspense>.

import { getSubscriptions, getToday } from "@/lib/data";
import { isTrialEndingSoon, sortByNextRenewal } from "@/lib/subscriptions";
import { CostSummary } from "./CostSummary";
import { SubscriptionRow } from "./SubscriptionRow";

export async function SubscriptionList() {
  const [subscriptions, today] = await Promise.all([getSubscriptions(), getToday()]);
  const sorted = sortByNextRenewal(subscriptions);

  return (
    <div className="flex flex-col gap-6">
      <CostSummary subscriptions={sorted} />
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
