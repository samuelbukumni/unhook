// Add page at /add: paste a receipt for AI extraction or enter details by
// hand, review, then save.

import Link from "next/link";
import { AddSubscription } from "@/components/AddSubscription";
import { backLinkClass, h1Class, pageClass } from "@/lib/ui";

export const metadata = { title: "Add a subscription · Unhook" };

export default function AddPage() {
  return (
    <main className={pageClass}>
      <Link href="/" className={backLinkClass}>
        <span aria-hidden="true">← </span>Back to subscriptions
      </Link>
      <h1 className={h1Class}>Add a subscription</h1>
      <AddSubscription />
    </main>
  );
}
