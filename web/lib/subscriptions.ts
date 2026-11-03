// Pure helpers for working with subscriptions: sorting, cost totals,
// and the "trial ending soon" check. No Next.js code here.

import { findCancelGuide } from "./cancel-guides";
import { addDays, addMonths, daysBetween } from "./dates";
import type {
  BillingPeriod,
  ReminderChannel,
  Subscription,
  SubscriptionStatus,
} from "./types";

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

/**
 * Formats an amount like "$12.00". Falls back to "XXX 12.00" when the
 * currency code isn't a real ISO code (bad saved data must not crash pages).
 */
export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
      amount,
    );
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * The next charge on or after `today`, counted forward from the first charge
 * in steps of the billing period. A first charge in the future is the answer.
 */
export function nextRenewalDate(
  firstChargeDate: string,
  period: BillingPeriod,
  today: string,
): string {
  if (firstChargeDate >= today) return firstChargeDate;
  if (period === "weekly") {
    const weeks = Math.ceil(daysBetween(firstChargeDate, today) / 7);
    return addDays(firstChargeDate, weeks * 7);
  }
  const step = period === "yearly" ? 12 : 1;
  let count = 1;
  while (addMonths(firstChargeDate, count * step) < today) count++;
  return addMonths(firstChargeDate, count * step);
}

/** Cancelled stays cancelled; otherwise it's a trial until the trial ends. */
export function statusFor(
  current: SubscriptionStatus,
  trialEndDate: string | null,
  today: string,
): SubscriptionStatus {
  if (current === "cancelled") return "cancelled";
  return trialEndDate && trialEndDate >= today ? "trial" : "active";
}

/** Recomputes next_renewal_date and status after dates or period change. */
export function withComputedFields(sub: Subscription, today: string): Subscription {
  return {
    ...sub,
    next_renewal_date: nextRenewalDate(sub.first_charge_date, sub.billing_period, today),
    status: statusFor(sub.status, sub.trial_end_date, today),
  };
}

/** What the add form collects; the rest of a Subscription is computed. */
export type NewSubscriptionInput = {
  service: string;
  plan: string;
  price: number;
  currency: string;
  billing_period: BillingPeriod;
  trial_end_date: string | null;
  first_charge_date: string;
  notes: string;
  reminder_channel: ReminderChannel;
};

/**
 * Builds a full Subscription from form input: a new id, plus computed
 * next_renewal_date and status. cancel_url comes from the cancel guides,
 * or null when there's no guide with a confirmed link.
 */
export function createSubscription(
  input: NewSubscriptionInput,
  today: string,
  confidence: number | null,
): Subscription {
  const slug = input.service.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return withComputedFields(
    {
      ...input,
      id: `${slug || "sub"}-${crypto.randomUUID().slice(0, 8)}`,
      status: "active",
      next_renewal_date: "",
      cancel_url: findCancelGuide(input.service)?.cancel_url ?? null,
      confidence,
    },
    today,
  );
}
