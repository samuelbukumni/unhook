"use client";

// The editable form used on /add, both for manual entry and for reviewing an
// extraction. Fields named in the extraction's issues get an amber "Check"
// highlight. Nothing is saved until the user presses "Confirm and save".

import type { ReviewField } from "@/lib/review";
import type { NewSubscriptionInput } from "@/lib/subscriptions";
import type { BillingPeriod, ReminderChannel } from "@/lib/types";
import { inputClass, selectClass } from "@/lib/ui";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";

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
  "w-full min-h-10 rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-2 text-navy-900 dark:bg-amber-950/40 dark:text-navy-50";

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

  const inputFor = (name: ReviewField) => (flagged.has(name) ? flaggedInputClass : inputClass);
  const selectFor = (name: ReviewField) => (flagged.has(name) ? flaggedInputClass : selectClass);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Service" check={flagged.has("service")}>
          <input name="service" required defaultValue={defaults.service} className={inputFor("service")} />
        </Field>
        <Field label="Plan (optional)" check={flagged.has("plan")}>
          <input name="plan" defaultValue={defaults.plan} className={inputFor("plan")} />
        </Field>
        <Field label="Price" check={flagged.has("price")}>
          <input name="price" type="number" min="0" step="0.01" required defaultValue={defaults.price} className={inputFor("price")} />
        </Field>
        <Field label="Currency (e.g. USD, NGN)" check={flagged.has("currency")}>
          <input name="currency" required pattern="[A-Za-z]{3}" maxLength={3} defaultValue={defaults.currency} className={inputFor("currency")} />
        </Field>
        <Field label="Billing period" check={flagged.has("billing_period")}>
          <select name="billing_period" required defaultValue={defaults.billing_period} className={selectFor("billing_period")}>
            <option value="" disabled>Choose…</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </Field>
        <Field label="First charge" check={flagged.has("first_charge_date")}>
          <input name="first_charge_date" type="date" required defaultValue={defaults.first_charge_date} className={inputFor("first_charge_date")} />
        </Field>
        <Field label="Trial ends (optional)" check={flagged.has("trial_end_date")}>
          <input name="trial_end_date" type="date" defaultValue={defaults.trial_end_date} className={inputFor("trial_end_date")} />
        </Field>
      </div>
      <Field label="Notes" check={flagged.has("notes")}>
        <textarea name="notes" rows={2} defaultValue={defaults.notes} className={inputFor("notes")} />
      </Field>
      <fieldset className="flex gap-4 text-sm text-navy-800 dark:text-navy-100">
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
      <Button type="submit" className="self-start">
        Confirm and save
      </Button>
    </form>
  );
}
