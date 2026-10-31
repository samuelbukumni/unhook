// Home page ("/"): the subscription list. The heading is static; the list is
// a Client Component that reads saved data in the browser.

import Link from "next/link";
import { SubscriptionList } from "@/components/SubscriptionList";
import { h1Class, mutedClass, pageClass, primaryButtonClass } from "@/lib/ui";

export default function Home() {
  return (
    <main className={pageClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={h1Class}>Your subscriptions</h1>
          <p className={mutedClass}>Subscriptions and free trials, soonest renewal first.</p>
        </div>
        <Link href="/add" className={`shrink-0 text-sm ${primaryButtonClass}`}>
          Add<span className="sr-only"> a subscription</span>
        </Link>
      </div>
      <SubscriptionList />
    </main>
  );
}
