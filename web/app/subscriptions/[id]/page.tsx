// Detail and edit page at /subscriptions/[id]. The back link is static; the
// id comes from params, which is a request-time value, so it's read inside
// Suspense. The subscription itself loads from browser storage.

import Link from "next/link";
import { Suspense } from "react";
import { SubscriptionDetail } from "@/components/SubscriptionDetail";
import { MOCK_SUBSCRIPTION_IDS } from "@/lib/mock-data";

// Prerender a page for each demo id at build time. Ids added later (from
// /add) still work; they render on request.
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
  return <SubscriptionDetail id={id} />;
}
