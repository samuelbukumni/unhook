"use client";

// The /add flow: paste receipt text and extract it with AI, or fill in the
// form by hand. Either way the user reviews the form and confirms before saving.
// After an extraction it shows the review banner and highlights flagged fields.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toISODate } from "@/lib/dates";
import { extractFromText, MAX_RECEIPT_LENGTH, type ExtractResult } from "@/lib/extraction";
import { fieldsInIssues } from "@/lib/review";
import { saveSubscription } from "@/lib/storage";
import { createSubscription, type NewSubscriptionInput } from "@/lib/subscriptions";
import { alertClass, h2Class, inputClass, mutedClass, primaryButtonClass } from "@/lib/ui";
import { NewSubscriptionForm, type FormDefaults } from "./NewSubscriptionForm";
import { ReviewBanner } from "./ReviewBanner";

const EMPTY: FormDefaults = {
  service: "",
  plan: "",
  price: "",
  currency: "",
  billing_period: "",
  trial_end_date: "",
  first_charge_date: "",
  notes: "",
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | {
      kind: "extracted";
      warning: string | null;
      confidence: number | null;
      issues: string[];
    };

/** A string value, or "" for null, missing, or the wrong type. */
function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Turns the route's answer into form defaults; unknowns stay empty. */
function toDefaults(result: ExtractResult): FormDefaults {
  const period = result.billing_period;
  return {
    service: text(result.service),
    plan: text(result.plan),
    price: typeof result.price === "number" ? String(result.price) : "",
    currency: text(result.currency),
    billing_period: period === "weekly" || period === "monthly" || period === "yearly" ? period : "",
    trial_end_date: text(result.trial_end_date),
    first_charge_date: text(result.first_charge_date),
    notes: text(result.notes),
  };
}

export function AddSubscription() {
  const router = useRouter();
  const [receiptText, setReceiptText] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [defaults, setDefaults] = useState<FormDefaults>(EMPTY);
  const [formVersion, setFormVersion] = useState(0); // bump to reload the form

  async function handleExtract() {
    setStatus({ kind: "loading" });
    try {
      const result = await extractFromText(receiptText);
      setDefaults(toDefaults(result));
      setFormVersion((v) => v + 1);
      const warning =
        result.billing_period === "one_time"
          ? "This looks like a one-time purchase, not a subscription. Pick a billing period if it does repeat."
          : null;
      setStatus({
        kind: "extracted",
        warning,
        confidence: result.confidence ?? null,
        issues: result.issues ?? [],
      });
    } catch (error) {
      setStatus({ kind: "error", message: (error as Error).message });
    }
  }

  function handleSave(input: NewSubscriptionInput) {
    // Extracted details keep the model's confidence (null when it gave none);
    // manual entries come straight from the user (confidence 1).
    const confidence = status.kind === "extracted" ? status.confidence : 1;
    const sub = createSubscription(input, toISODate(new Date()), confidence);
    saveSubscription(sub);
    router.push(`/subscriptions/${sub.id}`);
  }

  const loading = status.kind === "loading";

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 id="receipt-heading" className={h2Class}>Paste a receipt or checkout page</h2>
        <textarea
          aria-labelledby="receipt-heading"
          value={receiptText}
          onChange={(e) => setReceiptText(e.target.value)}
          rows={6}
          maxLength={MAX_RECEIPT_LENGTH}
          placeholder="Paste the email or checkout text here…"
          className={inputClass}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExtract}
            disabled={loading || !receiptText.trim()}
            aria-busy={loading}
            className={primaryButtonClass}
          >
            {loading ? "Reading receipt…" : "Extract details"}
          </button>
          <span className={`text-xs ${mutedClass}`} aria-label={`${receiptText.length} of ${MAX_RECEIPT_LENGTH} characters`}>
            {receiptText.length}/{MAX_RECEIPT_LENGTH}
          </span>
        </div>
        {status.kind === "error" && (
          <p role="alert" className={alertClass}>
            {status.message} You can still fill in the form below by hand.
          </p>
        )}
        {status.kind === "extracted" && (
          <ReviewBanner confidence={status.confidence} issues={status.issues} warning={status.warning} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={h2Class}>
          {status.kind === "extracted" ? "Review the details" : "Or enter it manually"}
        </h2>
        <NewSubscriptionForm
          key={formVersion}
          defaults={defaults}
          flagged={status.kind === "extracted" ? fieldsInIssues(status.issues) : undefined}
          onSave={handleSave}
        />
      </section>
    </div>
  );
}
