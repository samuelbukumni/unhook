// Detail and edit page at /subscriptions/[id]. The back link is static; the
// id comes from params, which is a request-time value, so it's read inside
// Suspense. The subscription itself loads from browser storage.

import Link from "next/link";
import { Suspense } from "react";
import { SubscriptionDetail } from "@/components/SubscriptionDetail";
import { Loading } from "@/components/Loading";
import { MOCK_SUBSCRIPTION_IDS } from "@/lib/mock-data";
import { backLinkClass, pageClass } from "@/lib/ui";

// Prerender a page for each demo id at build time. Ids added later (from
// /add) still work; they render on request.
export function generateStaticParams() {
  return MOCK_SUBSCRIPTION_IDS.map((id) => ({ id }));
}

export default function SubscriptionPage({ params }: PageProps<"/subscriptions/[id]">) {
  return (
    <main className={pageClass}>
      <Link href="/" className={backLinkClass}>
        <span aria-hidden="true">← </span>Back to subscriptions
      </Link>
      <Suspense fallback={<Loading />}>
        <SubscriptionContent params={params} />
      </Suspense>
    </main>
  );
}

async function SubscriptionContent({ params }: Pick<PageProps<"/subscriptions/[id]">, "params">) {
  const { id } = await params;
  return <SubscriptionDetail id={id} />;
}
