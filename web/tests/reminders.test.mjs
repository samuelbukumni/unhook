// Tests for lib/reminders.ts (dueReminders, upcomingReminders) using Node's built-in test runner.
// Run from web/: npm test   (needs Node 22.18+ or 23.6+, which strip
// TypeScript types natively; on Node 22.6-22.17 add --experimental-strip-types)

import assert from "node:assert/strict";
import { test } from "node:test";
import { dueReminders, upcomingReminders } from "../lib/reminders.ts";

const TODAY = "2026-10-30";

/** A minimal active monthly subscription; override fields per test. */
function sub(overrides = {}) {
  return {
    id: "sub-1",
    service: "TestService",
    plan: "Basic",
    price: 10,
    currency: "USD",
    billing_period: "monthly",
    trial_end_date: null,
    first_charge_date: "2026-01-01",
    next_renewal_date: "2026-11-02",
    status: "active",
    cancel_url: null,
    notes: "",
    confidence: 1,
    reminder_channel: "push",
    ...overrides,
  };
}

test("renewal 3 days away is due (across a month boundary)", () => {
  const [reminder] = dueReminders([sub({ next_renewal_date: "2026-11-02" })], TODAY);
  assert.deepEqual(reminder, {
    subscription_id: "sub-1",
    service: "TestService",
    kind: "renewal",
    event_date: "2026-11-02",
    days_before: 3,
    channel: "push",
  });
});

test("renewal 1 day away and on the day are due", () => {
  assert.equal(dueReminders([sub({ next_renewal_date: "2026-10-31" })], TODAY)[0].days_before, 1);
  assert.equal(dueReminders([sub({ next_renewal_date: "2026-10-30" })], TODAY)[0].days_before, 0);
});

test("2, 4, and 30 days away are not due, and past dates are not due", () => {
  for (const date of ["2026-11-01", "2026-11-03", "2026-11-29", "2026-10-29"]) {
    assert.deepEqual(dueReminders([sub({ next_renewal_date: date })], TODAY), [], date);
  }
});

test("cancelled subscriptions never get reminders", () => {
  assert.deepEqual(dueReminders([sub({ status: "cancelled", next_renewal_date: TODAY })], TODAY), []);
});

test("trials are reminded about the trial end date", () => {
  const trial = sub({ status: "trial", trial_end_date: "2026-10-31", next_renewal_date: "2026-11-15" });
  const [reminder] = dueReminders([trial], TODAY);
  assert.equal(reminder.kind, "trial_end");
  assert.equal(reminder.event_date, "2026-10-31");
  assert.equal(reminder.days_before, 1);
});

test("a trial whose renewal is close but trial end is not gets no reminder", () => {
  const trial = sub({ status: "trial", trial_end_date: "2026-11-20", next_renewal_date: "2026-11-02" });
  assert.deepEqual(dueReminders([trial], TODAY), []);
});

test("a trial with no end date falls back to the renewal date", () => {
  const trial = sub({ status: "trial", trial_end_date: null, next_renewal_date: TODAY });
  assert.equal(dueReminders([trial], TODAY)[0].kind, "renewal");
});

test("uses each subscription's reminder channel", () => {
  const [reminder] = dueReminders([sub({ reminder_channel: "email", next_renewal_date: TODAY })], TODAY);
  assert.equal(reminder.channel, "email");
});

test("handles leap days and year ends", () => {
  assert.equal(dueReminders([sub({ next_renewal_date: "2028-03-01" })], "2028-02-27")[0].days_before, 3);
  assert.equal(dueReminders([sub({ next_renewal_date: "2027-01-01" })], "2026-12-31")[0].days_before, 1);
});

test("sorts most urgent first, then by service name", () => {
  const result = dueReminders(
    [
      sub({ id: "a", service: "Zeta", next_renewal_date: "2026-11-02" }),
      sub({ id: "b", service: "Beta", next_renewal_date: TODAY }),
      sub({ id: "c", service: "Alpha", next_renewal_date: "2026-11-02" }),
    ],
    TODAY,
  );
  assert.deepEqual(result.map((r) => r.subscription_id), ["b", "c", "a"]);
});

test("empty list gives no reminders", () => {
  assert.deepEqual(dueReminders([], TODAY), []);
});

test("upcomingReminders covers today through 6 days ahead", () => {
  // Renews Nov 3: reminders fire Oct 31 (3 days), Nov 2 (1 day), Nov 3 (day of).
  const result = upcomingReminders([sub({ next_renewal_date: "2026-11-03" })], TODAY);
  assert.deepEqual(
    result.map((r) => [r.remind_on, r.days_before]),
    [["2026-10-31", 3], ["2026-11-02", 1], ["2026-11-03", 0]],
  );
});

test("upcomingReminders stops after the window and skips cancelled", () => {
  // Nov 6 is 7 days after Oct 30, so its "on the day" reminder is outside.
  const result = upcomingReminders(
    [sub({ next_renewal_date: "2026-11-06" }), sub({ id: "x", status: "cancelled", next_renewal_date: TODAY })],
    TODAY,
  );
  assert.deepEqual(result.map((r) => [r.remind_on, r.days_before]), [["2026-11-03", 3], ["2026-11-05", 1]]);
});

test("upcomingReminders handles month and year ends, and custom windows", () => {
  const result = upcomingReminders([sub({ next_renewal_date: "2027-01-01" })], "2026-12-30", 3);
  assert.deepEqual(result.map((r) => r.remind_on), ["2026-12-31", "2027-01-01"]);
  assert.deepEqual(upcomingReminders([], TODAY), []);
});
