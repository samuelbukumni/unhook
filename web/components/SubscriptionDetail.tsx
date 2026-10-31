"use client";

// Detail view for one subscription: summary line plus the edit form.
// Reads from and saves to browser storage (lib/storage.ts).

import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { saveSubscription } from "@/lib/storage";
import { formatMoney } from "@/lib/subscriptions";
import { emptyStateClass, h1Class, mutedClass } from "@/lib/ui";
import { useSubscriptions, useToday } from "@/lib/use-subscriptions";
import { Loading } from "./Loading";
import { SubscriptionEditor } from "./SubscriptionEditor";

export function SubscriptionDetail({ id }: { id: string }) {
  const subscriptions = useSubscriptions();
  const today = useToday();

  if (!subscriptions || !today) {
    return <Loading label="Loading subscription…" />;
  }

  const sub = subscriptions.find((s) => s.id === id);
  if (!sub) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className={h1Class}>Subscription not found</h1>
        <p className={emptyStateClass}>
          It may have been removed, or it was saved in another browser.{" "}
          <Link href="/" className="underline">See all subscriptions</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className={`${h1Class} break-words`}>
          {sub.service} <span className={mutedClass}>{sub.plan}</span>
        </h1>
        <p className={mutedClass}>
          {formatMoney(sub.price, sub.currency)} {sub.billing_period} ·{" "}
          <span className="capitalize">{sub.status}</span> ·{" "}
          {sub.status === "cancelled" ? "access ends" : "next charge"}{" "}
          {formatDate(sub.next_renewal_date)}
        </p>
        <Link href={`/subscriptions/${sub.id}/cancel`} className="mt-1 self-start text-sm underline">
          How to cancel {sub.service}<span aria-hidden="true"> →</span>
        </Link>
      </header>
      <SubscriptionEditor subscription={sub} today={today} onSave={saveSubscription} />
    </div>
  );
}
