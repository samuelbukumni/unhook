// Urgency classification for the dashboard's Action Required section.
// Pure functions over saved subscriptions: trials are judged by their trial
// end, everything else by its next renewal. Cancelled subscriptions never
// appear. One event per subscription, so nothing is listed twice.
//
// No runtime imports (day math is inlined, like lib/reminders.ts), so Node
// can run this file directly for tests.

import type { Subscription } from "./types";

function dayNumber(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

export type UrgencyLevel = "critical" | "high" | "upcoming";
export type UrgentKind = "trial_end" | "renewal";

export type UrgentEvent = {
  subscription: Subscription;
  kind: UrgentKind;
  /** "YYYY-MM-DD" of the trial end or renewal. */
  eventDate: string;
  /** Whole days from today until the event (0 = today). */
  daysLeft: number;
  level: UrgencyLevel;
};

export const URGENT_WINDOW_DAYS = 3;
export const UPCOMING_WINDOW_DAYS = 7;

function levelFor(daysLeft: number): UrgencyLevel {
  if (daysLeft <= 0) return "critical";
  if (daysLeft === 1) return "high";
  return "upcoming";
}

function eventFor(sub: Subscription, today: string): UrgentEvent | null {
  if (sub.status === "cancelled") return null;
  const isTrial = sub.status === "trial" && sub.trial_end_date !== null;
  const eventDate = isTrial ? sub.trial_end_date! : sub.next_renewal_date;
  if (!eventDate) return null;
  const daysLeft = dayNumber(eventDate) - dayNumber(today);
  if (daysLeft < 0) return null;
  return {
    subscription: sub,
    kind: isTrial ? "trial_end" : "renewal",
    eventDate,
    daysLeft,
    level: levelFor(daysLeft),
  };
}

function byUrgency(a: UrgentEvent, b: UrgentEvent): number {
  return a.daysLeft - b.daysLeft || a.subscription.service.localeCompare(b.subscription.service);
}

/** Events due today through `today + URGENT_WINDOW_DAYS`, most urgent first. */
export function urgentEvents(subs: Subscription[], today: string): UrgentEvent[] {
  return subs
    .map((sub) => eventFor(sub, today))
    .filter((event): event is UrgentEvent => event !== null && event.daysLeft <= URGENT_WINDOW_DAYS)
    .sort(byUrgency);
}

/** Events after the urgent window through `today + UPCOMING_WINDOW_DAYS`. */
export function upcomingEvents(subs: Subscription[], today: string): UrgentEvent[] {
  return subs
    .map((sub) => eventFor(sub, today))
    .filter(
      (event): event is UrgentEvent =>
        event !== null && event.daysLeft > URGENT_WINDOW_DAYS && event.daysLeft <= UPCOMING_WINDOW_DAYS,
    )
    .sort(byUrgency);
}
