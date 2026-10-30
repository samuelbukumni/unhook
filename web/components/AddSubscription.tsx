"use client";

// The /add flow: paste receipt text and extract it with AI, or fill in the
// form by hand. Either way the user reviews the form and confirms before saving.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toISODate } from "@/lib/dates";
import { extractFromText, MAX_RECEIPT_LENGTH, type ExtractResult } from "@/lib/extraction";
import { saveSubscription } from "@/lib/storage";
import { createSubscription, type NewSubscriptionInput } from "@/lib/subscriptions";
import { NewSubscriptionForm, type FormDefaults } from "./NewSubscriptionForm";

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
  | { kind: "extracted"; warning: string | null };

/** Turns the route's answer into form defaults; unknowns stay empty. */
function toDefaults(result: ExtractResult): FormDefaults {
  const period = result.billing_period;
  return {
    service: result.service,
    plan: result.plan ?? "",
    price: result.price === null ? "" : String(result.price),
    currency: result.currency ?? "",
    billing_period: period === "weekly" || period === "monthly" || period === "yearly" ? period : "",
    trial_end_date: result.trial_end_date ?? "",
    first_charge_date: result.first_charge_date ?? "",
    notes: result.notes,
  };
}

export function AddSubscription() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [defaults, setDefaults] = useState<FormDefaults>(EMPTY);
  const [formVersion, setFormVersion] = useState(0); // bump to reload the form

  async function handleExtract() {
    setStatus({ kind: "loading" });
    try {
      const result = await extractFromText(text);
      setDefaults(toDefaults(result));
      setFormVersion((v) => v + 1);
      const warning =
        result.billing_period === "one_time"
          ? "This looks like a one-time purchase, not a subscription. Pick a billing period if it does repeat."
          : null;
      setStatus({ kind: "extracted", warning });
    } catch (error) {
      setStatus({ kind: "error", message: (error as Error).message });
    }
  }

  function handleSave(input: NewSubscriptionInput) {
    // Extracted details haven't been verified yet (confidence null); manual
    // entries come straight from the user (confidence 1).
    const confidence = status.kind === "extracted" ? null : 1;
    const sub = createSubscription(input, toISODate(new Date()), confidence);
    saveSubscription(sub);
    router.push(`/subscriptions/${sub.id}`);
  }

  const loading = status.kind === "loading";

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Paste a receipt or checkout page</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          maxLength={MAX_RECEIPT_LENGTH}
          placeholder="Paste the email or checkout text here…"
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExtract}
            disabled={loading || !text.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {loading ? "Reading receipt…" : "Extract details"}
          </button>
          <span className="text-xs text-zinc-500">
            {text.length}/{MAX_RECEIPT_LENGTH}
          </span>
        </div>
        {status.kind === "error" && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {status.message} You can still fill in the form below by hand.
          </p>
        )}
        {status.kind === "extracted" && (
          <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
            Details extracted. Check them below, fix anything wrong, then save.
            {status.warning && <> {status.warning}</>}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">
          {status.kind === "extracted" ? "Review the details" : "Or enter it manually"}
        </h2>
        <NewSubscriptionForm key={formVersion} defaults={defaults} onSave={handleSave} />
      </section>
    </div>
  );
}
