// Status pill for a subscription: trial (amber), active (forest green),
// cancelled (neutral navy). Text is always shown, never color alone.

import type { SubscriptionStatus } from "@/lib/types";

const PILL_CLASS: Record<SubscriptionStatus, string> = {
  trial: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  cancelled: "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-100",
};

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PILL_CLASS[status]}`}>
      {status}
    </span>
  );
}
