"use client";

// Edit form for one subscription: price, billing period, trial end, first
// charge date, notes, and reminder channel, plus a "Mark as cancelled" button.
// It doesn't store anything itself; it hands the updated subscription to `onSave`.

import { useState } from "react";
import { formatDate } from "@/lib/dates";
import { withComputedFields } from "@/lib/subscriptions";
import type { BillingPeriod, ReminderChannel, Subscription } from "@/lib/types";
import { dangerButtonClass, inputClass, primaryButtonClass } from "@/lib/ui";

export function SubscriptionEditor({
  subscription: sub,
  today,
  onSave,
}: {
  subscription: Subscription;
  today: string;
  onSave: (updated: Subscription) => void;
}) {
  const [message, setMessage] = useState("");
  const cancelled = sub.status === "cancelled";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updated = withComputedFields(
      {
        ...sub,
        price: Number(form.get("price")),
        billing_period: form.get("billing_period") as BillingPeriod,
        trial_end_date: (form.get("trial_end_date") as string) || null,
        first_charge_date: form.get("first_charge_date") as string,
        notes: (form.get("notes") as string).trim(),
        reminder_channel: form.get("reminder_channel") as ReminderChannel,
      },
      today,
    );
    onSave(updated);
    setMessage(`Saved. Next charge: ${formatDate(updated.next_renewal_date)}.`);
  }

  function handleCancel() {
    onSave({ ...sub, status: "cancelled" });
    setMessage("Marked as cancelled. It no longer counts toward your totals.");
  }

  // Keyed on the saved data (not the component): after a save the form
  // remounts with fresh defaultValues, while the confirmation message below
  // (component state) survives.
  return (
    <div className="flex flex-col gap-4">
      <form key={JSON.stringify(sub)} onSubmit={handleSubmit} aria-label={`Edit ${sub.service}`} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Price ({sub.currency})
          <input name="price" type="number" min="0" step="0.01" required defaultValue={sub.price} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Billing period
          <select name="billing_period" defaultValue={sub.billing_period} className={inputClass}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Trial ends (optional)
          <input name="trial_end_date" type="date" defaultValue={sub.trial_end_date ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          First charge
          <input name="first_charge_date" type="date" required defaultValue={sub.first_charge_date} className={inputClass} />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Notes
        <textarea name="notes" rows={3} defaultValue={sub.notes} className={inputClass} />
      </label>
      <fieldset className="flex gap-4 text-sm">
        <legend className="mb-1">Remind me by</legend>
        <label className="flex items-center gap-2">
          <input type="radio" name="reminder_channel" value="push" defaultChecked={sub.reminder_channel === "push"} />
          Push
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="reminder_channel" value="email" defaultChecked={sub.reminder_channel === "email"} />
          Email
        </label>
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={primaryButtonClass}>
          Save changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={cancelled}
          className={dangerButtonClass}
        >
          {cancelled ? "Cancelled" : "Mark as cancelled"}
        </button>
      </div>
      </form>
      <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p>
    </div>
  );
}
