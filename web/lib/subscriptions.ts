// Pure helpers for working with subscriptions: sorting, cost totals,
// and the "trial ending soon" check. No Next.js code here.

import { daysBetween } from "./dates";
import type { BillingPeriod, Subscription } from "./types";

export const TRIAL_ENDING_SOON_DAYS = 3;

/** Returns a new array sorted by next_renewal_date, soonest first. */
export function sortByNextRenewal(subs: Subscription[]): Subscription[] {
  // "YYYY-MM-DD" strings sort correctly as plain text.
  return [...subs].sort((a, b) =>
    a.next_renewal_date.localeCompare(b.next_renewal_date),
  );
}

const MONTHS_PER_PERIOD: Record<BillingPeriod, number> = {
  monthly: 1,
  yearly: 12,
  weekly: 12 / 52, // 52 weeks in a year, spread over 12 months
};

/** What one subscription costs per month, whatever its billing period. */
export function monthlyCost(sub: Subscription): number {
  return sub.price / MONTHS_PER_PERIOD[sub.billing_period];
}

export type CostTotal = { currency: string; monthly: number; yearly: number };

/**
 * Total monthly and yearly cost, one entry per currency.
 * Cancelled subscriptions are left out. Trials are counted at their
 * full price, because that is what the user pays if they don't cancel
 * before the trial ends.
 */
export function costTotals(subs: Subscription[]): CostTotal[] {
  const byCurrency = new Map<string, number>();
  for (const sub of subs) {
    if (sub.status === "cancelled") continue;
    const current = byCurrency.get(sub.currency) ?? 0;
    byCurrency.set(sub.currency, current + monthlyCost(sub));
  }
  return [...byCurrency].map(([currency, monthly]) => ({
    currency,
    monthly,
    yearly: monthly * 12,
  }));
}

/** True when a trial ends today or within the next 3 days. */
export function isTrialEndingSoon(sub: Subscription, today: string): boolean {
  if (sub.status !== "trial" || !sub.trial_end_date) return false;
  const daysLeft = daysBetween(today, sub.trial_end_date);
  return daysLeft >= 0 && daysLeft <= TRIAL_ENDING_SOON_DAYS;
}

/** Formats an amount like "$12.00". */
export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
}
