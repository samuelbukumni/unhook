// One subscription in the list: name, plan, price (plus a converted estimate
// when a rate is configured), next renewal date, status, the highest-priority
// insight when one needs attention, and a "Trial ending soon" badge.
// The whole row links to its detail page.

import Link from "next/link";
import { findCancelGuide } from "@/lib/cancel-guides";
import { convert, DEFAULT_CURRENCY_PREFS } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { ruleInsights, sortInsights } from "@/lib/insights";
import { formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";
import { useCurrencyPrefs } from "@/lib/use-currency";
import { useStoredInsights } from "@/lib/use-insights";
import { StatusBadge } from "./ui/StatusBadge";

const PERIOD_LABEL = { monthly: "mo", yearly: "yr", weekly: "wk" } as const;
const PERIOD_WORD = { monthly: "month", yearly: "year", weekly: "week" } as const;

export function SubscriptionRow({
  subscription: sub,
  endingSoon,
  today,
}: {
  subscription: Subscription;
  endingSoon: boolean;
  today: string;
}) {
  const cancelled = sub.status === "cancelled";
  const prefs = useCurrencyPrefs() ?? DEFAULT_CURRENCY_PREFS;
  const stored = useStoredInsights() ?? {};
  const converted = convert(sub.price, sub.currency, prefs);
  const insights = sortInsights([
    ...ruleInsights(sub, findCancelGuide(sub.service), prefs, today),
    ...(stored[sub.id] ?? []),
  ]);
  const top = insights[0];
  const showWarning = top && top.severity !== "info";

  return (
    <li>
      <Link
        href={`/subscriptions/${sub.id}`}
        className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,42,67,0.06)] transition-colors hover:bg-paper dark:border-navy-800 dark:bg-navy-900 dark:shadow-none dark:hover:bg-navy-800"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-medium text-navy-900 dark:text-navy-50 ${cancelled ? "text-navy-600 line-through dark:text-navy-100" : ""}`}>
              {sub.service}
            </span>
            <span className="text-sm text-navy-600 dark:text-navy-100">{sub.plan}</span>
            <StatusBadge status={sub.status} />
            {endingSoon && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Trial ending soon
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">
            {sub.status === "trial" ? "Trial ends" : cancelled ? "Access ends" : "Renews"}{" "}
            {formatDate(sub.next_renewal_date)}
          </p>
          {showWarning && (
            <p
              className={`mt-2 rounded-lg px-2.5 py-1.5 text-xs ${
                top.severity === "high"
                  ? "bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100"
                  : "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
              }`}
            >
              <span className="font-semibold tracking-wide">
                {top.source === "ai" ? "AI insight · " : top.source === "demo" ? "Demo insight · " : "Insight · "}
              </span>
              {top.title}
            </p>
          )}
        </div>
        <p className="shrink-0 text-right">
          <span className="font-medium tabular-nums text-navy-900 dark:text-navy-50">
            {formatMoney(sub.price, sub.currency)}
            <span aria-hidden="true" className="text-sm font-normal text-navy-600 dark:text-navy-100">/{PERIOD_LABEL[sub.billing_period]}</span>
            <span className="sr-only"> per {PERIOD_WORD[sub.billing_period]}</span>
          </span>
          {converted && (
            <span className="block text-xs tabular-nums text-navy-600 dark:text-navy-100">
              ≈ {formatMoney(converted.amount, converted.to)}
              <span aria-hidden="true">/{PERIOD_LABEL[sub.billing_period]}</span>
            </span>
          )}
        </p>
      </Link>
    </li>
  );
}
