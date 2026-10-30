"use client";

// Detail view for one subscription: summary line plus the edit form.
// Reads from and saves to browser storage (lib/storage.ts).

import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { saveSubscription } from "@/lib/storage";
import { formatMoney } from "@/lib/subscriptions";
import { useSubscriptions, useToday } from "@/lib/use-subscriptions";
import { SubscriptionEditor } from "./SubscriptionEditor";

export function SubscriptionDetail({ id }: { id: string }) {
  const subscriptions = useSubscriptions();
  const today = useToday();

  if (!subscriptions || !today) {
    return <p className="text-zinc-500">Loading…</p>;
  }

  const sub = subscriptions.find((s) => s.id === id);
  if (!sub) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Subscription not found</h1>
        <p className="text-zinc-500">
          It may have been removed, or it was saved in another browser.{" "}
          <Link href="/" className="underline">See all subscriptions</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          {sub.service} <span className="text-zinc-500">{sub.plan}</span>
        </h1>
        <p className="text-zinc-500">
          {formatMoney(sub.price, sub.currency)} {sub.billing_period} ·{" "}
          <span className="capitalize">{sub.status}</span> ·{" "}
          {sub.status === "cancelled" ? "access ends" : "next charge"}{" "}
          {formatDate(sub.next_renewal_date)}
        </p>
        <Link href={`/subscriptions/${sub.id}/cancel`} className="mt-2 inline-block text-sm underline">
          How to cancel {sub.service} →
        </Link>
      </header>
      <SubscriptionEditor subscription={sub} today={today} onSave={saveSubscription} />
    </div>
  );
}
