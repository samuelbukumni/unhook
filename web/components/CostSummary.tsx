// Shows the total monthly and yearly cost of all non-cancelled subscriptions.

import { costTotals, formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";

export function CostSummary({ subscriptions }: { subscriptions: Subscription[] }) {
  const totals = costTotals(subscriptions);

  return (
    <section className="grid grid-cols-2 gap-4">
      {totals.map(({ currency, monthly, yearly }) => (
        <div key={currency} className="contents">
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Per month</p>
            <p className="text-2xl font-semibold">{formatMoney(monthly, currency)}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Per year</p>
            <p className="text-2xl font-semibold">{formatMoney(yearly, currency)}</p>
          </div>
        </div>
      ))}
      <p className="col-span-2 text-xs text-zinc-500">
        Excludes cancelled subscriptions. Trials count at full price, since
        that is what you pay if you don&apos;t cancel.
      </p>
    </section>
  );
}
