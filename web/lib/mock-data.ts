// Fake subscriptions for building the UI before real data exists.
// Dates are stored as day offsets from "today" so the list always looks
// realistic (and at least one trial is always about to end).

import { addDays } from "./dates";
import type { Subscription } from "./types";

type MockSeed = Omit<
  Subscription,
  "trial_end_date" | "first_charge_date" | "next_renewal_date"
> & {
  trialEndsInDays: number | null; // null = not a trial
  firstChargeInDays: number; // negative = already charged in the past
  renewsInDays: number;
};

const seeds: MockSeed[] = [
  {
    id: "designly-pro",
    service: "Designly",
    plan: "Pro",
    price: 12,
    currency: "USD",
    billing_period: "monthly",
    status: "trial",
    trialEndsInDays: 2,
    firstChargeInDays: 2,
    renewsInDays: 2,
    cancel_url: "https://designly.example/account/billing",
    notes: "7-day free trial from a receipt email.",
    confidence: 0.92,
  },
  {
    id: "streamflix-standard",
    service: "StreamFlix",
    plan: "Standard",
    price: 15.49,
    currency: "USD",
    billing_period: "monthly",
    status: "active",
    trialEndsInDays: null,
    firstChargeInDays: -200,
    renewsInDays: 5,
    cancel_url: "https://streamflix.example/cancel",
    notes: "",
    confidence: 0.98,
  },
  {
    id: "fitpulse-premium",
    service: "FitPulse",
    plan: "Premium",
    price: 59.99,
    currency: "USD",
    billing_period: "yearly",
    status: "trial",
    trialEndsInDays: 1,
    firstChargeInDays: 1,
    renewsInDays: 1,
    cancel_url: "https://fitpulse.example/settings/subscription",
    notes: "Trial started from the mobile app.",
    confidence: 0.81,
  },
  {
    id: "cloudvault-2tb",
    service: "CloudVault",
    plan: "2 TB",
    price: 99.99,
    currency: "USD",
    billing_period: "yearly",
    status: "active",
    trialEndsInDays: null,
    firstChargeInDays: -320,
    renewsInDays: 45,
    cancel_url: "https://cloudvault.example/plans",
    notes: "Family sharing on.",
    confidence: 0.95,
  },
  {
    id: "newsdaily-digital",
    service: "NewsDaily",
    plan: "Digital Access",
    price: 4,
    currency: "USD",
    billing_period: "weekly",
    status: "active",
    trialEndsInDays: null,
    firstChargeInDays: -60,
    renewsInDays: 3,
    cancel_url: "https://newsdaily.example/account",
    notes: "Intro price may go up after 3 months.",
    confidence: 0.74,
  },
  {
    id: "codecamp-plus",
    service: "CodeCamp",
    plan: "Plus",
    price: 29,
    currency: "USD",
    billing_period: "monthly",
    status: "trial",
    trialEndsInDays: 10,
    firstChargeInDays: 10,
    renewsInDays: 10,
    cancel_url: "https://codecamp.example/billing/cancel",
    notes: "",
    confidence: 0.88,
  },
  {
    id: "tunebox-family",
    service: "TuneBox",
    plan: "Family",
    price: 16.99,
    currency: "USD",
    billing_period: "monthly",
    status: "active",
    trialEndsInDays: null,
    firstChargeInDays: -400,
    renewsInDays: 18,
    cancel_url: "https://tunebox.example/account/plan",
    notes: "",
    confidence: 0.97,
  },
  {
    id: "photoforge-annual",
    service: "PhotoForge",
    plan: "Annual",
    price: 119.88,
    currency: "USD",
    billing_period: "yearly",
    status: "cancelled",
    trialEndsInDays: null,
    firstChargeInDays: -340,
    renewsInDays: 25,
    cancel_url: "https://photoforge.example/cancel",
    notes: "Cancelled; access ends on the renewal date.",
    confidence: 0.9,
  },
];

/** Every mock id. Safe to use at build time because it never changes. */
export const MOCK_SUBSCRIPTION_IDS = seeds.map((seed) => seed.id);

/** Builds the 8 mock subscriptions with dates relative to `today` ("YYYY-MM-DD"). */
export function buildMockSubscriptions(today: string): Subscription[] {
  return seeds.map(
    ({ trialEndsInDays, firstChargeInDays, renewsInDays, ...rest }) => ({
      ...rest,
      trial_end_date:
        trialEndsInDays === null ? null : addDays(today, trialEndsInDays),
      first_charge_date: addDays(today, firstChargeInDays),
      next_renewal_date: addDays(today, renewsInDays),
    }),
  );
}
