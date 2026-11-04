// Page heading block: title, optional one-line description, optional action.

import type { ReactNode } from "react";
import { h1Class, mutedClass } from "@/lib/ui";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className={h1Class}>{title}</h1>
        {description && <p className={mutedClass}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
