// Add page at /add: paste a receipt for AI extraction or enter details by
// hand, review, then save.

import Link from "next/link";
import { AddSubscription } from "@/components/AddSubscription";
import { PageHeader } from "@/components/ui/PageHeader";
import { backLinkClass, pageClass } from "@/lib/ui";

export const metadata = { title: "Add a subscription · Unhook" };

export default function AddPage() {
  return (
    <main className={pageClass}>
      <Link href="/" className={backLinkClass}>
        <span aria-hidden="true">← </span>Back to subscriptions
      </Link>
      <PageHeader title="Add a subscription" />
      <AddSubscription />
    </main>
  );
}
