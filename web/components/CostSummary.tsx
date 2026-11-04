// Shows the total monthly and yearly cost of all non-cancelled subscriptions,
// one pair of cards per currency, with a converted estimate in the user's
// preferred currency when they have configured a rate (labelled as an
// estimate; originals are never replaced).

import Link from "next/link";
import { convert, formatRate } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { costTotals, formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";
import { useCurrencyPrefs } from "@/lib/use-currency";
import { cardClass, linkClass, mutedClass } from "@/lib/ui";

export function CostSummary({ subscriptions }: { subscriptions: Subscription[] }) {
  const totals = costTotals(subscriptions);
  const prefs = useCurrencyPrefs();

  return (
    <section aria-label="Cost summary" className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4">
      {totals.map(({ currency, monthly, yearly }) => {
        const monthlyConv = prefs ? convert(monthly, currency, prefs) : null;
        const yearlyConv = prefs ? convert(yearly, currency, prefs) : null;
        const needsRate = prefs !== null && currency.toUpperCase() !== prefs.target.toUpperCase() && !monthlyConv;
        return (
          <div key={currency} className="contents">
            <div className={cardClass}>
              <p className={`text-sm ${mutedClass}`}>Per month</p>
              <p className="text-xl font-semibold tabular-nums tracking-tight text-navy-900 sm:text-2xl dark:text-navy-50">
                {formatMoney(monthly, currency)}
              </p>
              {monthlyConv && (
                <p className={`text-sm tabular-nums ${mutedClass}`}>
                  ≈ {formatMoney(monthlyConv.amount, monthlyConv.to)}
                </p>
              )}
            </div>
            <div className={cardClass}>
              <p className={`text-sm ${mutedClass}`}>Per year</p>
              <p className="text-xl font-semibold tabular-nums tracking-tight text-navy-900 sm:text-2xl dark:text-navy-50">
                {formatMoney(yearly, currency)}
              </p>
              {yearlyConv && (
                <p className={`text-sm tabular-nums ${mutedClass}`}>
                  ≈ {formatMoney(yearlyConv.amount, yearlyConv.to)}
                </p>
              )}
            </div>
            {monthlyConv && (
              <p className={`col-span-1 text-xs min-[480px]:col-span-2 ${mutedClass}`}>
                Estimated conversion · 1 {monthlyConv.from} = {formatRate(monthlyConv.rate)}{" "}
                {monthlyConv.to} · your configured rate, updated {formatDate(monthlyConv.updatedAt)}.{" "}
                <Link href="/settings" className={linkClass}>
                  Currency settings
                </Link>
              </p>
            )}
            {needsRate && prefs && (
              <p className={`col-span-1 text-xs min-[480px]:col-span-2 ${mutedClass}`}>
                {prefs.target} conversion isn&apos;t configured for {currency} yet.{" "}
                <Link href="/settings" className={linkClass}>
                  Add your rate in Currency settings
                </Link>
              </p>
            )}
          </div>
        );
      })}
      {totals.length === 0 && (
        <p className={`col-span-1 min-[480px]:col-span-2 ${mutedClass}`}>Nothing to pay: every subscription is cancelled.</p>
      )}
      <p className={`col-span-1 text-xs min-[480px]:col-span-2 ${mutedClass}`}>
        Excludes cancelled subscriptions. Trials count at full price, since
        that is what you pay if you don&apos;t cancel.
      </p>
    </section>
  );
}
