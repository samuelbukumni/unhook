"use client";

// The editable form used on /add, both for manual entry and for reviewing an
// extraction. Fields named in the extraction's issues get an amber "Check"
// highlight. Nothing is saved until the user presses "Confirm and save".

import type { ReviewField } from "@/lib/review";
import type { NewSubscriptionInput } from "@/lib/subscriptions";
import type { BillingPeriod, ReminderChannel } from "@/lib/types";
import { inputClass, primaryButtonClass } from "@/lib/ui";

/** Starting values; empty strings mean "unknown, please fill in". */
export type FormDefaults = {
  service: string;
  plan: string;
  price: string;
  currency: string;
  billing_period: BillingPeriod | "";
  trial_end_date: string;
  first_charge_date: string;
  notes: string;
};

const flaggedInputClass =
  "w-full rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-2 dark:bg-amber-950/40";

const NO_FIELDS: ReadonlySet<ReviewField> = new Set();

export function NewSubscriptionForm({
  defaults,
  flagged = NO_FIELDS,
  onSave,
}: {
  defaults: FormDefaults;
  flagged?: ReadonlySet<ReviewField>;
  onSave: (input: NewSubscriptionInput) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    onSave({
      service: text("service"),
      plan: text("plan"),
      price: Number(text("price")),
      currency: text("currency").toUpperCase(),
      billing_period: text("billing_period") as BillingPeriod,
      trial_end_date: text("trial_end_date") || null,
      first_charge_date: text("first_charge_date"),
      notes: text("notes"),
      reminder_channel: text("reminder_channel") as ReminderChannel,
    });
  }

  /** Label text plus a "Check" tag, and the input class, for one field. */
  function field(name: ReviewField, label: string) {
    const isFlagged = flagged.has(name);
    return {
      label: (
        <span className="flex items-center gap-2">
          {label}
          {isFlagged && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Check
            </span>
          )}
        </span>
      ),
      className: isFlagged ? flaggedInputClass : inputClass,
    };
  }

  const service = field("service", "Service");
  const plan = field("plan", "Plan (optional)");
  const price = field("price", "Price");
  const currency = field("currency", "Currency (e.g. USD, NGN)");
  const period = field("billing_period", "Billing period");
  const firstCharge = field("first_charge_date", "First charge");
  const trialEnd = field("trial_end_date", "Trial ends (optional)");
  const notes = field("notes", "Notes");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          {service.label}
          <input name="service" required defaultValue={defaults.service} className={service.className} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {plan.label}
          <input name="plan" defaultValue={defaults.plan} className={plan.className} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {price.label}
          <input name="price" type="number" min="0" step="0.01" required defaultValue={defaults.price} className={price.className} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {currency.label}
          <input name="currency" required pattern="[A-Za-z]{3}" maxLength={3} defaultValue={defaults.currency} className={currency.className} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {period.label}
          <select name="billing_period" required defaultValue={defaults.billing_period} className={period.className}>
            <option value="" disabled>Choose…</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {firstCharge.label}
          <input name="first_charge_date" type="date" required defaultValue={defaults.first_charge_date} className={firstCharge.className} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {trialEnd.label}
          <input name="trial_end_date" type="date" defaultValue={defaults.trial_end_date} className={trialEnd.className} />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        {notes.label}
        <textarea name="notes" rows={2} defaultValue={defaults.notes} className={notes.className} />
      </label>
      <fieldset className="flex gap-4 text-sm">
        <legend className="mb-1">Remind me by</legend>
        <label className="flex items-center gap-2">
          <input type="radio" name="reminder_channel" value="push" defaultChecked />
          Push
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="reminder_channel" value="email" />
          Email
        </label>
      </fieldset>
      <button type="submit" className={`self-start ${primaryButtonClass}`}>
        Confirm and save
      </button>
    </form>
  );
}
