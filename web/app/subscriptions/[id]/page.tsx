// Placeholder detail page at /subscriptions/[id]. Shows the service name and
// a "details coming soon" note. Unknown ids get the 404 page via notFound().

import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSubscription } from "@/lib/data";
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
      {/* params and the mock data are request-time values, so they load inside Suspense. */}
      <Suspense fallback={<h1 className="text-3xl font-semibold text-zinc-400">Loading…</h1>}>
        <SubscriptionHeading params={params} />
      </Suspense>
      <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-zinc-500 dark:border-zinc-700">
        Details, reminders, and cancel steps are coming soon.
      </p>
    </main>
  );
}

async function SubscriptionHeading({ params }: Pick<PageProps<"/subscriptions/[id]">, "params">) {
  const { id } = await params;
  const sub = await getSubscription(id);
  if (!sub) notFound();

  return (
    <h1 className="text-3xl font-semibold tracking-tight">
      {sub.service} <span className="text-zinc-500">{sub.plan}</span>
    </h1>
  );
}
