// Form field wrapper: consistent label placement and spacing for every form.
// The label is linked to its control with htmlFor/id (a single child gets a
// generated id); wrapping also keeps the whole row clickable.

import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { labelClass } from "@/lib/ui";

export function Field({
  label,
  check = false,
  children,
}: {
  label: string;
  /** Shows an amber "Check" tag (used for fields flagged by extraction review). */
  check?: boolean;
  children: ReactNode;
}) {
  const generatedId = useId();
  const single = Children.count(children) === 1 && isValidElement(children);
  const control = single
    ? cloneElement(children as ReactElement<{ id?: string }>, { id: generatedId })
    : children;

  return (
    <label className={labelClass} htmlFor={single ? generatedId : undefined}>
      <span className="flex items-center gap-2">
        {label}
        {check && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Check
          </span>
        )}
      </span>
      {control}
    </label>
  );
}
