// Home page ("/"): the subscription list. The heading is static; the list is
// a Client Component that reads saved data in the browser.

import { SubscriptionList } from "@/components/SubscriptionList";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlusIcon } from "@/components/icons";
import { pageClass } from "@/lib/ui";

export default function Home() {
  return (
    <main className={pageClass}>
      <PageHeader
        title="Your subscriptions"
        description="Subscriptions and free trials, soonest renewal first."
        action={
          <ButtonLink href="/add" className="shrink-0 text-sm">
            <PlusIcon />
            Add<span className="sr-only"> a subscription</span>
          </ButtonLink>
        }
      />
      <SubscriptionList />
    </main>
  );
}
