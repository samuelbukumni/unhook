"use client";

// The editable form used on /add, both for manual entry and for reviewing an
// extraction. Nothing is saved until the user presses "Confirm and save".

import type { NewSubscriptionInput } from "@/lib/subscriptions";
import type { BillingPeriod, ReminderChannel } from "@/lib/types";

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

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700";

export function NewSubscriptionForm({
  defaults,
  onSave,
}: {
  defaults: FormDefaults;
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Service
          <input name="service" required defaultValue={defaults.service} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Plan (optional)
          <input name="plan" defaultValue={defaults.plan} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Price
          <input name="price" type="number" min="0" step="0.01" required defaultValue={defaults.price} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Currency (e.g. USD, NGN)
          <input name="currency" required pattern="[A-Za-z]{3}" maxLength={3} defaultValue={defaults.currency} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Billing period
          <select name="billing_period" required defaultValue={defaults.billing_period} className={inputClass}>
            <option value="" disabled>Choose…</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          First charge
          <input name="first_charge_date" type="date" required defaultValue={defaults.first_charge_date} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Trial ends (optional)
          <input name="trial_end_date" type="date" defaultValue={defaults.trial_end_date} className={inputClass} />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Notes
        <textarea name="notes" rows={2} defaultValue={defaults.notes} className={inputClass} />
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
      <button type="submit" className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
        Confirm and save
      </button>
    </form>
  );
}
