"use client";

// Lists the reminders that fire in the next 7 days (today included), grouped
// by day, using lib/reminders.ts. Data and "today" come from the browser, so
// the server render shows a loading line.

import Link from "next/link";
import { addDays, formatDate } from "@/lib/dates";
import { upcomingReminders, type UpcomingReminder } from "@/lib/reminders";
import { cardClass, emptyStateClass, mutedClass } from "@/lib/ui";
import { useSubscriptions, useToday } from "@/lib/use-subscriptions";
import { Loading } from "./Loading";
import { NotificationTest } from "./NotificationTest";

const WINDOW_DAYS = 7;

function dayLabel(date: string, today: string): string {
  if (date === today) return "Today";
  if (date === addDays(today, 1)) return "Tomorrow";
  return formatDate(date);
}

function describe(reminder: UpcomingReminder): string {
  const what = reminder.kind === "trial_end" ? "trial ends" : "renews";
  const when =
    reminder.days_before === 0 ? "today" : reminder.days_before === 1 ? "tomorrow" : `in ${reminder.days_before} days`;
  return `${reminder.service} ${what} ${when} (${formatDate(reminder.event_date)})`;
}

export function RemindersView() {
  const subscriptions = useSubscriptions();
  const today = useToday();

  if (!subscriptions || !today) {
    return <Loading label="Loading reminders…" />;
  }

  const reminders = upcomingReminders(subscriptions, today, WINDOW_DAYS);
  const days = [...new Set(reminders.map((r) => r.remind_on))];
  const sample = reminders[0] ? describe(reminders[0]) : "This is what an Unhook reminder looks like.";

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="test-heading" className={`flex flex-col gap-2 ${cardClass}`}>
        <h2 id="test-heading" className="font-medium">Try a notification</h2>
        <p className={`text-sm ${mutedClass}`}>
          Shows one browser notification now. Scheduled reminders aren&apos;t sent yet.
        </p>
        <NotificationTest body={sample} />
      </section>

      {days.length === 0 ? (
        <div className={emptyStateClass}>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">No reminders in the next {WINDOW_DAYS} days</p>
          <p className="text-sm">
            Nothing renews or ends its trial soon.{" "}
            <Link href="/" className="underline">See all subscriptions</Link>
          </p>
        </div>
      ) : (
        days.map((day) => (
          <section key={day} aria-labelledby={`day-${day}`} className="flex flex-col gap-2">
            <h2 id={`day-${day}`} className={`text-sm font-medium ${mutedClass}`}>
              {dayLabel(day, today)}
            </h2>
            <ul className="flex flex-col gap-2">
              {reminders
                .filter((r) => r.remind_on === day)
                .map((r) => (
                  <li key={`${r.subscription_id}-${r.days_before}`}>
                    <Link
                      href={`/subscriptions/${r.subscription_id}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    >
                      <span>{describe(r)}</span>
                      <span className={`text-xs ${mutedClass}`}>{r.channel === "push" ? "Push" : "Email"}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
