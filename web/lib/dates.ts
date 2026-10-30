// Tiny helpers for "YYYY-MM-DD" calendar dates.
// All math is done in UTC so daylight-saving changes never shift a day.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** A Date's calendar day (in the server's time zone) as "YYYY-MM-DD". */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toUTCms(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Adds (or subtracts) whole days to a "YYYY-MM-DD" date. */
export function addDays(isoDate: string, days: number): string {
  return new Date(toUTCms(isoDate) + days * MS_PER_DAY)
    .toISOString()
    .slice(0, 10);
}

/**
 * Adds whole months to a "YYYY-MM-DD" date. If the day doesn't exist in the
 * target month (Jan 31 + 1 month), it uses that month's last day (Feb 28/29).
 */
export function addMonths(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const firstOfTarget = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(
    Date.UTC(firstOfTarget.getUTCFullYear(), firstOfTarget.getUTCMonth() + 1, 0),
  ).getUTCDate();
  firstOfTarget.setUTCDate(Math.min(d, lastDay));
  return firstOfTarget.toISOString().slice(0, 10);
}

/** Whole days from `fromDate` to `toDate` (negative if `toDate` is earlier). */
export function daysBetween(fromDate: string, toDate: string): number {
  return Math.round((toUTCms(toDate) - toUTCms(fromDate)) / MS_PER_DAY);
}

/** Formats "2026-11-02" as "Nov 2, 2026" for display. */
export function formatDate(isoDate: string): string {
  return new Date(toUTCms(isoDate)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
