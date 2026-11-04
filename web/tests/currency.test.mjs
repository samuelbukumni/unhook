// Tests for lib/currency.ts (convert, hasRate). Run: npm test

import assert from "node:assert/strict";
import { test } from "node:test";
import { convert, hasRate } from "../lib/currency.ts";

const prefs = {
  target: "NGN",
  rates: { USD: { rate: 1500, updatedAt: "2026-11-01" } },
};

test("converts with the configured rate and rounds to cents", () => {
  const result = convert(105.13, "USD", prefs);
  assert.equal(result.amount, 157695);
  assert.equal(result.rate, 1500);
  assert.equal(result.from, "USD");
  assert.equal(result.to, "NGN");
  assert.equal(convert(10.005, "USD", prefs).amount, 15007.5);
});

test("same currency and missing rates return null", () => {
  assert.equal(convert(50, "NGN", prefs), null);
  assert.equal(convert(50, "EUR", prefs), null);
  assert.equal(convert(50, "USD", { target: "NGN", rates: {} }), null);
});

test("invalid rates are treated as unconfigured", () => {
  for (const rate of [0, -5, NaN, Infinity]) {
    const p = { target: "NGN", rates: { USD: { rate, updatedAt: "2026-11-01" } } };
    assert.equal(convert(10, "USD", p), null, String(rate));
  }
});

test("updating the rate changes the estimate; originals are untouched", () => {
  const before = convert(20, "USD", prefs);
  const after = convert(20, "USD", {
    target: "NGN",
    rates: { USD: { rate: 1600, updatedAt: "2026-11-03" } },
  });
  assert.equal(before.amount, 30000);
  assert.equal(after.amount, 32000);
  assert.equal(after.updatedAt, "2026-11-03");
});

test("hasRate mirrors convert", () => {
  assert.equal(hasRate("USD", prefs), true);
  assert.equal(hasRate("EUR", prefs), false);
  assert.equal(hasRate("NGN", prefs), false);
});
