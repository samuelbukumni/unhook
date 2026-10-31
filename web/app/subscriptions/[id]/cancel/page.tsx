// Cancel guide page at /subscriptions/[id]/cancel. The back link is static;
// the id comes from params (request-time), so it's read inside Suspense.

import Link from "next/link";
import { Suspense } from "react";
import { CancelGuideView } from "@/components/CancelGuideView";
import { Loading } from "@/components/Loading";
import { MOCK_SUBSCRIPTION_IDS } from "@/lib/mock-data";
import { backLinkClass, pageClass } from "@/lib/ui";

export function generateStaticParams() {
  return MOCK_SUBSCRIPTION_IDS.map((id) => ({ id }));
}

export default function CancelPage({ params }: PageProps<"/subscriptions/[id]/cancel">) {
  return (
    <main className={pageClass}>
      <Suspense fallback={<Loading />}>
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
    <Link href={`/subscriptions/${id}`} className={backLinkClass}>
      <span aria-hidden="true">← </span>Back to subscription
    </Link>
  );
}

async function GuideContent({ params }: Params) {
  const { id } = await params;
  return <CancelGuideView id={id} />;
}
