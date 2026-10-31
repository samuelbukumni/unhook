// Home page ("/"): the subscription list. The heading is static; the list is
// a Client Component that reads saved data in the browser.

import Link from "next/link";
import { SubscriptionList } from "@/components/SubscriptionList";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your subscriptions</h1>
          <p className="text-zinc-500">Subscriptions and free trials, soonest renewal first.</p>
        </div>
        <Link
          href="/add"
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Add
        </Link>
      </header>
      <SubscriptionList />
    </main>
  );
}
