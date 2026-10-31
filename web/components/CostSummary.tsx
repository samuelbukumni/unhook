// Shows the total monthly and yearly cost of all non-cancelled subscriptions,
// one pair of cards per currency.

import { costTotals, formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";
import { cardClass, mutedClass } from "@/lib/ui";

export function CostSummary({ subscriptions }: { subscriptions: Subscription[] }) {
  const totals = costTotals(subscriptions);

  return (
    <section aria-label="Cost summary" className="grid grid-cols-2 gap-3 sm:gap-4">
      {totals.map(({ currency, monthly, yearly }) => (
        <div key={currency} className="contents">
          <div className={cardClass}>
            <p className={`text-sm ${mutedClass}`}>Per month</p>
            <p className="text-xl font-semibold sm:text-2xl">{formatMoney(monthly, currency)}</p>
          </div>
          <div className={cardClass}>
            <p className={`text-sm ${mutedClass}`}>Per year</p>
            <p className="text-xl font-semibold sm:text-2xl">{formatMoney(yearly, currency)}</p>
          </div>
        </div>
      ))}
      {totals.length === 0 && (
        <p className={`col-span-2 ${mutedClass}`}>Nothing to pay: every subscription is cancelled.</p>
      )}
      <p className={`col-span-2 text-xs ${mutedClass}`}>
        Excludes cancelled subscriptions. Trials count at full price, since
        that is what you pay if you don&apos;t cancel.
      </p>
    </section>
  );
}
