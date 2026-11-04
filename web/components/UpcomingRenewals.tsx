// Upcoming renewals and trial ends in days 4-7 (beyond the Action Required
// window, so nothing is listed twice). Renders nothing when empty.

import Link from "next/link";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";
import { upcomingEvents } from "@/lib/urgency";
import { h2Class, mutedClass } from "@/lib/ui";

export function UpcomingRenewals({
  subscriptions,
  today,
}: {
  subscriptions: Subscription[];
  today: string;
}) {
  const events = upcomingEvents(subscriptions, today);
  if (events.length === 0) return null;

  return (
    <section aria-labelledby="upcoming-heading" className="flex flex-col gap-2">
      <h2 id="upcoming-heading" className={h2Class}>
        Upcoming in the next 7 days
      </h2>
      <ul className="flex flex-col gap-2">
        {events.map((event) => {
          const sub = event.subscription;
          return (
            <li key={`${sub.id}-${event.kind}`}>
              <Link
                href={`/subscriptions/${sub.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white p-3 transition-colors hover:bg-paper dark:border-navy-800 dark:bg-navy-900 dark:hover:bg-navy-800"
              >
                <span>
                  {sub.service}{" "}
                  <span className={`text-sm ${mutedClass}`}>
                    {event.kind === "trial_end" ? "trial ends" : "renews"} {formatDate(event.eventDate)} (in{" "}
                    {event.daysLeft} days)
                  </span>
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {formatMoney(sub.price, sub.currency)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
