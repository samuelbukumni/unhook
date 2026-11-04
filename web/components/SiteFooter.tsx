import Link from "next/link";

// The footer shown on every page: an accurate privacy note and attribution.
// Subscriptions are stored in the browser; only receipt text pasted on /add
// is sent to Meta's model for extraction, so the copy says exactly that.

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line dark:border-navy-800">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-1 px-4 py-4 text-xs text-navy-600 sm:flex-row dark:text-navy-100 sm:items-center sm:justify-between">
        <p>Your subscriptions stay in this browser. Receipt text you paste is sent to Meta&apos;s Muse Spark model for extraction only.</p>
        <p>
          <Link href="/settings" className="underline underline-offset-2 hover:text-navy-900 dark:hover:text-white">
            Currency settings
          </Link>{" "}
          · Built for the Meta Global Hackathon.
        </p>
      </div>
    </footer>
  );
}
