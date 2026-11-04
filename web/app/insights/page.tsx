// Insights page at /insights: a minimal placeholder for the spending
// breakdowns planned next. No charts or figures are shown until real
// analysis exists; the nav item must still lead somewhere honest.

import { cardClass, pageClass } from "@/lib/ui";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = { title: "Insights · Unhook" };

export default function InsightsPage() {
  return (
    <main className={pageClass}>
      <PageHeader
        title="Insights"
        description="Spending breakdowns across subscriptions and currencies."
      />
      <div className={cardClass}>
        <p className="text-sm">
          Insights are not available yet. This page will show monthly totals,
          upcoming renewals, and trial-end risks computed from your saved
          subscriptions. For now, your totals are on the Subscriptions page.
        </p>
      </div>
    </main>
  );
}
