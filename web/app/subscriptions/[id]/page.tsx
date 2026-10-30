// Detail and edit page at /subscriptions/[id]. The back link is static; the
// subscription loads inside Suspense because params and today's date are
// request-time values. Unknown ids get the 404 page via notFound().

import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SubscriptionDetail } from "@/components/SubscriptionDetail";
import { getSubscription, getToday } from "@/lib/data";
import { MOCK_SUBSCRIPTION_IDS } from "@/lib/mock-data";

// Prerender a page for every known id at build time.
export function generateStaticParams() {
  return MOCK_SUBSCRIPTION_IDS.map((id) => ({ id }));
}

export default function SubscriptionPage({ params }: PageProps<"/subscriptions/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Back to subscriptions
      </Link>
      <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
        <SubscriptionContent params={params} />
      </Suspense>
    </main>
  );
}

async function SubscriptionContent({ params }: Pick<PageProps<"/subscriptions/[id]">, "params">) {
  const { id } = await params;
  const [sub, today] = await Promise.all([getSubscription(id), getToday()]);
  if (!sub) notFound();

  return <SubscriptionDetail initial={sub} today={today} />;
}
