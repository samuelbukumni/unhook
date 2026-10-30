// Home page ("/"): the subscription list. The heading is static; the list is
// a Client Component that reads saved data in the browser.

import { SubscriptionList } from "@/components/SubscriptionList";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Unhook</h1>
        <p className="text-zinc-500">Your subscriptions and free trials, soonest renewal first.</p>
      </header>
      <SubscriptionList />
    </main>
  );
}
