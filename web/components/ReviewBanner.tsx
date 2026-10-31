// What the /add page shows after an extraction: a small confidence indicator,
// plus a "Needs review" banner listing the model's issues when confidence is
// below 80% or there are any issues. Old responses without these fields show
// "Confidence: unknown" and no banner.

import { needsReview } from "@/lib/review";

export function ConfidenceBadge({ confidence }: { confidence: number | null }) {
  if (confidence === null) {
    return <span className="text-xs text-zinc-500">Confidence: unknown</span>;
  }
  const percent = Math.round(confidence * 100);
  const tone =
    confidence >= 0.8
      ? "bg-green-100 text-green-800"
      : confidence >= 0.5
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>
      Confidence: {percent}%
    </span>
  );
}

export function ReviewBanner({
  confidence,
  issues,
  warning,
}: {
  confidence: number | null;
  issues: string[];
  warning: string | null;
}) {
  if (!needsReview(confidence, issues)) {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-200">
        <p>
          Details extracted. Check them below, fix anything wrong, then save.
          {warning && <> {warning}</>}
        </p>
        <ConfidenceBadge confidence={confidence} />
      </div>
    );
  }

  return (
    <div role="status" className="flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">Needs review</p>
        <ConfidenceBadge confidence={confidence} />
      </div>
      <p>
        The AI wasn&apos;t sure about some details. Highlighted fields are worth a second look; you can
        still edit everything and save.
        {warning && <> {warning}</>}
      </p>
      {issues.length > 0 && (
        <ul className="list-disc space-y-1 pl-5">
          {issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
