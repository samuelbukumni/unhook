// Tests for lib/urgency.ts (urgentEvents, upcomingEvents). Run: npm test

import assert from "node:assert/strict";
import { test } from "node:test";
import { urgentEvents, upcomingEvents } from "../lib/urgency.ts";

const TODAY = "2026-11-03";

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
    next_renewal_date: "2026-12-01",
    status: "active",
    cancel_url: null,
    notes: "",
    confidence: 1,
    reminder_channel: "push",
    ...overrides,
  };
}

test("renewing today is critical, tomorrow high, within 3 days upcoming", () => {
  const events = urgentEvents(
    [
      sub({ id: "a", next_renewal_date: "2026-11-03" }),
      sub({ id: "b", next_renewal_date: "2026-11-04" }),
      sub({ id: "c", next_renewal_date: "2026-11-06" }),
    ],
    TODAY,
  );
  assert.deepEqual(events.map((e) => [e.subscription.id, e.level]), [
    ["a", "critical"],
    ["b", "high"],
    ["c", "upcoming"],
  ]);
});

test("renewals beyond 3 days are upcoming, beyond 7 are neither", () => {
  const soon = sub({ id: "soon", next_renewal_date: "2026-11-08" }); // 5 days
  assert.deepEqual(upcomingEvents([soon], TODAY).map((e) => e.subscription.id), ["soon"]);
  assert.deepEqual(urgentEvents([soon], TODAY), []);
  const far = sub({ id: "far", next_renewal_date: "2026-11-20" });
  assert.deepEqual(upcomingEvents([far], TODAY), []);
});

test("cancelled subscriptions never appear", () => {
  const cancelled = sub({ status: "cancelled", next_renewal_date: TODAY });
  assert.deepEqual(urgentEvents([cancelled], TODAY), []);
  assert.deepEqual(upcomingEvents([cancelled], TODAY), []);
});

test("trials are judged by trial end, not renewal date", () => {
  const trial = sub({ status: "trial", trial_end_date: "2026-11-04", next_renewal_date: "2026-12-01" });
  const [event] = urgentEvents([trial], TODAY);
  assert.equal(event.kind, "trial_end");
  assert.equal(event.eventDate, "2026-11-04");
  assert.equal(event.level, "high");
});

test("a trial without an end date falls back to its renewal date", () => {
  const trial = sub({ status: "trial", trial_end_date: null, next_renewal_date: "2026-11-05" });
  const [event] = urgentEvents([trial], TODAY);
  assert.equal(event.kind, "renewal");
  assert.equal(event.daysLeft, 2);
});

test("past dates and empty lists produce nothing", () => {
  assert.deepEqual(urgentEvents([sub({ next_renewal_date: "2026-11-01" })], TODAY), []);
  assert.deepEqual(urgentEvents([], TODAY), []);
  assert.deepEqual(upcomingEvents([], TODAY), []);
});
