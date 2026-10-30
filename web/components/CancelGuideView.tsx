"use client";

// Shows how to cancel one saved subscription: the matching cancel guide's
// steps and official link, or a clear "no guide yet" message.

import Link from "next/link";
import { findCancelGuide } from "@/lib/cancel-guides";
import { useSubscriptions } from "@/lib/use-subscriptions";

export function CancelGuideView({ id }: { id: string }) {
  const subscriptions = useSubscriptions();
  if (!subscriptions) return <p className="text-zinc-500">Loading…</p>;

  const sub = subscriptions.find((s) => s.id === id);
  if (!sub) {
    return (
      <p className="text-zinc-500">
        Subscription not found. <Link href="/" className="underline">See all subscriptions</Link>
      </p>
    );
  }

  const guide = findCancelGuide(sub.service);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">How to cancel {sub.service}</h1>
      {guide ? (
        <>
          <ol className="list-decimal space-y-2 pl-5">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {guide.cancel_url ? (
            <a
              href={guide.cancel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Open {guide.name}&apos;s official cancel help ↗
            </a>
          ) : (
            <p className="text-sm text-zinc-500">We don&apos;t have a confirmed official link for this one yet.</p>
          )}
          {!guide.verified && (
            <p className="text-xs text-zinc-500">
              These steps haven&apos;t been checked by our team yet, and services change their menus. Follow
              what you see on the official page.
            </p>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-zinc-600 dark:border-zinc-700">
          <p className="font-medium">No cancel guide for {sub.service} yet.</p>
          <p className="mt-1 text-sm">
            Try the account or billing settings on the service&apos;s website. If you subscribed through
            Apple or Google Play, cancel in that store&apos;s subscription settings.
          </p>
          {sub.cancel_url && (
            <a href={sub.cancel_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline">
              Saved cancel link ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
