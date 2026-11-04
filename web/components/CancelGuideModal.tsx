"use client";

// Cancellation-guide modal: the saved guide's steps when one exists
// (labelled unverified), otherwise clearly-labelled general guidance.
// Opening this modal never cancels anything; status changes only through
// the explicit "Mark as cancelled" workflow on the subscription page.

import { findCancelGuide } from "@/lib/cancel-guides";
import { formatDate } from "@/lib/dates";
import type { Insight } from "@/lib/insights";
import { formatMoney } from "@/lib/subscriptions";
import type { Subscription } from "@/lib/types";
import { mutedClass } from "@/lib/ui";
import { Button, ButtonLink } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { StatusBadge } from "./ui/StatusBadge";

const GENERIC_STEPS = [
  "Visit the service's official website or application.",
  "Sign in to your account.",
  "Open Account Settings or Subscription Management.",
  "Locate the subscription.",
  "Follow the provider's cancellation process.",
  "Save the confirmation or reference number where available.",
];

export function CancelGuideModal({
  subscription: sub,
  warning,
  showViewLink = true,
  onClose,
}: {
  subscription: Subscription;
  /** Highest-priority cancellation insight for this subscription, if any. */
  warning?: Insight | null;
  showViewLink?: boolean;
  onClose: () => void;
}) {
  const guide = findCancelGuide(sub.service);
  const verifiedUrl = guide?.verified ? guide.cancel_url : null;

  return (
    <Modal
      open
      title="Cancellation Guide"
      subtitle="Follow these steps to manage your subscription."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {showViewLink && (
            <ButtonLink href={`/subscriptions/${sub.id}`} onClick={onClose}>
              View Subscription
            </ButtonLink>
          )}
          {verifiedUrl && (
            <ButtonLink href={verifiedUrl} target="_blank" rel="noopener noreferrer">
              Open Official Cancellation Page
              <span className="sr-only"> (opens in a new tab)</span>
            </ButtonLink>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">
            {sub.service} <span className={mutedClass}>{sub.plan}</span>
          </p>
          <StatusBadge status={sub.status} />
          <p className={`text-sm ${mutedClass}`}>
            {formatMoney(sub.price, sub.currency)}/{sub.billing_period} ·{" "}
            {sub.status === "cancelled" ? "access ends" : "next renewal"} {formatDate(sub.next_renewal_date)}
          </p>
        </div>

        {warning && (
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-medium">{warning.title}</p>
            <p>{warning.explanation}</p>
          </div>
        )}

        {guide ? (
          <div className="flex flex-col gap-2">
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {!guide.verified && (
              <p className={`text-xs ${mutedClass}`}>
                These steps haven&apos;t been verified yet, and services change their menus. Follow what
                you see on the official page.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">General guidance</p>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {GENERIC_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className={`text-xs ${mutedClass}`}>
              Unhook doesn&apos;t have service-specific instructions for {sub.service} yet, so treat
              these as general steps.
            </p>
          </div>
        )}

        <p className={`text-xs ${mutedClass}`}>
          Opening this guide doesn&apos;t cancel your subscription. After you&apos;ve cancelled with the
          provider, mark it as cancelled from the subscription page.
        </p>
      </div>
    </Modal>
  );
}
