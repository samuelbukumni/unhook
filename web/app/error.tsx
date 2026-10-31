"use client";

// Fallback for unexpected errors on any page: a short message and a
// "Try again" button. The root layout (header and footer) stays visible.

import Link from "next/link";
import { useEffect } from "react";
import { h1Class, mutedClass, pageClass, primaryButtonClass } from "@/lib/ui";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={pageClass}>
      <h1 className={h1Class}>Something went wrong</h1>
      <p className={mutedClass}>
        This page hit an unexpected error. Your saved data is still in this browser.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className={primaryButtonClass}>
          Try again
        </button>
        <Link href="/" className="self-center text-sm underline">
          Go to your subscriptions
        </Link>
      </div>
    </main>
  );
}
