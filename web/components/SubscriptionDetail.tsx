"use client";

// Detail view for one subscription: summary line plus the edit form.
// For now, changes live in this component's state only (they reset on reload);
// a storage layer replaces this in the next step.

import { useState } from "react";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";
import { SubscriptionEditor } from "./SubscriptionEditor";

export function SubscriptionDetail({
  initial,
  today,
}: {
  initial: Subscription;
  today: string;
}) {
  const [sub, setSub] = useState(initial);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          {sub.service} <span className="text-zinc-500">{sub.plan}</span>
        </h1>
        <p className="text-zinc-500">
          {formatMoney(sub.price, sub.currency)} {sub.billing_period} ·{" "}
          <span className="capitalize">{sub.status}</span> · next charge{" "}
          {formatDate(sub.next_renewal_date)}
        </p>
      </header>
      <SubscriptionEditor subscription={sub} today={today} onSave={setSub} />
    </div>
  );
}
