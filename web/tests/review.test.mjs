// Tests for lib/review.ts (extraction review hints). Run from web/: npm test

import assert from "node:assert/strict";
import { test } from "node:test";
import { fieldsInIssues, needsReview, readConfidence, readIssues } from "../lib/review.ts";

test("readConfidence keeps numbers from 0 to 1 and drops anything else", () => {
  assert.equal(readConfidence(0.85), 0.85);
  assert.equal(readConfidence(0), 0);
  assert.equal(readConfidence(1), 1);
  for (const bad of [undefined, null, "0.9", 1.2, -0.1, NaN, Infinity, {}]) {
    assert.equal(readConfidence(bad), null, String(bad));
  }
});

test("readIssues keeps non-empty strings and ignores malformed values", () => {
  assert.deepEqual(readIssues(["Price unclear", "  ", 42, null, " Currency missing "]), [
    "Price unclear",
    "Currency missing",
  ]);
  assert.deepEqual(readIssues(undefined), []);
  assert.deepEqual(readIssues("Price unclear"), []);
  assert.equal(readIssues(Array.from({ length: 30 }, () => "x")).length, 20);
});

test("needsReview: low confidence or any issue; unknown confidence alone is fine", () => {
  assert.equal(needsReview(0.79, []), true);
  assert.equal(needsReview(0.8, []), false);
  assert.equal(needsReview(null, []), false);
  assert.equal(needsReview(0.95, ["Plan name guessed"]), true);
  assert.equal(needsReview(null, ["x"]), true);
});

test("fieldsInIssues matches field names and friendly labels, any case", () => {
  const fields = fieldsInIssues([
    "PRICE includes tax?",
    "trial_end_date was computed from today",
    "Currency symbol is ambiguous",
  ]);
  assert.deepEqual([...fields].sort(), ["currency", "price", "trial_end_date"]);
});

test("fieldsInIssues handles billing period and first charge wording", () => {
  assert.deepEqual([...fieldsInIssues(["Billing period not stated"])], ["billing_period"]);
  assert.deepEqual([...fieldsInIssues(["first_charge_date unknown"])], ["first_charge_date"]);
  assert.deepEqual([...fieldsInIssues(["Something else entirely"])], []);
});
