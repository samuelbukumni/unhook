// The shape of one tracked subscription or free trial.
// Dates are plain calendar dates written as "YYYY-MM-DD".

export type BillingPeriod = "monthly" | "yearly" | "weekly";

export type SubscriptionStatus = "trial" | "active" | "cancelled";

export type Subscription = {
  id: string;
  service: string;
  plan: string;
  price: number;
  currency: string; // ISO 4217 code, e.g. "USD"
  billing_period: BillingPeriod;
  trial_end_date: string | null;
  first_charge_date: string;
  next_renewal_date: string;
  status: SubscriptionStatus;
  cancel_url: string;
  notes: string;
  confidence: number; // 0 to 1, how sure we are the details are right
};
