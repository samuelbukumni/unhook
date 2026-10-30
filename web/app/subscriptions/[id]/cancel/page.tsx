// Cancel guide page at /subscriptions/[id]/cancel. The back link is static;
// the id comes from params (request-time), so it's read inside Suspense.

import Link from "next/link";
import { Suspense } from "react";
import { CancelGuideView } from "@/components/CancelGuideView";
import { MOCK_SUBSCRIPTION_IDS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_SUBSCRIPTION_IDS.map((id) => ({ id }));
}

export default function CancelPage({ params }: PageProps<"/subscriptions/[id]/cancel">) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-10">
      <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
        <BackLink params={params} />
        <GuideContent params={params} />
      </Suspense>
    </main>
  );
}

type Params = Pick<PageProps<"/subscriptions/[id]/cancel">, "params">;

async function BackLink({ params }: Params) {
  const { id } = await params;
  return (
    <Link href={`/subscriptions/${id}`} className="text-sm text-zinc-500 hover:underline">
      ← Back to subscription
    </Link>
  );
}

async function GuideContent({ params }: Params) {
  const { id } = await params;
  return <CancelGuideView id={id} />;
}
