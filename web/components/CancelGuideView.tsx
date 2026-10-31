"use client";

// Shows how to cancel one saved subscription: the matching cancel guide's
// steps and official link, or a clear "no guide yet" message.

import Link from "next/link";
import { findCancelGuide } from "@/lib/cancel-guides";
import { emptyStateClass, h1Class, mutedClass, primaryButtonClass } from "@/lib/ui";
import { useSubscriptions } from "@/lib/use-subscriptions";
import { Loading } from "./Loading";

export function CancelGuideView({ id }: { id: string }) {
  const subscriptions = useSubscriptions();
  if (!subscriptions) return <Loading label="Loading cancel guide…" />;

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

  const guide = findCancelGuide(sub.service);

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`${h1Class} break-words`}>How to cancel {sub.service}</h1>
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
              className={`self-start ${primaryButtonClass}`}
            >
              Open {guide.name}&apos;s official cancel help
              <span aria-hidden="true">&nbsp;↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <p className={`text-sm ${mutedClass}`}>We don&apos;t have a confirmed official link for this one yet.</p>
          )}
          {!guide.verified && (
            <p className={`text-xs ${mutedClass}`}>
              These steps haven&apos;t been checked by our team yet, and services change their menus. Follow
              what you see on the official page.
            </p>
          )}
        </>
      ) : (
        <div className={emptyStateClass}>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">No cancel guide for {sub.service} yet.</p>
          <p className="text-sm">
            Try the account or billing settings on the service&apos;s website. If you subscribed through
            Apple or Google Play, cancel in that store&apos;s subscription settings.
          </p>
          {sub.cancel_url && (
            <a href={sub.cancel_url} target="_blank" rel="noopener noreferrer" className="self-start text-sm underline">
              Saved cancel link<span aria-hidden="true"> ↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
