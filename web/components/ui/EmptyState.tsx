// Shared empty state: a title, a short explanation, and an optional action.

import type { ReactNode } from "react";
import { emptyStateClass } from "@/lib/ui";

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={emptyStateClass}>
      <p className="font-medium text-navy-900 dark:text-navy-50">{title}</p>
      {children && <div className="text-sm">{children}</div>}
      {action}
    </div>
  );
}
