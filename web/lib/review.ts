// Review hints for an AI extraction: reads the optional `confidence` and
// `issues` fields defensively (old responses don't have them, and malformed
// values are ignored), decides whether the result needs a closer look, and
// works out which form fields each issue mentions. Pure, no side effects.
//
// No runtime imports, so Node can run this file directly for tests.

/** Below this confidence the /add page shows a "Needs review" banner. */
export const REVIEW_THRESHOLD = 0.8;

/** The extracted fields the /add form shows. */
export type ReviewField =
  | "service"
  | "plan"
  | "price"
  | "currency"
  | "billing_period"
  | "trial_end_date"
  | "first_charge_date"
  | "notes";

// Words an issue might use for each field (lowercase, "_" written as a space).
const FIELD_TERMS: Record<ReviewField, string[]> = {
  service: ["service", "merchant", "vendor", "company"],
  plan: ["plan", "tier"],
  price: ["price", "amount", "cost", "total"],
  currency: ["currency"],
  billing_period: ["billing period", "billing cycle", "frequency", "interval"],
  trial_end_date: ["trial end", "trial"],
  first_charge_date: ["first charge", "charge date"],
  notes: ["notes", "note"],
};

/** A number from 0 to 1, or null when missing or malformed. */
export function readConfidence(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : null;
}

/** Non-empty strings from an array (max 20); anything else becomes []. */
export function readIssues(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

/** True when confidence is known and low, or there is at least one issue. */
export function needsReview(confidence: number | null, issues: string[]): boolean {
  return (confidence !== null && confidence < REVIEW_THRESHOLD) || issues.length > 0;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The form fields mentioned in any issue (case-insensitive word match). */
export function fieldsInIssues(issues: string[]): Set<ReviewField> {
  const found = new Set<ReviewField>();
  for (const issue of issues) {
    const text = issue.toLowerCase().replace(/_/g, " ");
    for (const [field, terms] of Object.entries(FIELD_TERMS) as [ReviewField, string[]][]) {
      if (terms.some((term) => new RegExp(`\\b${escapeRegExp(term)}`).test(text))) {
        found.add(field);
      }
    }
  }
  return found;
}
