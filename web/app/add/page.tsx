// Add page at /add: paste a receipt for AI extraction or enter details by
// hand, review, then save.

import Link from "next/link";
import { AddSubscription } from "@/components/AddSubscription";

export default function AddPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Back to subscriptions
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">Add a subscription</h1>
      <AddSubscription />
    </main>
  );
}
