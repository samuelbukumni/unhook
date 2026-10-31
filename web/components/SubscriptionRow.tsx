// One subscription in the list: name, plan, price, next renewal date,
// status, and a "Trial ending soon" badge. The whole row links to its detail page.

import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";

const PERIOD_LABEL = { monthly: "mo", yearly: "yr", weekly: "wk" } as const;
const PERIOD_WORD = { monthly: "month", yearly: "year", weekly: "week" } as const;

export function SubscriptionRow({
  subscription: sub,
  endingSoon,
}: {
  subscription: Subscription;
  endingSoon: boolean;
}) {
  const cancelled = sub.status === "cancelled";

  return (
    <li>
      <Link
        href={`/subscriptions/${sub.id}`}
        className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-medium ${cancelled ? "text-zinc-400 line-through" : ""}`}>
              {sub.service}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{sub.plan}</span>
            {endingSoon && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Trial ending soon
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {sub.status === "trial" ? "Trial ends" : cancelled ? "Access ends" : "Renews"}{" "}
            {formatDate(sub.next_renewal_date)} · <span className="capitalize">{sub.status}</span>
          </p>
        </div>
        <p className="shrink-0 text-right font-medium">
          {formatMoney(sub.price, sub.currency)}
          <span aria-hidden="true" className="text-sm text-zinc-600 dark:text-zinc-400">/{PERIOD_LABEL[sub.billing_period]}</span>
          <span className="sr-only"> per {PERIOD_WORD[sub.billing_period]}</span>
        </p>
      </Link>
    </li>
  );
}
