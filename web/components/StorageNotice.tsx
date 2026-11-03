"use client";

// A warning under the header when saved data couldn't be read (for example,
// corrupt localStorage). Shows nothing on the server or when all is well.

import { useLoadError } from "@/lib/use-subscriptions";

export function StorageNotice() {
  const error = useLoadError();
  if (!error) return null;
  return (
    <div role="alert" className="mx-auto mt-4 w-full max-w-2xl px-4">
      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        {error} It isn&apos;t shown, and saving a change will replace it.
      </p>
    </div>
  );
}
