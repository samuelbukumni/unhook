// Which reminders are due today: 3 days before, 1 day before, and on the day
// of each renewal or trial end. Also lists the reminders for the next few
// days (for the /reminders page). Pure functions, no side effects.
//
// This file only has type imports so Node can run it directly for tests
// (`npm test` uses Node's built-in type stripping).

import type { ReminderChannel, Subscription } from "./types";

export const REMINDER_DAYS_BEFORE = [3, 1, 0] as const;

export type ReminderKind = "renewal" | "trial_end";

export type DueReminder = {
  subscription_id: string;
  service: string;
  kind: ReminderKind;
  event_date: string; // "YYYY-MM-DD" of the renewal or trial end
  days_before: (typeof REMINDER_DAYS_BEFORE)[number];
  channel: ReminderChannel;
};

function dayNumber(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

/**
 * Reminders due on `today` ("YYYY-MM-DD"). Cancelled subscriptions get none.
 * Trials are reminded about their trial end; everything else about its next
 * renewal. Pass subscriptions whose next_renewal_date is up to date.
 */
export function dueReminders(subs: Subscription[], today: string): DueReminder[] {
  const due: DueReminder[] = [];

  for (const sub of subs) {
    if (sub.status === "cancelled") continue;

    const isTrial = sub.status === "trial" && sub.trial_end_date !== null;
    const eventDate = isTrial ? sub.trial_end_date! : sub.next_renewal_date;
    const daysLeft = dayNumber(eventDate) - dayNumber(today);
    const match = REMINDER_DAYS_BEFORE.find((days) => days === daysLeft);
    if (match === undefined) continue;

    due.push({
      subscription_id: sub.id,
      service: sub.service,
      kind: isTrial ? "trial_end" : "renewal",
      event_date: eventDate,
      days_before: match,
      channel: sub.reminder_channel,
    });
  }

  // Most urgent first, then by service name.
  return due.sort((a, b) => a.days_before - b.days_before || a.service.localeCompare(b.service));
}

export type UpcomingReminder = DueReminder & {
  remind_on: string; // "YYYY-MM-DD" the reminder fires
};

/** "YYYY-MM-DD" plus whole days (UTC math, so no daylight-saving shifts). */
function plusDays(isoDate: string, days: number): string {
  return new Date((dayNumber(isoDate) + days) * 86_400_000).toISOString().slice(0, 10);
}

/**
 * Reminders that fire from `today` through `today + days - 1` (7 days by
 * default), soonest first. One renewal can appear up to three times (3 days
 * before, 1 day before, on the day).
 */
export function upcomingReminders(
  subs: Subscription[],
  today: string,
  days = 7,
): UpcomingReminder[] {
  const upcoming: UpcomingReminder[] = [];
  for (let offset = 0; offset < days; offset++) {
    const day = plusDays(today, offset);
    for (const reminder of dueReminders(subs, day)) {
      upcoming.push({ ...reminder, remind_on: day });
    }
  }
  return upcoming;
}
