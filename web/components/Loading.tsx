// A one-line loading message, announced politely to screen readers.

import { mutedClass } from "@/lib/ui";

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <p role="status" className={mutedClass}>
      {label}
    </p>
  );
}
